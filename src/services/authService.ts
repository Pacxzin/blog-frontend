import api from './api';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

// ─── REGISTER ─────────────────────────────────────────────────────────────────

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', credentials);
  return response.data;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  // Salva token e dados do usuário no localStorage
  localStorage.setItem('token', response.data.token);
  localStorage.setItem('user', JSON.stringify(response.data.user));

  return response.data;
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Verifica se há um usuário logado
export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

// Retorna os dados do usuário logado
export function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}