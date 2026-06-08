import { redirect } from "next/navigation";

// /shop → redirect to paintings as default
export default function ShopIndexPage() {
  redirect("/shop/paintings");
}
