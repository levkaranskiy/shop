import api from './axios';
import type { User, LoginDto, RegisterDto } from '../types';

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};
