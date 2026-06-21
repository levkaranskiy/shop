import api from './axios';
import type { Order } from '../types';

export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders');
  return response.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/orders/all');
  return response.data;
};

export const createOrder = async (address: string, phone: string): Promise<Order> => {
  const response = await api.post<Order>('/orders', { address, phone });
  return response.data;
};

export const deleteOrder = async (id: string): Promise<void> => {
  await api.delete(`/orders/${id}`);
};
