import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/layout/AuthProvider";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import CookieConsent from "@/components/layout/CookieConsent";
import WelcomePopup from "@/components/layout/WelcomePopup";
import LoginModal from "@/components/auth/LoginModal";

export const metadata: Metadata = {
  metadataBase: new URL("https://shopdaddyprince.com"),
  title: {
    default: "Daddy Prince | Fine Indian Arts & Gallery",
    template: "%s | Daddy Prince",
  },
  description:
    "Discover rare traditional Indian artwork, handcrafted textiles, and timeless artifacts. Curated for collectors who value authenticity.",
  keywords: ["indian art", "handcrafted", "paintings", "artifacts", "fine art"],
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
    ],
  },
  openGraph: {
    type: "website",
    siteName: "Daddy Prince",
    url: "https://shopdaddyprince.com",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Daddy Prince - Fine Indian Arts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daddy Prince | Fine Indian Arts & Gallery",
    description:
      "Discover rare traditional Indian artwork, handcrafted textiles, and timeless artifacts. Curated for collectors who value authenticity.",
    images: ["/banner.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem("dp-theme");
                  var theme = saved || "light";
                  document.documentElement.setAttribute("data-theme", theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <CookieConsent />
            <WelcomePopup />
            <LoginModal />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-jost)",
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
