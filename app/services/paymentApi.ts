const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export type CreatePaymentPayload = {
  travelPacketId: number;
  name: string;
  phone: string;
  email: string;
  departureDate: string;
  numberOfPeople: number;
};

export type CreatePaymentResponse = {
  paymentUrl: string;
  orderId: string;
};

type ApiErrorResponse = {
  error?: string;
};

export const paymentApi = {
  async createPayment(payload: CreatePaymentPayload): Promise<CreatePaymentResponse> {
    const response = await fetch(`${API_BASE_URL}/paysera/create-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    let data: CreatePaymentResponse | ApiErrorResponse;

    try {
      data = await response.json();
    } catch {
      throw new Error("Server returned invalid response");
    }

    if (!response.ok) {
      throw new Error(
        "error" in data && data.error ? data.error : "Failed to create payment"
      );
    }

    if (!("paymentUrl" in data) || !("orderId" in data)) {
      throw new Error("Payment response is missing required fields");
    }

    return data;
  },
};