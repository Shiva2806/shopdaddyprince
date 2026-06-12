import PolicyLayout from "@/components/policy/PolicyLayout";
import FAQAccordion from "@/components/policy/FAQAccordion";

export const metadata = {
  title: "Frequently Asked Questions (FAQ) | Daddy Prince",
  description: "Find answers to commonly asked questions about orders, shipping, returns, and art care at Daddy Prince.",
  keywords: ["faq", "help", "support", "orders", "shipping", "daddy prince"],
};

export default function FAQPage() {
  const categories = [
    {
      title: "About Daddy Prince",
      items: [
        {
          id: 1,
          question: "What is Daddy Prince?",
          answer: "Daddy Prince is a premium Indian art, heritage decor, and handcrafted collectibles store. Established in 1985, we offer a curated selection of traditional paintings, brassware, vintage items, and regional artworks, bringing the rich heritage of India to homes globally."
        }
      ]
    },
    {
      title: "Orders & Payments",
      items: [
        {
          id: 2,
          question: "How can I place an order?",
          answer: "You can place your order directly through our website or by messaging us via WhatsApp catalog. Once your order is confirmed, you’ll receive a confirmation message or email."
        },
        {
          id: 3,
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and wallet payments through secure gateways provided by Razorpay."
        },
        {
          id: 4,
          question: "Is Cash on Delivery (COD) available?",
          answer: "Yes, COD is available for selected locations within India."
        },
        {
          id: 5,
          question: "Can I modify or cancel my order after placing it?",
          answer: "Orders can be modified or canceled within 12 hours of placement. Once shipped, changes or cancellations are not possible."
        }
      ]
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          id: 6,
          question: "Do you offer domestic and international shipping?",
          answer: "Yes! We provide domestic shipping across India and international shipping to supported countries. International shipping timelines may vary by destination. Please note that customs duties, import taxes, and local fees are the responsibility of the customer."
        },
        {
          id: 7,
          question: "How long does delivery take?",
          answer: "Domestic delivery across India takes 5–7 business days. International delivery takes 7–15 business days depending on the destination. Custom artwork or handcrafted collectibles may take 10–15 business days."
        },
        {
          id: 8,
          question: "How can I track my order?",
          answer: "Once shipped, we’ll send you a tracking link via email or WhatsApp so you can follow your parcel easily."
        }
      ]
    },
    {
      title: "Returns & Refunds",
      items: [
        {
          id: 9,
          question: "What is your return policy?",
          answer: "We accept returns only for damaged or defective items, reported within 48 hours of delivery with unboxing video proof. Due to the nature of art and handcrafted products, minor variations are normal."
        },
        {
          id: 10,
          question: "How do I request a refund or replacement?",
          answer: "Please contact us at hello@shopdaddyprince.com or via WhatsApp with your order details and photos of the product. Our team will guide you through the process."
        }
      ]
    },
    {
      title: "Products & Care",
      items: [
        {
          id: 11,
          question: "Are your products handmade?",
          answer: "Yes! Most of our artworks and décor items are handcrafted by skilled artisans. Slight differences in color or texture add to their uniqueness."
        },
        {
          id: 12,
          question: "How should I care for my art and collectibles?",
          answer: "For paintings, brass, and heritage decor: Keep away from moisture and direct sunlight. Clean gently with a soft, dry cloth. Avoid harsh chemicals."
        }
      ]
    },
    {
      title: "Contact & Support",
      items: [
        {
          id: 13,
          question: "How can I contact Daddy Prince?",
          answer: (
            <div className="space-y-1">
              <p>You can reach us through:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Email: <a href="mailto:hello@shopdaddyprince.com" className="text-gold hover:underline">hello@shopdaddyprince.com</a></li>
                <li>WhatsApp: <a href="https://wa.me/916301206401" className="text-gold hover:underline">+91 63012 06401</a></li>
                <li>Instagram: <a href="https://www.instagram.com/daddyprince.official/" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">@daddyprince.official</a></li>
              </ul>
            </div>
          )
        },
        {
          id: 14,
          question: "What are your business hours?",
          answer: "We are available Monday to Saturday, 10 AM – 8 PM (IST)."
        }
      ]
    },
    {
      title: "Others",
      items: [
        {
          id: 15,
          question: "Do you take custom or bulk orders?",
          answer: "Yes, we accept custom artwork, décor, and handmade craft orders for events, gifts, and interior projects. Please contact us directly to discuss your requirements."
        }
      ]
    }
  ];

  return (
    <PolicyLayout title="Frequently Asked Questions" lastUpdated="June 9, 2026">
      <div className="space-y-12">
        {categories.map((cat, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="font-display text-2xl text-[var(--text)] border-b border-gold/10 pb-2 mb-6">
              {cat.title}
            </h2>
            <FAQAccordion items={cat.items} />
          </div>
        ))}
      </div>
    </PolicyLayout>
  );
}
