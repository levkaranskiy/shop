import api from './axios';
import type { CartItem } from '../types';

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get<CartItem[]>('/cart');
  return response.data;
};

export const addToCart = async (productId: string, quantity: number): Promise<CartItem> => {
  const response = await api.post<CartItem>('/cart', { productId, quantity });
  return response.data;
};

export const updateCartItem = async (id: string, quantity: number): Promise<CartItem> => {
  const response = await api.patch<CartItem>(`/cart/${id}`, { quantity });
  return response.data;
};

export const removeCartItem = async (id: string): Promise<void> => {
  await api.delete(`/cart/${id}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete('/cart');
};
