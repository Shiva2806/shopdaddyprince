import Link from "next/link";
import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata = {
  title: "Shipping Policy | Daddy Prince",
  description: "Learn about shipping coverage, processing times, shipping charges, and tracking details at Daddy Prince.",
  keywords: ["shipping policy", "delivery", "shipping cost", "order tracking", "daddy prince"],
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="June 9, 2026">
      <div className="font-body text-sm text-[var(--text-muted)] leading-relaxed space-y-4">
        <p>Thank you for shopping with Daddy Prince!</p>
        <p>
          We’re committed to delivering your favorite art, crafts, and home décor safely and on time. Please read our shipping policy below.
        </p>
      </div>

      <PolicySection title="1. Shipping Coverage">
        <p>
          Domestic shipping is available across India through trusted courier partners such as Shiprocket, Delhivery, BlueDart, DTDC, and India Post.
        </p>
        <p>
          International shipping is available to supported countries. We partner with reliable international carriers to deliver our heritage decor globally.
        </p>
        <p>
          Please note that customs duties, import taxes, and local fees are the responsibility of the customer unless explicitly stated otherwise.
        </p>
      </PolicySection>

      <PolicySection title="2. Processing Time">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Orders are processed within 1–3 business days after confirmation.</li>
          <li>Custom-made or pre-order items may take additional time (typically 7–10 days).</li>
          <li>Orders placed on Sundays or public holidays will be processed on the next working day.</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Delivery Time">
        <p>Estimated delivery timelines:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Metro Cities (India): 3–5 business days</li>
          <li>Other Domestic Locations: 5–7 business days</li>
          <li>International Shipments: 7–15 business days (varies by destination and customs clearance)</li>
          <li>Custom Art & Handcrafted Collectibles: 10–15 business days</li>
        </ul>
        <p className="mt-4">
          Please note: Delivery times may vary depending on your location, customs processing, and courier service availability.
        </p>
      </PolicySection>

      <PolicySection title="4. Shipping Charges">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Free shipping may be offered on selected products or during special promotions.</li>
          <li>Standard shipping fees (if applicable) will be displayed during checkout before payment.</li>
          <li>COD (Cash on Delivery) orders may include a small service fee, depending on your location.</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Order Tracking">
        <p>Once your order is shipped, you will receive a tracking link via email or WhatsApp.</p>
        <p className="mt-2">
          You can also track your order directly through our{" "}
          <Link href="/track-order" className="text-[var(--gold)] hover:underline font-semibold">
            Track Order
          </Link>{" "}
          page using your Order ID or Email.
        </p>
      </PolicySection>

      <PolicySection title="6. Packaging">
        <p>All our products are packed with utmost care to ensure they reach you in perfect condition.</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Fragile items are safely bubble-wrapped and secured.</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Delays and Exceptions">
        <p>We strive for timely delivery, but delays may occur due to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Weather conditions or natural disasters</li>
          <li>Unexpected courier delays</li>
          <li>Incorrect address or contact information</li>
        </ul>
        <p className="mt-4">
          If your order is delayed, our team will notify you via email or WhatsApp.
        </p>
      </PolicySection>

      <PolicySection title="8. Damaged Packages">
        <p>
          If your parcel arrives damaged, please record an unboxing video and contact us within 48 hours of delivery.
          We will assess and assist with replacements or refunds based on our{" "}
          <Link href="/return-policy" className="text-[var(--gold)] hover:underline">
            Return Policy
          </Link>.
        </p>
      </PolicySection>

      <PolicySection title="9. Incorrect Address">
        <p>Please double-check your delivery address during checkout.</p>
        <p>We are not responsible for delays or losses caused by incorrect or incomplete addresses.</p>
        <p>If you need to change your address, contact us within 12 hours of placing your order.</p>
      </PolicySection>

      <PolicySection title="10. Contact Us">
        <p>For any shipping-related queries, please reach out to us at:</p>
        <div className="mt-4 p-6 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 font-display text-sm">
          <p className="font-semibold text-[var(--text)]">Daddy Prince</p>
          <p className="text-[var(--text-muted)]">
            📧 Email: <a href="mailto:hello@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">hello@shopdaddyprince.com</a>
          </p>
          <p className="text-[var(--text-muted)]">
            📱 WhatsApp: <a href="https://wa.me/916301206401" className="text-[var(--gold)] hover:underline">+91 63012 06401</a>
          </p>
          <p className="text-[var(--text-muted)]">
            📍 Address: Daddy Prince, Shop No. 20, Guptas Midtown, Beside Chennai Shopping Mall, Ongole, Andhra Pradesh 523001, India
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}
