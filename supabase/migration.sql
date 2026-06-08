-- =============================================================================
-- Migration: Clean up category/is_active & add categories/status/is_featured
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Add new columns to products table if they do not exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured boolean NOT NULL DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active' 
  CONSTRAINT products_status_check CHECK (status IN ('active', 'draft', 'sold_out', 'hidden'));

-- 2. Migrate existing data if the old columns exist
DO $$
BEGIN
  -- If category column exists, convert it into categories text[] array
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='category') THEN
    UPDATE public.products SET categories = ARRAY[category] WHERE categories = '{}' OR categories IS NULL;
  END IF;

  -- If is_active column exists, convert it into the new status column
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='is_active') THEN
    UPDATE public.products SET status = CASE WHEN is_active = TRUE THEN 'active' ELSE 'hidden' END;
  END IF;
END $$;

-- 3. Drop old category and is_active columns
ALTER TABLE public.products DROP COLUMN IF EXISTS category;
ALTER TABLE public.products DROP COLUMN IF EXISTS is_active;

-- 4. Re-index products table for performance
DROP INDEX IF EXISTS products_category_idx;
DROP INDEX IF EXISTS products_is_active_idx;

CREATE INDEX IF NOT EXISTS products_categories_idx ON public.products USING GIN (categories);
CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);

-- 5. Update RLS (Row-Level Security) policies
-- Drop old policy
DROP POLICY IF EXISTS "products: public read" ON public.products;

-- Create new policy allowing public reads for 'active' and 'sold_out' products
CREATE POLICY "products: public read" ON public.products 
  FOR SELECT 
  USING (status IN ('active', 'sold_out'));
