import { http } from './httpclient';

// Get auth token from cookie
const getAuthToken = (): string | null => {
  const nameEQ = 'adminToken=';
  const ca = document.cookie.split(';');

  for (const cookie of ca) {
    let c = cookie;
    while (c.startsWith(' ')) c = c.substring(1, c.length);
    if (c.startsWith(nameEQ)) return c.substring(nameEQ.length, c.length);
  }

  return null;
};

// Create authenticated request headers
const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Common types
export interface BasicResponse {
  success?: boolean;
  message?: string;
}

export interface AuthResponse {
  token?: string;
  success?: boolean;
  message?: string;
}

export interface Notification {
  id: number;
  type: 'review' | 'order' | 'system';
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
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
  customer_email_encrypted: string | null;
  customer_name_encrypted: string | null;
  customer_phone_encrypted: string | null;
  product_info_encrypted: string | null;
  callback_raw: unknown;
  paid_at: string | null;
  failed_at: string | null;
  created_at: string;
  updated_at: string;
}

type LogFilterValue =
  | string
  | number
  | boolean
  | string[]
  | number[]
  | undefined
  | null;

export type LogFilters = Record<string, LogFilterValue>;

export type LogEntry = Record<string, unknown>;
export type LogStats = Record<string, unknown>;
export type AuditTrailEntry = Record<string, unknown>;
export type ComplianceReport = Record<string, unknown>;
export type ServerStatus = Record<string, unknown>;
export type LoadBalancerStatus = Record<string, unknown>;
export type QueueStats = Record<string, unknown>;
export type InstanceInfo = Record<string, unknown>;
export type PublicHealth = Record<string, unknown>;
export type SystemMetrics = Record<string, unknown>;
export type SystemHistory = Record<string, unknown>;
export type BackendHealth = Record<string, unknown>;
export type LoadBalancerHealth = Record<string, unknown>;
export type CompleteServerStatus = Record<string, unknown>;

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    return http<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  validate: async (): Promise<BasicResponse> => {
    return http<BasicResponse>('/auth/validate', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<BasicResponse> => {
    return http<BasicResponse>('/auth/change-password', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (
    sortBy?: 'date' | 'priority' | 'type'
  ): Promise<Notification[]> => {
    const query = sortBy ? `?sortBy=${encodeURIComponent(sortBy)}` : '';

    return http<Notification[]>(`/notifications${query}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  markAsRead: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  markAllAsRead: async (): Promise<BasicResponse> => {
    return http<BasicResponse>('/notifications/mark-all-read', {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return http<UnreadCountResponse>('/notifications/unread-count', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
};

// Contacts API
export const contactsAPI = {
  getAll: async (): Promise<Contact[]> => {
    return http<Contact[]>('/admin/contacts', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  resolve: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/contacts/${id}/resolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  unresolve: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/contacts/${id}/unresolve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  submit: async (contactData: ContactSubmitPayload): Promise<BasicResponse> => {
    return http<BasicResponse>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (): Promise<Review[]> => {
    return http<Review[]>('/admin/reviews/all', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  approve: async (id: number, featured = false): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}/approve`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ featured }),
    });
  },

  unapprove: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}/unapprove`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: Partial<GalleryPayload>
  ): Promise<GalleryItem> => {
    return http<GalleryItem>(`/gallery/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  update: async (
    id: number,
    data: Partial<TravelPacketPayload>
  ): Promise<TravelPacket> => {
    return http<TravelPacket>(`/travel-packets/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
  },

  delete: async (id: number): Promise<BasicResponse> => {
    return http<BasicResponse>(`/travel-packets/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  },
};
export const paymentsAPI = {
  getAll: async (): Promise<Payment[]> => {
    return http<Payment[]>('/admin/payments', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
};
// Server Monitoring API
export const serverAPI = {
  getServerStatus: async (): Promise<ServerStatus> => {
    return http<ServerStatus>('/admin/server-status', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getLoadBalancerStatus: async (): Promise<LoadBalancerStatus> => {
    return http<LoadBalancerStatus>('/admin/load-balancer-status', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getQueueStats: async (): Promise<QueueStats> => {
    return http<QueueStats>('/admin/queue-stats', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getInstanceInfo: async (): Promise<InstanceInfo> => {
    return http<InstanceInfo>('/admin/instance-info', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getPublicHealth: async (): Promise<PublicHealth> => {
    return http<PublicHealth>('/health', { method: 'GET' });
  },

  retryFailedJobs: async (queueName: string): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/queue/${queueName}/retry-failed`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  cleanQueue: async (queueName: string): Promise<BasicResponse> => {
    return http<BasicResponse>(`/admin/queue/${queueName}/clean`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    return http<SystemMetrics>('/admin/system-metrics', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getSystemHistory: async (points = 60): Promise<SystemHistory> => {
    return http<SystemHistory>(`/admin/system-history?points=${points}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getServerStatusEnhanced: async (): Promise<ServerStatus> => {
    return http<ServerStatus>('/admin/server-status-enhanced', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getBackendHealth: async (): Promise<BackendHealth> => {
    return http<BackendHealth>('/admin/backend-health', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  forceBackendHealthCheck: async (): Promise<BackendHealth> => {
    return http<BackendHealth>('/admin/backend-health/force-check', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getLoadBalancerHealth: async (): Promise<LoadBalancerHealth> => {
    return http<LoadBalancerHealth>('/admin/load-balancer-health', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getCompleteServerStatus: async (): Promise<CompleteServerStatus> => {
    return http<CompleteServerStatus>('/admin/server-status-complete', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },
};

// Logging API
export const loggingAPI = {
  getLogs: async (filters: LogFilters = {}): Promise<LogEntry[]> => {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    return http<LogEntry[]>(`/admin/logs?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getLogStats: async (timeRange = '24h'): Promise<LogStats> => {
    return http<LogStats>(`/admin/logs/stats?timeRange=${timeRange}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getUserAuditTrail: async (
    userId: number,
    startDate?: string,
    endDate?: string,
    limit = 100
  ): Promise<AuditTrailEntry[]> => {
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    queryParams.append('limit', String(limit));

    return http<AuditTrailEntry[]>(`/admin/logs/audit/${userId}?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  getComplianceReport: async (
    startDate?: string,
    endDate?: string,
    regulation?: string
  ): Promise<ComplianceReport> => {
    const queryParams = new URLSearchParams();

    if (startDate) queryParams.append('startDate', startDate);
    if (endDate) queryParams.append('endDate', endDate);
    if (regulation) queryParams.append('regulation', regulation);

    return http<ComplianceReport>(`/admin/logs/compliance?${queryParams}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
  },

  cleanupLogs: async (retentionDays = 30): Promise<BasicResponse> => {
    return http<BasicResponse>('/admin/logs/cleanup', {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ retentionDays }),
    });
  },
};