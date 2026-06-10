import PolicyLayout from "@/components/policy/PolicyLayout";
import PolicySection from "@/components/policy/PolicySection";

export const metadata = {
  title: "Privacy Policy | Daddy Prince",
  description: "Read about how we collect, use, and safeguard your personal information at Daddy Prince.",
  keywords: ["privacy policy", "personal data", "security", "daddy prince"],
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="June 9, 2026">
      <div className="font-body text-sm text-[var(--text-muted)] leading-relaxed space-y-6">
        <p>Welcome to Daddy Prince (“we,” “our,” “us”).</p>
        <p>
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website{" "}
          <a href="https://shopdaddyprince.com" className="text-[var(--gold)] hover:underline">www.shopdaddyprince.com</a>, use our WhatsApp catalog, or make purchases through our online store.
        </p>
      </div>

      <PolicySection title="1. Information We Collect">
        <p>We may collect the following information when you interact with us:</p>
        
        <div className="space-y-3 mt-4">
          <p className="font-semibold text-[var(--text)]">a. Personal Information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information (processed securely by payment providers)</li>
          </ul>
        </div>

        <div className="space-y-3 mt-4">
          <p className="font-semibold text-[var(--text)]">b. Automatically Collected Information:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Device type and browser information</li>
            <li>IP address and location data (approximate)</li>
            <li>Pages visited, time spent, and browsing behavior</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </div>

        <div className="space-y-3 mt-4">
          <p className="font-semibold text-[var(--text)]">c. WhatsApp Communication:</p>
          <p>
            If you contact us via WhatsApp, we may collect your name, phone number, and messages to assist you with product inquiries, orders, or customer support.
          </p>
        </div>
      </PolicySection>

      <PolicySection title="2. How We Use Your Information">
        <p>We use your information to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Process and deliver your orders</li>
          <li>Communicate with you about orders, offers, or updates</li>
          <li>Improve our website, products, and customer experience</li>
          <li>Send promotional emails or WhatsApp messages (only if you have opted in)</li>
          <li>Prevent fraud and ensure secure transactions</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Cookies and Tracking">
        <p>We use cookies to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Remember your shopping preferences</li>
          <li>Analyze website traffic and performance</li>
          <li>Improve site functionality</li>
        </ul>
        <p className="mt-4">
          You can disable cookies in your browser settings, though some site features may not function properly.
        </p>
      </PolicySection>

      <PolicySection title="4. Sharing Your Information">
        <p>We value your trust and do not sell your personal data.</p>
        <p>We may share limited data only with trusted third parties, such as:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Delivery partners (for shipping your products)</li>
          <li>Marketing and analytics tools (to improve website performance)</li>
        </ul>
        <p className="mt-4">
          These partners are required to protect your information and use it only as needed to provide their services.
        </p>
      </PolicySection>

      <PolicySection title="5. Data Security">
        <p>Your privacy and data security are our top priorities.</p>
        <p>
          We use secure technologies and follow industry best practices to protect your personal information from unauthorized access, misuse, or loss.
          However, please note that no online platform can guarantee absolute security.
        </p>
      </PolicySection>

      <PolicySection title="6. Your Rights">
        <p>You have the right to:</p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li>Access and correct your personal information</li>
          <li>Request deletion of your data (where legally possible)</li>
          <li>Withdraw consent from receiving marketing messages</li>
        </ul>
        <p className="mt-4">
          To make such requests, please contact us at{" "}
          <a href="mailto:support@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">
            support@shopdaddyprince.com
          </a>.
        </p>
      </PolicySection>

      <PolicySection title="7. Third-Party Links">
        <p>
          Our website or WhatsApp messages may include links to external websites. We are not responsible for their content or privacy policies. Please review their privacy statements separately.
        </p>
      </PolicySection>

      <PolicySection title="8. Policy Updates">
        <p>
          We may update this Privacy Policy from time to time. The most recent version will always be available on this page. Please check it periodically for updates.
        </p>
      </PolicySection>

      <PolicySection title="9. Contact Us">
        <p>If you have any questions, concerns, or requests related to this Privacy Policy, please contact:</p>
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
