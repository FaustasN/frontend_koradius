import { pushToDataLayer } from "./pushToDataLayer";

export type EcommerceItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity: number;
};

type BaseEcommercePayload = {
  currency: string;
  value: number;
  items: EcommerceItem[];
};

export function trackViewItem(payload: BaseEcommercePayload) {
  pushToDataLayer({
    event: "view_item",
    ecommerce: payload,
  });
}

export function trackBeginCheckout(payload: BaseEcommercePayload) {
  pushToDataLayer({
    event: "begin_checkout",
    ecommerce: payload,
  });
}

export function trackAddPaymentInfo(
  payload: BaseEcommercePayload & { payment_type?: string }
) {
  pushToDataLayer({
    event: "add_payment_info",
    ecommerce: payload,
  });
}

export function trackPurchase(
  payload: BaseEcommercePayload & { transaction_id: string }
) {
  pushToDataLayer({
    event: "purchase",
    ecommerce: payload,
  });
}