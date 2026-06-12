import { formatPrice, formatOrderId } from "./format";

const rawBaseUrl = process.env.BASE_URL || "https://www.shopdaddyprince.com";
const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;

// Helper to make image URLs absolute for email clients
function getAbsoluteImageUrl(url: string): string {
  if (!url) return `${baseUrl}/favicon.ico`;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

import crypto from "crypto";

export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.NEXTAUTH_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || "daddyprince-unsubscribe-secret";
  return crypto.createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex");
}

// Wrapper layout layout applying Dark Heritage Luxury branding
function wrapLayout(content: string, subject: string, unsubscribeEmail?: string): string {
  const unsubscribeUrl = unsubscribeEmail
    ? `${baseUrl}/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}&token=${generateUnsubscribeToken(unsubscribeEmail)}`
    : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <!-- Google Fonts for branding inside email clients that support Web Fonts -->
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a, h1, h2, h3 { font-family: Georgia, serif !important; }
  </style>
  <![endif]-->
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500&display=swap');
    
    body {
      font-family: 'Jost', 'Helvetica Neue', Helvetica, Arial, sans-serif !important;
    }
    .display-font {
      font-family: 'Cormorant Garamond', Georgia, serif !important;
    }
    
    @media screen and (max-width: 600px) {
      .email-card {
        padding: 30px 20px !important;
      }
      .col-item {
        display: block !important;
        width: 100% !important;
        margin-bottom: 20px !important;
        padding: 0 !important;
      }
      .col-item-last {
        margin-bottom: 0 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #120f0d; color: #f5efe4; -webkit-font-smoothing: antialiased;">
  <!-- Grain & Mesh Radial Effect Emulated in CSS -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #120f0d; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="email-card" style="max-width: 600px; background-color: #1e1916; border: 1px solid rgba(199, 154, 59, 0.25); border-radius: 12px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.6); padding: 40px;">
          
          <!-- Logo & Brand Header -->
          <tr>
            <td align="center" style="padding-bottom: 30px; border-bottom: 1px solid rgba(199, 154, 59, 0.15);">
              <a href="${baseUrl}" target="_blank" style="text-decoration: none;">
                <img src="${baseUrl}/favicon.ico" alt="Daddy Prince" width="56" height="56" style="display: block; margin-bottom: 12px; outline: none; border: none;">
              </a>
              <h1 class="display-font" style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #c79a3b; line-height: 1.2;">DADDY PRINCE</h1>
              <p style="margin: 6px 0 0 0; font-size: 9px; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(245, 239, 228, 0.45); font-weight: 500;">Heritage Luxury & Fine Art</p>
            </td>
          </tr>
          
          <!-- Dynamic Content Body -->
          <tr>
            <td style="padding: 40px 0 30px 0;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top: 30px; border-top: 1px solid rgba(199, 154, 59, 0.15);">
              <p style="margin: 0 0 12px 0; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #c79a3b; font-weight: 500;">THE COLLECTOR'S CIRCLE</p>
              <p style="margin: 0 0 16px 0; font-size: 11px; color: rgba(245, 239, 228, 0.55); line-height: 1.6; max-width: 440px;">
                You are receiving this communication as a registered patron of the Daddy Prince Art Gallery.
              </p>
              
              <!-- Footer Links -->
              <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td>
                    <a href="${baseUrl}/about" target="_blank" style="font-size: 10px; color: #c79a3b; text-decoration: none; letter-spacing: 0.1em; margin: 0 8px; text-transform: uppercase;">About</a>
                  </td>
                  <td style="color: rgba(199, 154, 59, 0.3); font-size: 10px;">•</td>
                  <td>
                    <a href="${baseUrl}/shop" target="_blank" style="font-size: 10px; color: #c79a3b; text-decoration: none; letter-spacing: 0.1em; margin: 0 8px; text-transform: uppercase;">Gallery</a>
                  </td>
                  <td style="color: rgba(199, 154, 59, 0.3); font-size: 10px;">•</td>
                  <td>
                    <a href="${baseUrl}/contact" target="_blank" style="font-size: 10px; color: #c79a3b; text-decoration: none; letter-spacing: 0.1em; margin: 0 8px; text-transform: uppercase;">Support</a>
                  </td>
                  ${unsubscribeEmail ? `
                  <td style="color: rgba(199, 154, 59, 0.3); font-size: 10px;">•</td>
                  <td>
                    <a href="${unsubscribeUrl}" target="_blank" style="font-size: 10px; color: rgba(245, 239, 228, 0.4); text-decoration: underline; letter-spacing: 0.1em; margin: 0 8px; text-transform: uppercase;">Unsubscribe</a>
                  </td>
                  ` : ""}
                </tr>
              </table>
              
              <p style="margin: 0; font-size: 9px; letter-spacing: 0.05em; color: rgba(245, 239, 228, 0.35);">
                © ${new Date().getFullYear()} Daddy Prince Art House. All Rights Reserved.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// 1. Welcome Email (New Account)
export function getWelcomeEmail(name: string, email: string): { subject: string; html: string } {
  const subject = "Welcome to the Collector's Circle | Daddy Prince";
  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 18px 0; font-size: 26px; font-weight: normal; color: #fff9f0; line-height: 1.3; text-align: center;">Welcome, ${name}</h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.8); text-align: center;">
      It is a privilege to welcome you to our inner circle of fine art and heritage craft collectors.
    </p>
    <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.8); text-align: center;">
      With your account, you can easily trace your acquisitions, save rare finds to your wishlist, and experience priority curation services.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/shop" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b; transition: all 0.2s;">
            Explore The Gallery
          </a>
        </td>
      </tr>
    </table>
  `, subject, email);

  return { subject, html };
}

// 2. Newsletter Welcome Email
export function getNewsletterWelcomeEmail(email: string): { subject: string; html: string } {
  const subject = "Patron List Confirmed | Daddy Prince";
  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 18px 0; font-size: 26px; font-weight: normal; color: #fff9f0; line-height: 1.3; text-align: center;">You Are in the Circle</h2>
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.8); text-align: center;">
      Thank you for subscribing. You have successfully joined our exclusive network of art collectors.
    </p>
    <p style="margin: 0 0 32px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.8); text-align: center;">
      You will be the first to receive notifications of new acquisitions, heritage brass castings, original paintings, and storytelling from remote artisan clusters of India.
    </p>
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/shop" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b;">
            Acquisition Catalog
          </a>
        </td>
      </tr>
    </table>
  `, subject, email);

  return { subject, html };
}

// Helper to format order items for confirmation and cart abandonment
function formatOrderItemsHtml(items: any[]): string {
  return items.map((item) => {
    const priceFormatted = formatPrice(item.price || item.priceAtPurchase || item.product?.price || 0);
    const sizeLine = item.selected_dimension || item.selectedDimension 
      ? `<p style="margin: 4px 0 0 0; font-size: 10px; text-transform: uppercase; color: #c79a3b; letter-spacing: 0.05em;">Size: ${item.selected_dimension || item.selectedDimension}</p>`
      : "";
    const imgUrl = getAbsoluteImageUrl(item.product_image || item.product?.images?.[0] || "");
    const qtyText = `Qty: ${item.quantity}`;
    const nameText = item.product_name || item.product?.name || "Artisan Masterpiece";

    return `
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid rgba(245, 239, 228, 0.08);">
        <tr>
          <!-- Item Image -->
          <td width="70" valign="top">
            <img src="${imgUrl}" alt="${nameText}" width="60" height="75" style="display: block; border-radius: 4px; object-cover: cover; border: 1px solid rgba(199, 154, 59, 0.15);">
          </td>
          <!-- Item Info -->
          <td valign="top" style="padding-left: 14px;">
            <p style="margin: 0; font-size: 14px; font-weight: 500; color: #f5efe4; line-height: 1.4;">${nameText}</p>
            ${sizeLine}
            <p style="margin: 4px 0 0 0; font-size: 11px; color: rgba(245, 239, 228, 0.45);">${qtyText}</p>
          </td>
          <!-- Price -->
          <td align="right" valign="top" style="font-size: 14px; font-weight: 500; color: #c79a3b;">
            ${priceFormatted}
          </td>
        </tr>
      </table>
    `;
  }).join("");
}

// 3. Order Confirmation
export function getOrderConfirmationEmail(order: any, customerName: string, email: string): { subject: string; html: string } {
  const displayId = formatOrderId(order.id);
  const subject = `Order Confirmed: ${displayId} | Daddy Prince`;
  
  const itemsHtml = formatOrderItemsHtml(order.items || []);
  const subtotalStr = formatPrice(order.subtotal);
  const shippingStr = order.shipping === 0 ? "Free" : formatPrice(order.shipping);
  const totalStr = formatPrice(order.total);
  const formattedAddress = `
    <strong>${order.shipping_address?.full_name || customerName}</strong><br />
    ${order.shipping_address?.line1 || ""}${order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ""}<br />
    ${order.shipping_address?.city || ""}, ${order.shipping_address?.state || ""} — ${order.shipping_address?.pincode || ""}<br />
    Phone: ${order.shipping_address?.phone || ""}
  `;

  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 4px 0; font-size: 24px; font-weight: normal; color: #fff9f0; line-height: 1.3;">Acquisition Confirmed</h2>
    <p style="margin: 0 0 24px 0; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c79a3b;">ORDER ${displayId}</p>
    
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: rgba(245, 239, 228, 0.85);">
      Dear ${customerName}, your payment has been verified, and your order has been received. Our preservation team is now preparing the selected works for safe custom packing and courier transit.
    </p>
    
    <!-- Item Table -->
    <div style="background-color: #2b241f; padding: 24px 20px 8px 20px; border: 1px solid rgba(199, 154, 59, 0.15); border-radius: 4px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #fff9f0; border-bottom: 1px solid rgba(199, 154, 59, 0.15); padding-bottom: 8px;">Order Details</h3>
      ${itemsHtml}
      
      <!-- Subtotals -->
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; margin-top: 16px; padding-top: 8px;">
        <tr>
          <td style="color: rgba(245, 239, 228, 0.5); padding-bottom: 6px;">Subtotal</td>
          <td align="right" style="color: #f5efe4; padding-bottom: 6px;">${subtotalStr}</td>
        </tr>
        <tr>
          <td style="color: rgba(245, 239, 228, 0.5); padding-bottom: 12px;">Shipping</td>
          <td align="right" style="color: #f5efe4; padding-bottom: 12px;">${shippingStr}</td>
        </tr>
        <tr style="font-size: 14px; font-weight: 600; color: #c79a3b;">
          <td style="padding-top: 12px; border-top: 1px solid rgba(245, 239, 228, 0.1);">Total Acquisition Value</td>
          <td align="right" style="padding-top: 12px; border-top: 1px solid rgba(245, 239, 228, 0.1);">${totalStr}</td>
        </tr>
      </table>
    </div>

    <!-- Delivery Address -->
    <div style="background-color: #241f1b; padding: 20px; border: 1px solid rgba(245, 239, 228, 0.08); border-radius: 4px; margin-bottom: 30px;">
      <h3 style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c79a3b;">Shipping Address</h3>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: rgba(245, 239, 228, 0.75);">
        ${formattedAddress}
      </p>
    </div>
  `, subject, email);

  return { subject, html };
}

// 4. Order Shipped
export function getOrderShippedEmail(order: any, customerName: string, email: string): { subject: string; html: string } {
  const displayId = formatOrderId(order.id);
  const subject = `Your Art is on its Way: ${displayId} | Daddy Prince`;
  
  const formattedAddress = `
    <strong>${order.shipping_address?.full_name || customerName}</strong><br />
    ${order.shipping_address?.line1 || ""}${order.shipping_address?.line2 ? `, ${order.shipping_address.line2}` : ""}<br />
    ${order.shipping_address?.city || ""}, ${order.shipping_address?.state || ""} — ${order.shipping_address?.pincode || ""}
  `;

  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 4px 0; font-size: 24px; font-weight: normal; color: #fff9f0; line-height: 1.3;">Collector Dispatch</h2>
    <p style="margin: 0 0 24px 0; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c79a3b;">ORDER ${displayId}</p>
    
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85);">
      Dear ${customerName}, your acquired pieces have been carefully dispatched. We have packaged them using high-grade preservation standards to shield them from environmental exposure during transit.
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85);">
      A tracking notification is now live. You can trace its journey to your doorstep using the button below.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/track-order" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b;">
            Track Shipment
          </a>
        </td>
      </tr>
    </table>

    <div style="background-color: #241f1b; padding: 20px; border: 1px solid rgba(245, 239, 228, 0.08); border-radius: 4px;">
      <h3 style="margin: 0 0 8px 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #c79a3b;">Shipping Destination</h3>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: rgba(245, 239, 228, 0.75);">
        ${formattedAddress}
      </p>
    </div>
  `, subject, email);

  return { subject, html };
}

