import { http } from "./httpclient";

export interface ContactInquiryPayload {
  name: string;
  email: string;
  phone: string;
  subject: string;
  urgency: string;
  message: string;
  preferredContact: string;
}

export interface ContactMailResponse {
  message: string;
}

/** POSTs the contact form to the API; backend sends mail via nodemailer. */
export async function submitContactInquiry(
  payload: ContactInquiryPayload
): Promise<ContactMailResponse> {
  return http<ContactMailResponse>("/contact-mail", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
