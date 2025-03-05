import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Shops API
export const shops = {
  getAll: () => api.get('/shops'),
  getById: (id: string) => api.get(`/shops/${id}`),
  create: (data: { name: string; description: string; imageUrl?: string }) =>
    api.post('/shops', data),
  update: (id: string, data: { name?: string; description?: string; imageUrl?: string }) =>
    api.put(`/shops/${id}`, data),
  delete: (id: string) => api.delete(`/shops/${id}`),
  getProducts: (id: string) => api.get(`/shops/${id}/products`),
};

// Products API
export const products = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: {
    name: string;
    description: string;
    price: number;
    shopId: string;
    imageUrl?: string;
    category: string;
    stock: number;
  }) => api.post('/products', data),
  update: (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    imageUrl?: string;
    category?: string;
    stock?: number;
  }) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export default api;
