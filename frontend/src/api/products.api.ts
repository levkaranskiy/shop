import api from './axios';
import type { Product, CreateProductDto, UpdateProductDto, ProductFilters } from '../types';

interface ProductsResponse {
  products: Product[];
  total: number;
}

export const getProducts = async (params?: ProductFilters): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>('/products', { params });
  return response.data;
};

export const getCategories = async (): Promise<string[]> => {
  const response = await api.get<string[]>('/products/categories');
  return response.data;
};

export const getProduct = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const createProduct = async (data: CreateProductDto): Promise<Product> => {
  const response = await api.post<Product>('/products', data);
  return response.data;
};

export const updateProduct = async (id: string, data: UpdateProductDto): Promise<Product> => {
  const response = await api.patch<Product>(`/products/${id}`, data);
  return response.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
  await api.delete(`/products/${id}`);
};
