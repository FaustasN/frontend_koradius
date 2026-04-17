import { http } from './httpclient';

// Common types
export interface BasicResponse {
  success?: boolean;
  message?: string;
}

export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;
  user?: {
    username: string;
    role: string;
  };
}
export interface ValidateResponse {
  valid: boolean;
  message?: string;
  user?: {
    username: string;
    role: string;
  };
}
export interface UnreadCountResponse {
  count: number;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferred_contact?: string;
  urgency?: string;
  is_resolved?: boolean;
  created_at?: string;
}

export interface ContactSubmitPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredContact?: string;
  urgency?: string;
}

export interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  trip_reference?: string;
  is_approved: boolean;
  created_at: string;
}

export interface ReviewSubmitPayload {
  name: string;
  email: string;
  rating: number;
  comment: string;
  tripReference?: string;
}

export interface ReviewUpdatePayload {
  name: string;
  email: string;
  rating: number;
  comment: string;
  trip_reference?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  location: string;
  category: string;
  image_url: string;
  photographer: string;
  date: string;
  likes: number;
  is_active: boolean;
}

export interface GalleryPayload {
  title: string;
  location: string;
  category: string;
  imageUrl: string;
  photographer: string;
  date: string;
  likes?: number;
  is_active?: boolean;
}

export interface TravelPacket {
  id: number;
  title: string;
  location: string;
  duration: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews: number;
  image_url: string;
  category: string;
  badge: string;
  description: string;
  includes: string[];
  available_spots: number;
  departure: string;
  is_active: boolean;
}

export interface TravelPacketPayload {
  title: string;
  location: string;
  duration: string;
  price: number;
  original_price?: number;
  rating: number;
  reviews: number;
  image_url: string;
  category: string;
  badge: string;
  description: string;
  includes: string[];
  available_spots: number;
  departure?: string;
  is_active?: boolean;
}

export interface PaymentProductInfo {
  departureDate?: string;
  numberOfPeople?: number;
  travelPacketTitle?: string;
  unitPrice?: number;
  totalAmountEur?: number;
}

export interface Payment {
  id: number;
  order_id: string;
  travel_packet_id: number | null;
  travel_packet_title: string | null;
  amount: number;
  currency: string;
  description: string | null;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'refunded';
  paysera_status: number | null;
  is_test: boolean;
  payment_method: string | null;
  pay_amount: number | null;
  pay_currency: string | null;
  customer_email: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  product_info: PaymentProductInfo | string | null;
  callback_raw: unknown;
  paid_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
}

export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  validate: async (): Promise<ValidateResponse> => {
    return http<ValidateResponse>('/auth/validate', {
      method: 'GET',
    });
  },

  logout: async (): Promise<BasicResponse> => {
    return http<BasicResponse>('/auth/logout', {
      method: 'POST',
    });
  }
};

// Contacts API
export const contactsAPI = {
  getAll: async (): Promise<Contact[]> => {
    return http<Contact[]>('/admin/contacts/all', {
      method: 'GET',
    });
  },

  submit: async (contactData: ContactSubmitPayload): Promise<BasicResponse> => {
    return http<BasicResponse>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
};

// Reviews API
export const reviewsAPI = {
  getAll: async (): Promise<Review[]> => {
    return http<Review[]>('/admin/reviews/all', {
      method: 'GET',
    });
  },

  approve: async (id: number, featured = false): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ featured }),
    });
  },

  unapprove: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}/unapprove`, {
      method: 'PUT',
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}`, {
      method: 'DELETE',
    });
  },

  getApproved: async (): Promise<Review[]> => {
    return http<Review[]>('/reviews/approved', {
      method: 'GET',
    });
  },

  submit: async (reviewData: ReviewSubmitPayload): Promise<BasicResponse> => {
    return http<BasicResponse>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  update: async (
    id: number,
    reviewData: ReviewUpdatePayload
  ): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async (): Promise<GalleryItem[]> => {
    return http<GalleryItem[]>('/gallery', { method: 'GET' });
  },

  create: async (data: GalleryPayload): Promise<GalleryItem> => {
    return http<GalleryItem>('/gallery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: Partial<GalleryPayload>
  ): Promise<GalleryItem> => {
    return http<GalleryItem>(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};

// Travel Packets API
export const travelPacketsAPI = {
  getAll: async (): Promise<TravelPacket[]> => {
    return http<TravelPacket[]>('/travel-packets', { method: 'GET' });
  },

  create: async (data: TravelPacketPayload): Promise<TravelPacket> => {
    return http<TravelPacket>('/travel-packets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: Partial<TravelPacketPayload>
  ): Promise<TravelPacket> => {
    return http<TravelPacket>(`/travel-packets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/travel-packets/${id}`, {
      method: 'DELETE',
    });
  },
};

export const paymentsAPI = {
  getAll: async (): Promise<Payment[]> => {
    return http<Payment[]>('/admin/payments', {
      method: 'GET',
    });
  },
};