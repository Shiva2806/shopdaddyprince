"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/lib/analytics";

interface OrderTrackerProps {
  order: any;
}

export default function OrderTracker({ order }: OrderTrackerProps) {
  useEffect(() => {
    if (order) {
      trackPurchase(order);
    }
  }, [order]);

  return null;
}
