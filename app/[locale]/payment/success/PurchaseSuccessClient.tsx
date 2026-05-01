"use client";

import { useEffect } from "react";
import { trackPurchase } from "@/app/analytics/trackEcommerce";

const STORAGE_KEY = "purchaseEventPayload";

type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
};

type PurchasePayload = {
  transaction_id: string;
  currency: string;
  value: number;
  items: EcommerceItem[];
};

export default function PurchaseSuccessClient() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawPayload = window.localStorage.getItem(STORAGE_KEY);
    if (!rawPayload) return;

    try {
      const payload: PurchasePayload = JSON.parse(rawPayload);

      if (
        payload.transaction_id &&
        payload.currency &&
        typeof payload.value === "number" &&
        Array.isArray(payload.items)
      ) {
        trackPurchase(payload);
      }
    } catch (error) {
      console.error("Failed to parse purchase event payload", error);
    } finally {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return null;
}
