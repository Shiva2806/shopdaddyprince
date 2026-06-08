import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// Use this ONLY in Server Components, API Routes, and Server Actions.
// It uses the service role key to bypass RLS, allowing secure server-side queries.
export const createAdminClient = () => {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must only be called on the server.");
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
