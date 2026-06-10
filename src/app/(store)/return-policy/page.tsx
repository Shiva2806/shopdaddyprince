import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata = {
  title: "Return & Refund Policy | Daddy Prince",
  description: "Read about our return eligibility, refunds, exchange options, and cancellation rules at Daddy Prince.",
  keywords: ["return policy", "refunds", "cancellations", "exchanges", "daddy prince"],
};

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout title="Return & Refund Policy" lastUpdated="June 9, 2026">
      <div className="font-body text-sm text-[var(--text-muted)] leading-relaxed space-y-4">
        <p>Thank you for shopping with Daddy Prince!</p>
        <p>
          We take great care to ensure every product is checked, packed, and shipped in perfect condition.
          However, if you receive a damaged or defective item, we’re here to help.
        </p>
      </div>

      <PolicySection title="1. Eligibility for Returns">
        <p>We accept returns only if:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>The item is damaged, defective, or incorrect at the time of delivery.</li>
          <li>You contact us within 48 hours of delivery.</li>
          <li>You provide unboxing video proof showing the damage or issue clearly.</li>
        </ul>
        <p className="mt-4">
          Due to the nature of our products (handcrafted art, décor items, and sarees), minor variations in color, texture, or finish are normal and not considered defects.
        </p>
      </PolicySection>

      <PolicySection title="2. Non-Returnable Items">
        <p>The following items cannot be returned or exchanged:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Customized or made-to-order products</li>
          <li>Items purchased on clearance or final sale</li>
          <li>Products without original packaging or tags</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Return Process">
        <p>If your item meets the above criteria:</p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            Contact us at{" "}
            <a href="mailto:support@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">
              support@shopdaddyprince.com
            </a>{" "}
            or WhatsApp{" "}
            <a href="https://wa.me/916301206401" className="text-[var(--gold)] hover:underline">
              +91 63012 06401
            </a>{" "}
            within 48 hours of delivery.
          </li>
          <li>Share your Order ID, photos, and unboxing video for verification.</li>
          <li>Once approved, we will guide you through the return process.</li>
          <li>Please ensure the product is securely packed in its original packaging for pickup.</li>
        </ol>
        <p className="mt-4">
          Return shipping costs may be covered by us only if the item was defective or incorrect.
        </p>
      </PolicySection>

      <PolicySection title="4. Refunds">
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Refunds are issued only after we receive and inspect the returned item.</li>
          <li>Once approved, your refund will be processed to your original payment method within 7–10 business days.</li>
          <li>In case of COD orders, refunds will be made through bank transfer or UPI (details will be requested).</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Exchange Policy">
        <p>We currently do not offer direct exchanges.</p>
        <p>
          If you wish to get a replacement, please request a return first, and then place a new order once the refund is processed.
        </p>
      </PolicySection>

      <PolicySection title="6. Damaged During Delivery">
        <p>If you notice any damage to the outer packaging upon delivery:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Please do not accept the parcel or make a note with the delivery agent.</li>
          <li>Immediately contact us with photos and your Order ID.</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Order Cancellations">
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Orders can be canceled within 12 hours of placement, provided they haven’t been shipped.</li>
          <li>Once shipped, cancellations are not possible.</li>
          <li>If canceled in time, a full refund will be issued to your original payment method.</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Contact Us">
        <p>If you have any questions about returns or refunds, please contact:</p>
        <div className="mt-4 p-6 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 font-display text-sm">
          <p className="font-semibold text-[var(--text)]">Daddy Prince</p>
          <p className="text-[var(--text-muted)]">
            📧 Email: <a href="mailto:support@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">support@shopdaddyprince.com</a>
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
