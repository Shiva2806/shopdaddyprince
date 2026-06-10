import { createAdminClient } from "@/lib/supabase/admin";

export interface ActivityEvent {
  id: string;
  type: "product_added" | "product_updated" | "order_received" | "customer_registered" | "product_deleted";
  title: string;
  description: string;
  timestamp: string;
}

// Global variable to persist product deletions during dev runtime without DB migration
declare global {
  var _deletedProducts: Array<{ id: string; name: string; timestamp: string }>;
}

global._deletedProducts = global._deletedProducts || [];

export function logProductDeletion(name: string) {
  try {
    global._deletedProducts.push({
      id: `deleted-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name,
      timestamp: new Date().toISOString(),
    });
    // Limit log size to 20
    if (global._deletedProducts.length > 20) {
      global._deletedProducts.shift();
    }
  } catch (err) {
    console.error("Failed to log product deletion in memory:", err);
  }
}

export async function getRecentActivities(): Promise<ActivityEvent[]> {
  const events: ActivityEvent[] = [];
  const supabase = createAdminClient() as any;

  try {
    // 1. Fetch latest 10 products
    const { data: addedProducts } = await supabase
      .from("products")
      .select("id, name, categories, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (addedProducts) {
      for (const p of addedProducts) {
        events.push({
          id: `prod-add-${p.id}`,
          type: "product_added",
          title: "Product Added",
          description: `Listed "${p.name}" in ${p.categories?.[0] || "Gallery"}`,
          timestamp: p.created_at,
        });

        // Check if product was updated after creation (difference > 2 seconds)
        const createdTime = new Date(p.created_at).getTime();
        const updatedTime = new Date(p.updated_at).getTime();
        if (updatedTime - createdTime > 2000) {
          events.push({
            id: `prod-upd-${p.id}-${p.updated_at}`,
            type: "product_updated",
            title: "Product Updated",
            description: `Updated details for "${p.name}"`,
            timestamp: p.updated_at,
          });
        }
      }
    }

    // 2. Fetch latest 10 orders
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total, created_at, shipping_address")
      .order("created_at", { ascending: false })
      .limit(10);

    if (orders) {
      for (const o of orders) {
        const customerName = (o.shipping_address as any)?.full_name || "Guest Collector";
        events.push({
          id: `order-rec-${o.id}`,
          type: "order_received",
          title: "Order Received",
          description: `Order #${o.id.slice(0, 8).toUpperCase()} (₹${(o.total / 100).toLocaleString("en-IN")}) by ${customerName}`,
          timestamp: o.created_at,
        });
      }
    }

    // 3. Fetch latest 10 customers registered
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, email, created_at")
      .eq("role", "customer")
      .order("created_at", { ascending: false })
      .limit(10);

    if (profiles) {
      for (const pr of profiles) {
        const displayName = pr.full_name || pr.email;
        events.push({
          id: `cust-reg-${pr.id}`,
          type: "customer_registered",
          title: "Customer Registered",
          description: `New collector registered: ${displayName}`,
          timestamp: pr.created_at,
        });
      }
    }

    // 4. Merge with in-memory deleted products log
    for (const del of global._deletedProducts) {
      events.push({
        id: del.id,
        type: "product_deleted",
        title: "Product Deleted",
        description: `Permanently removed "${del.name}" from catalog`,
        timestamp: del.timestamp,
      });
    }

    // Sort chronologically, newest first
    events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  } catch (error) {
    console.error("Error fetching admin activities:", error);
  }

  // Return the latest 8 events
  return events.slice(0, 8);
}
