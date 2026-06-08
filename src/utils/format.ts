// Format paise to INR display string — e.g. 299900 → "₹2,999"
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Truncate long text for product cards
export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + "…";
}

// Simple slug generator from product name
export function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// Format order ID for display — e.g. "DP-000042"
export function formatOrderId(id: string): string {
  return `DP-${id.slice(-6).toUpperCase()}`;
}
