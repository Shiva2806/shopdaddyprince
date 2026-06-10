import Link from "next/link";
import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata = {
  title: "Terms and Conditions | Daddy Prince",
  description: "Read the terms of service, payment policies, governing law, and conditions governing the use of Daddy Prince.",
  keywords: ["terms and conditions", "terms of service", "user agreement", "governing law", "daddy prince"],
};

export default function TermsAndConditionsPage() {
  return (
    <PolicyLayout title="Terms and Conditions" lastUpdated="June 9, 2026">
      <div className="font-body text-sm text-[var(--text-muted)] leading-relaxed space-y-4">
        <p>
          Welcome to Daddy Prince (“we,” “our,” “us”). These Terms and Conditions (“Terms”) govern your use of our website{" "}
          <a href="https://shopdaddyprince.com" className="text-[var(--gold)] hover:underline">
            www.shopdaddyprince.com
          </a>
          , our WhatsApp catalog, and any other online services we provide. By accessing or purchasing from our site, you agree to these Terms.
        </p>
        <p>Please read them carefully before using our services.</p>
      </div>

      <PolicySection title="1. General Information">
        <p>Daddy Prince is an Indian-based business specializing in arts, crafts, and home décor.</p>
        <p>
          By accessing our website or making a purchase, you agree that you are at least 18 years old or have parental consent to use our services.
        </p>
      </PolicySection>

      <PolicySection title="2. Products and Services">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>We make every effort to display our products accurately through photos and descriptions.</li>
          <li>Slight variations in color, texture, or finish may occur due to lighting or handcrafted nature of items.</li>
          <li>All products are subject to availability. We reserve the right to limit or cancel orders at our discretion.</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Pricing and Payments">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>All prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
          <li>Prices and offers may change without prior notice.</li>
          <li>Payments are securely processed through Razorpay or other approved payment gateways.</li>
          <li>We are not responsible for any delays or errors caused by third-party payment processors.</li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Orders and Confirmation">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Once an order is placed, you will receive a confirmation email or WhatsApp message.</li>
          <li>We reserve the right to refuse or cancel any order due to product unavailability, pricing error, or suspected fraud.</li>
          <li>If payment has already been made for a canceled order, a full refund will be issued to the original payment method.</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Shipping and Delivery">
        <p>We deliver across India through trusted courier partners.</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Standard delivery time: 5–7 business days (custom or made-to-order items may take longer).</li>
          <li>Delivery times may vary due to location, courier delays, or unforeseen circumstances.</li>
          <li>Shipping charges (if applicable) will be displayed during checkout.</li>
        </ul>
      </PolicySection>

      <PolicySection title="6. Returns, Refunds, and Cancellations">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Returns are accepted only for damaged or defective items, reported within 48 hours of delivery with unboxing video proof.
          </li>
          <li>We do not accept returns for color, texture, or minor variations in handcrafted products.</li>
          <li>Cancellation is allowed only within 12 hours of order placement, provided the item has not yet been shipped.</li>
          <li>Refunds will be processed to the original payment method within 7–10 working days after approval.</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Use of Website and Content">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>All content, images, text, and designs on Daddy Prince are owned by or licensed to us.</li>
          <li>You may not copy, reproduce, or distribute any part of our website without written permission.</li>
          <li>You agree not to use the website for any unlawful, harmful, or fraudulent activity.</li>
        </ul>
      </PolicySection>

      <PolicySection title="8. Privacy Policy">
        <p>Your privacy is very important to us.</p>
        <p>
          Please refer to our{" "}
          <Link href="/privacy-policy" className="text-[var(--gold)] hover:underline">
            Privacy Policy
          </Link>{" "}
          for information on how we collect, use, and safeguard your personal data.
        </p>
      </PolicySection>

      <PolicySection title="9. Limitation of Liability">
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>
            Daddy Prince is not responsible for any indirect, incidental, or consequential damages arising from your use of our website or products.
          </li>
          <li>We are not liable for delays, delivery issues, or product variations beyond our control.</li>
        </ul>
      </PolicySection>

      <PolicySection title="10. Third-Party Links">
        <p>
          Our website may include links to third-party sites. We are not responsible for the content, accuracy, or privacy practices of these websites.
        </p>
      </PolicySection>

      <PolicySection title="11. Governing Law">
        <p>
          These Terms are governed by and construed in accordance with the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Ongole, Andhra Pradesh.
        </p>
      </PolicySection>

      <PolicySection title="12. Changes to These Terms">
        <p>
          We reserve the right to update or modify these Terms at any time without prior notice. The most recent version will always be available on our website.
        </p>
      </PolicySection>

      <PolicySection title="13. Contact Information">
        <p>If you have any questions or concerns about these Terms, please contact us:</p>
        <div className="mt-4 p-6 bg-[var(--bg-subtle)] border border-[var(--border)] space-y-2 font-display text-sm">
          <p className="font-semibold text-[var(--text)]">Daddy Prince</p>
          <p className="text-[var(--text-muted)]">
            Email: <a href="mailto:support@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">support@shopdaddyprince.com</a>
          </p>
          <p className="text-[var(--text-muted)]">
            Phone / WhatsApp: <a href="https://wa.me/916301206401" className="text-[var(--gold)] hover:underline">+91 63012 06401</a>
          </p>
          <p className="text-[var(--text-muted)]">
            Address: Daddy Prince, Shop No. 20, Guptas Midtown, Beside Chennai Shopping Mall, Ongole, Andhra Pradesh 523001, India
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}
