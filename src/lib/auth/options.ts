import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createAdminClient } from "@/lib/supabase/admin";
import type { NextAuthOptions } from "next-auth";
import crypto from "crypto";

function getDeterministicUuid(input: string): string {
  const hash = crypto.createHash("sha256").update(input).digest("hex");
  const part1 = hash.slice(0, 8);
  const part2 = hash.slice(8, 12);
  const part3 = "4" + hash.slice(13, 16);
  const part4 = ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hash.slice(18, 20);
  const part5 = hash.slice(20, 32);
  return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Phone OTP",
      credentials: {
        phone: { label: "Phone Number", type: "text" },
        otp: { label: "One-Time Password", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          throw new Error("Phone number and OTP are required");
        }

        const { phone, otp } = credentials;
        const supabase = createAdminClient() as any;

        // 1. Verify OTP with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          phone,
          token: otp,
          type: "sms",
        });

        if (error || !data.user) {
          throw new Error(error?.message || "Invalid or expired OTP");
        }

        const user = data.user;

        // 2. Sync profile in public.profiles
        const dummyEmail = `${phone.replace(/[^\d]/g, "")}@phone.daddyprince.com`;

        // Check if profile exists
        const { data: existingProfile, error: fetchErr } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchErr) {
          console.error("Error checking user profile:", fetchErr);
          throw new Error("Authentication database error");
        }

        if (!existingProfile) {
          const { error: insertErr } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: dummyEmail,
              full_name: `Patron ${phone}`,
              phone: phone,
              role: "customer",
            });

          if (insertErr) {
            console.error("Error creating user profile:", insertErr);
            throw new Error("Failed to initialize user account");
          }
        } else {
          // Update phone number if it wasn't populated
          await supabase
            .from("profiles")
            .update({ phone, updated_at: new Date().toISOString() })
            .eq("id", user.id);
        }

        return {
          id: user.id,
          email: dummyEmail,
          name: `Patron ${phone}`,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const deterministicUuid = getDeterministicUuid(user.email!);
        user.id = deterministicUuid; // Override with deterministic UUID format
        
        const supabase = createAdminClient() as any;
        
        // Check if profile already exists in public.profiles
        const { data: existing, error: fetchError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (fetchError) {
          console.error("Error checking existing user profile:", fetchError);
          return false; // Fail login flow if query errors
        }

        if (!existing) {
          // Create new profile for first-time login
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email!,
              full_name: user.name,
              avatar_url: user.image,
              role: "customer",
            });

          if (insertError) {
            console.error("Error creating profile for Google user:", insertError);
            return false;
          }

          // Dispatch Welcome Email
          try {
            console.log(`[WELCOME EMAIL STARTED] welcome email triggered for first-time Google sign-up: ${user.email}`);
            const { getWelcomeEmail } = await import("@/utils/emailTemplates");
            const { sendEmail } = await import("@/lib/resend");
            const { subject, html } = getWelcomeEmail(user.name || "Collector", user.email!);
            
            const res = await sendEmail({
              to: user.email!,
              subject,
              html,
              emailType: "welcome",
              recipientName: user.name || "Collector",
            });

            if (res.success) {
              console.log(`[WELCOME EMAIL SENT] Recipient: ${user.email!}, ID: ${res.resendId}`);
            } else {
              console.error(`[WELCOME EMAIL FAILED] Recipient: ${user.email!}, Error:`, res.error);
            }
          } catch (emailErr: any) {
            console.error(`[WELCOME EMAIL FAILED] Recipient: ${user.email!}, Exception:`, emailErr);
          }
        } else {
          // Update name and avatar if they changed on Google side
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: user.name,
              avatar_url: user.image,
            })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error updating profile for Google user:", updateError);
          }
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
