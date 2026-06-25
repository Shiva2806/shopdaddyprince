"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { trackLogin, trackSignUp } from "@/lib/analytics";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Y82J8L3Z0R";
const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || "p7bhr6pxzn";

function TrackingHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views and searches on route changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      const searchStr = searchParams.toString();
      const pagePath = pathname + (searchStr ? `?${searchStr}` : "");
      
      window.gtag("config", GA_MEASUREMENT_ID, {
        page_path: pagePath,
        page_title: document.title,
      });

      // Automatically track search if a query parameter "q", "query", or "search" is present
      const searchQuery = searchParams.get("q") || searchParams.get("query") || searchParams.get("search");
      if (searchQuery) {
        window.gtag("event", "search", {
          search_term: searchQuery,
        });
      }
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsProvider() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const authTracked = sessionStorage.getItem("dp-auth-tracked");
      if (!authTracked) {
        const isNewUser = (session.user as any).isNewUser;
        const method = session.user.email?.includes("@phone.daddyprince.com") ? "phone_otp" : "google";
        if (isNewUser) {
          trackSignUp(method);
        } else {
          trackLogin(method);
        }
        sessionStorage.setItem("dp-auth-tracked", "true");
      }
    } else if (status === "unauthenticated") {
      sessionStorage.removeItem("dp-auth-tracked");
    }
  }, [status, session]);

  useEffect(() => {
    const initializeTracking = () => {
      if (typeof window === "undefined") return;

      const consent = localStorage.getItem("dp-cookie-consent");
      if (consent === "accepted") {
        // Load Google Analytics 4
        if (GA_MEASUREMENT_ID && !window.gtag) {
          const gaScript = document.createElement("script");
          gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
          gaScript.async = true;
          document.head.appendChild(gaScript);

          const dataLayer = (window.dataLayer = window.dataLayer || []);
          window.gtag = function () {
            dataLayer.push(arguments);
          };
          window.gtag("js", new Date());
          window.gtag("config", GA_MEASUREMENT_ID, {
            send_page_view: false, // Managed manually on route change inside TrackingHandler
          });
        }

        // Load Microsoft Clarity
        if (CLARITY_PROJECT_ID && !window.clarity) {
          (function (c: any, l: any, a: any, r: any, i: any, t?: any, y?: any) {
            c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
            t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
            y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
          })(window, document, "clarity", "script", CLARITY_PROJECT_ID);
        }
      }
    };

    // Check on mount
    initializeTracking();

    // Listen for custom consent update event
    window.addEventListener("cookie-consent-updated", initializeTracking);
    return () => {
      window.removeEventListener("cookie-consent-updated", initializeTracking);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <TrackingHandler />
    </Suspense>
  );
}
