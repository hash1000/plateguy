const ORDER_ID_KEY = "plateguy:orderId:v1";

export function saveCurrentOrderId(orderId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ORDER_ID_KEY, orderId);
}

export function loadCurrentOrderId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ORDER_ID_KEY);
}

export function clearCurrentOrderId() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ORDER_ID_KEY);
}

