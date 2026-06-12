import { createAdminClient } from "@/lib/supabase/admin";

interface CartItemInput {
  product_id: string;
  quantity: number;
  variant_id?: string;
}

export async function calculateServerTotal(items: CartItemInput[]) {
  const supabase = createAdminClient() as any;
  let subtotal = 0;

  for (const item of items) {
    if (item.variant_id) {
      // Fetch variant price from product_variants table
      const { data: variant, error } = await supabase
        .from("product_variants")
        .select("price, sale_price")
        .eq("id", item.variant_id)
        .single();

      if (error || !variant) {
        throw new Error(`Variant not found in database: ${item.variant_id}`);
      }

      // Use sale_price if active, otherwise base price
      const price = variant.sale_price !== null && variant.sale_price !== undefined 
        ? variant.sale_price 
        : variant.price;

      subtotal += price * item.quantity;
    } else {
      // Fetch base product price from products table
      const { data: product, error } = await supabase
        .from("products")
        .select("price")
        .eq("id", item.product_id)
        .single();

      if (error || !product) {
        throw new Error(`Product not found in database: ${item.product_id}`);
      }

      subtotal += product.price * item.quantity;
    }
  }

  // Shipping rules matching checkout/page.tsx:
  // Free shipping above ₹5,000 (500,000 paise). Otherwise ₹99 (9,900 paise).
  const shipping = subtotal >= 500000 ? 0 : 9900;
  const total = subtotal + shipping;

  return {
    subtotal,
    shipping,
    total,
  };
}
