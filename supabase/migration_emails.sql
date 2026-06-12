-- =============================================================================
-- Migration: Create tables for Email Logging, Newsletters, and Cart Tracking
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for newsletter_subscribers
DROP POLICY IF EXISTS "newsletter_subscribers: public insert" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers: public insert" ON public.newsletter_subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "newsletter_subscribers: admin all" ON public.newsletter_subscribers;
CREATE POLICY "newsletter_subscribers: admin all" ON public.newsletter_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );


-- 2. Create carts table
CREATE TABLE IF NOT EXISTS public.carts (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  items      jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  email_sent boolean NOT NULL DEFAULT false
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for carts
DROP POLICY IF EXISTS "carts: owner read" ON public.carts;
CREATE POLICY "carts: owner read" ON public.carts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts: owner write" ON public.carts;
CREATE POLICY "carts: owner write" ON public.carts
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "carts: admin read" ON public.carts;
CREATE POLICY "carts: admin read" ON public.carts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );


-- 3. Create email_logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email text NOT NULL,
  recipient_name  text,
  email_type      text NOT NULL, -- 'welcome', 'newsletter_welcome', 'order_confirmation', 'order_shipped', 'order_delivered', 'abandoned_cart', 'collection_broadcast'
  subject         text NOT NULL,
  resend_id       text UNIQUE,
  status          text NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  metadata        jsonb,
  error           text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for quick lookups
CREATE INDEX IF NOT EXISTS email_logs_resend_id_idx ON public.email_logs(resend_id);
CREATE INDEX IF NOT EXISTS email_logs_recipient_email_idx ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON public.email_logs(status);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Setup RLS Policies for email_logs
DROP POLICY IF EXISTS "email_logs: admin all" ON public.email_logs;
CREATE POLICY "email_logs: admin all" ON public.email_logs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
