-- =============================================================================
-- Migration: Secure Orders Policy (Prevent Direct Order Insertion / RLS Bypass)
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Drop the owner insert policy on public.orders
DROP POLICY IF EXISTS "orders: owner insert" ON public.orders;
