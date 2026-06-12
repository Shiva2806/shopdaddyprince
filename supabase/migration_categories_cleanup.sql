-- =============================================================================
-- Migration: Regional and Home Decor Category Restructure
-- Run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/msmlptlufuvisevngjfu/sql
-- =============================================================================

-- 1. Update Home Decor subcategories (map jharokhas to wall decor)
UPDATE public.products
SET subcategory = 'wall decor'
WHERE subcategory = 'jharokhas';

-- 2. Update Masks subcategories (e.g. Kamadhenu mask, which is Pattachitra art)
UPDATE public.products
SET subcategory = 'patachitra'
WHERE subcategory = 'masks';

-- 3. Update Regional subcategories (map kondapalli to kondapalli toys)
UPDATE public.products
SET subcategory = 'kondapalli toys'
WHERE subcategory = 'kondapalli';

-- 4. Update Paintings subcategories (map traditional to traditional screen arts)
UPDATE public.products
SET subcategory = 'traditional screen arts'
WHERE subcategory = 'traditional';

