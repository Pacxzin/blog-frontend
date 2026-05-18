import api from './api';
import { Post, CreatePostData, UpdatePostData } from '@/types';

// ─── LISTAR TODOS OS POSTS ────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  const response = await api.get<Post[]>('/posts');
  return response.data;
}

// ─── BUSCAR POST POR ID ───────────────────────────────────────────────────────

export async function getPostById(id: number): Promise<Post> {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
}

// ─── CRIAR POST ───────────────────────────────────────────────────────────────

export async function createPost(data: CreatePostData): Promise<Post> {
  // Posts com imagem precisam de FormData (multipart/form-data)
  // Posts sem imagem poderiam usar JSON, mas FormData funciona nos dois casos
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);

  if (data.banner) {
    formData.append('banner', data.banner);
  }

  const response = await api.post<Post>('/posts', formData, {
    headers: {
      // Sobrescreve o Content-Type para multipart quando tem arquivo
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

// ─── EDITAR POST ──────────────────────────────────────────────────────────────

export async function updatePost(id: number, data: UpdatePostData): Promise<Post> {
  const response = await api.put<Post>(`/posts/${id}`, data);
  return response.data;
}

// ─── DELETAR POST ─────────────────────────────────────────────────────────────

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}