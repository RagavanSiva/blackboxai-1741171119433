export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'business_owner';
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  name: string;
  description: string;
  owner: User | string;
  imageUrl: string;
  rating: number;
  products: Product[] | string[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  shop: Shop | string;
  imageUrl: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  error?: string;
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  role?: 'customer' | 'business_owner';
}

export interface ShopForm {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface ProductForm {
  name: string;
  description: string;
  price: number;
  shopId: string;
  imageUrl?: string;
  category: string;
  stock: number;
}