// 5. Order Delivered
export function getOrderDeliveredEmail(order: any, customerName: string, email: string): { subject: string; html: string } {
  const displayId = formatOrderId(order.id);
  const subject = `Delivery Confirmed: ${displayId} | Daddy Prince`;

  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 4px 0; font-size: 24px; font-weight: normal; color: #fff9f0; line-height: 1.3;">Delivery Completed</h2>
    <p style="margin: 0 0 24px 0; font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #c79a3b;">ORDER ${displayId}</p>
    
    <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85);">
      Dear ${customerName}, our courier tracking indicates that your package was successfully delivered.
    </p>
    
    <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85);">
      We hope this heritage artwork brings warmth, character, and history to your home. If you require tips on conservation, framing, or would like to discuss our artisan certificates, please do not hesitate to contact our curatorial desk.
    </p>

    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/account" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b;">
            View Purchases
          </a>
        </td>
      </tr>
    </table>
  `, subject, email);

  return { subject, html };
}

// 6. Abandoned Cart (1 hour)
export function getAbandonedCartEmail(items: any[], customerName: string, email: string): { subject: string; html: string } {
  const subject = "An exquisite collection left behind | Daddy Prince";
  
  const itemsHtml = formatOrderItemsHtml(items);

  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 18px 0; font-size: 24px; font-weight: normal; color: #fff9f0; line-height: 1.3; text-align: center;">A Collection Awaits Your Return</h2>
    
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85); text-align: center;">
      Dear ${customerName}, we noticed you left some carefully selected items in your private bag.
    </p>
    
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85); text-align: center;">
      Since our pieces are handcrafted, rare, and often completely unique (one-of-a-kind), we cannot reserve this inventory indefinitely.
    </p>
    
    <!-- Item Table -->
    <div style="background-color: #2b241f; padding: 24px 20px 8px 20px; border: 1px solid rgba(199, 154, 59, 0.15); border-radius: 4px; margin-bottom: 28px; text-align: left;">
      <h3 style="margin: 0 0 16px 0; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #fff9f0; border-bottom: 1px solid rgba(199, 154, 59, 0.15); padding-bottom: 8px;">Items In Your Cart</h3>
      ${itemsHtml}
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/cart" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b;">
            Secure My Pieces
          </a>
        </td>
      </tr>
    </table>
  `, subject, email);

  return { subject, html };
}

