  export function pushToDataLayer(payload: Record<string, unknown>) {
    if (typeof window === "undefined") return;
  
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }