export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  banner: string | null;
  author_id: number;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  content: string;
  banner?: File | null;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
}

export interface ApiError {
  error: string;
}