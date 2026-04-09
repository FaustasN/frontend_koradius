// Central API service for communicating with the backend
import { http } from './httpclient';


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

export interface Notification {
  id: number;
  type: 'review' | 'order' | 'system';
  title: string;
  message: string;
  timestamp: string;
  is_read: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Gallery API calls
export const galleryApi = {
  getAll: async (): Promise<GalleryItem[]> => {
    return http('/gallery', { method: 'GET' });
  },

  getById: async (id: number): Promise<GalleryItem> => {
    return http(`/gallery/${id}`, { method: 'GET' });
  },

  getByCategory: async (category: string): Promise<GalleryItem[]> => {
    return http(`/gallery?category=${encodeURIComponent(category)}`, { method: 'GET' });
  },

  like: async (id: number, action: 'like' | 'unlike'): Promise<{ likes: number }> => {
    return http(`/gallery/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ action }),
    });
  }
};

// Travel packets API calls
export const travelPacketsApi = {
  getAll: async (): Promise<TravelPacket[]> => {
    return http('/travel-packets', { method: 'GET' });
  },

  getById: async (id: number): Promise<TravelPacket> => {
    return http(`/travel-packets/${id}`, { method: 'GET' });
  },

  getByCategory: async (category: string): Promise<TravelPacket[]> => {
    return http(`/travel-packets?category=${encodeURIComponent(category)}`, { method: 'GET' });
  },

  search: async (searchTerm: string): Promise<TravelPacket[]> => {
    return http(`/travel-packets?search=${encodeURIComponent(searchTerm)}`, { method: 'GET' });
  }
};

// Notifications API calls
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    return http('/notifications', { method: 'GET' });
  },

  markAsRead: async (id: number): Promise<void> => {
    await http(`/notifications/${id}/read`, { method: 'PUT' });
  }
};

// Transform functions to convert API data to frontend format
export const transformGalleryItem = (item: GalleryItem) => ({
  id: item.id,
  src: item.image_url,
  location: item.location,
  category: item.category,
  title: item.title,
  photographer: item.photographer,
  date: item.date,
  likes: item.likes
});

export const transformTravelPacket = (packet: TravelPacket) => ({
  id: packet.id,
  title: packet.title,
  location: packet.location,
  duration: packet.duration,
  price: packet.price.toString(),
  originalPrice: packet.original_price?.toString(),
  rating: packet.rating,
  reviews: packet.reviews,
  image: packet.image_url?.startsWith('http')
    ? packet.image_url
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${packet.image_url}`,
  category: packet.category,
  badge: packet.badge,
  description: packet.description,
  includes: packet.includes,
  availableSpots: packet.available_spots,
  departure: packet.departure
});


// Main API service object
export const apiService = {
  // HTTP methods
  get: async <T>(url: string): Promise<T> => {
    const cleanUrl = url.startsWith('/api') ? url.substring(4) : url;
    return http(cleanUrl, { method: 'GET' });
  },

  post: async <TResponse, TBody = unknown>(url: string, data: TBody): Promise<TResponse> => {
    const cleanUrl = url.startsWith('/api') ? url.substring(4) : url;
    return http(cleanUrl, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put: async <TResponse, TBody = unknown>(url: string, data: TBody): Promise<TResponse> => {
    const cleanUrl = url.startsWith('/api') ? url.substring(4) : url;
    return http(cleanUrl, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async <T>(url: string): Promise<T> => {
    const cleanUrl = url.startsWith('/api') ? url.substring(4) : url;
    return http(cleanUrl, { method: 'DELETE' });
  },

  // API modules
  galleryApi,
  travelPacketsApi,
  notificationsApi,
  transformGalleryItem,
  transformTravelPacket
};

export default apiService;
