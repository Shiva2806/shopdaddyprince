-- =============================================================================
-- Migration: Secure Profiles Update Policy (Prevent Privilege Escalation)
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Drop existing profiles self-update policy
DROP POLICY IF EXISTS "profiles: self update" ON public.profiles;

-- 2. Re-create the self-update policy with strict WITH CHECK constraints
CREATE POLICY "profiles: self update" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND (
      (CASE 
        WHEN (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'customer' THEN role = 'customer'
        ELSE true
       END)
    )
  );
