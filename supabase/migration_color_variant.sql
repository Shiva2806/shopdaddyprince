-- =============================================================================
-- Migration: Add color column to product_variants table
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS color text;
