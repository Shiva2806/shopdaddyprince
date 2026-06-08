import GoogleProvider from "next-auth/providers/google";
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