// 7. New Collection Broadcast (Broadcast announcement)
export function getCollectionBroadcastEmail(
  title: string,
  description: string,
  products: any[],
  email: string
): { subject: string; html: string } {
  const subject = `${title} | Daddy Prince Acquisitions`;

  // Render products grid: 2 items per row
  let productsHtml = '<table border="0" cellpadding="0" cellspacing="0" width="100%">';
  for (let i = 0; i < products.length; i += 2) {
    const p1 = products[i];
    const p2 = products[i + 1];

    const p1Price = formatPrice(p1.price);
    const p1Img = getAbsoluteImageUrl(p1.images?.[0] || "");
    const p1Link = `${baseUrl}/product/${p1.slug}`;

    let p2Cell = "";
    if (p2) {
      const p2Price = formatPrice(p2.price);
      const p2Img = getAbsoluteImageUrl(p2.images?.[0] || "");
      const p2Link = `${baseUrl}/product/${p2.slug}`;
      p2Cell = `
        <td class="col-item col-item-last" width="48%" valign="top" style="padding-left: 10px;">
          <a href="${p2Link}" target="_blank" style="text-decoration: none;">
            <img src="${p2Img}" alt="${p2.name}" width="100%" style="display: block; border-radius: 6px; border: 1px solid rgba(199, 154, 59, 0.15); margin-bottom: 12px; aspect-ratio: 4/5; object-fit: cover;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #f5efe4; line-height: 1.4;">${p2.name}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #c79a3b; font-weight: 500;">${p2Price}</p>
          </a>
        </td>
      `;
    } else {
      p2Cell = `<td width="48%"></td>`;
    }

    productsHtml += `
      <tr>
        <td class="col-item" width="48%" valign="top" style="padding-right: 10px; padding-bottom: 24px;">
          <a href="${p1Link}" target="_blank" style="text-decoration: none;">
            <img src="${p1Img}" alt="${p1.name}" width="100%" style="display: block; border-radius: 6px; border: 1px solid rgba(199, 154, 59, 0.15); margin-bottom: 12px; aspect-ratio: 4/5; object-fit: cover;">
            <p style="margin: 0; font-size: 13px; font-weight: 600; color: #f5efe4; line-height: 1.4;">${p1.name}</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #c79a3b; font-weight: 500;">${p1Price}</p>
          </a>
        </td>
        ${p2Cell}
      </tr>
    `;
  }
  productsHtml += "</table>";

  const html = wrapLayout(`
    <h2 class="display-font" style="margin: 0 0 16px 0; font-size: 24px; font-weight: normal; color: #fff9f0; line-height: 1.3; text-align: center;">New Acquisition Circle</h2>
    
    <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85); text-align: center;">
      ${description}
    </p>

    <!-- Product Spotlight Grid -->
    <div style="margin-bottom: 30px; margin-top: 10px;">
      ${productsHtml}
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 10px auto;">
      <tr>
        <td align="center" style="background-color: #c79a3b; border-radius: 2px;">
          <a href="${baseUrl}/shop" target="_blank" style="display: inline-block; padding: 14px 32px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #1c1816; text-decoration: none; border: 1px solid #c79a3b;">
            Browse Entire Collection
          </a>
        </td>
      </tr>
    </table>
  `, subject, email);

  return { subject, html };
}

// 8. Custom Newsletter Campaign
export function getNewsletterCampaignEmail(subject: string, contentHtml: string, email: string): { subject: string; html: string } {
  const html = wrapLayout(`
    <div style="font-size: 14px; line-height: 1.7; color: rgba(245, 239, 228, 0.85); text-align: left;">
      ${contentHtml}
    </div>
  `, subject, email);
  return { subject, html };
}
