-- =============================================================================
-- Migration: Create Product Variants table and setup RLS policies
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Create table public.product_variants
CREATE TABLE IF NOT EXISTS public.product_variants (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  dimension    text NOT NULL,
  price        integer NOT NULL, -- in paise
  sale_price   integer, -- in paise, optional
  stock        integer NOT NULL DEFAULT 0,
  sku          text,
  weight_grams integer,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- 2. Indexes for optimized queries
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants(product_id);

-- 3. Enable Row-Level Security
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- 4. Setup select policy (readable if product is active/sold_out)
DROP POLICY IF EXISTS "product_variants: public read" ON public.product_variants;
CREATE POLICY "product_variants: public read" ON public.product_variants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE id = product_variants.product_id
      AND status IN ('active', 'sold_out')
    )
  );

-- 5. Setup admin policy (admins have full access)
DROP POLICY IF EXISTS "product_variants: admin write" ON public.product_variants;
CREATE POLICY "product_variants: admin write" ON public.product_variants
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
