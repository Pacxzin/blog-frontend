import axios from 'axios';

// Cria uma instância do axios com configurações base
// Todos os serviços vão usar essa instância, não o axios diretamente
const api = axios.create({
  baseURL: 'http://localhost:3333', // URL da nossa API
  timeout: 10000,                   // 10 segundos máximo de espera
});

// ─── INTERCEPTOR DE REQUEST ───────────────────────────────────────────────────

// Interceptor = função que roda automaticamente em TODA requisição
// Aqui injetamos o token JWT sem precisar passar manualmente em cada chamada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ─── INTERCEPTOR DE RESPONSE ──────────────────────────────────────────────────

api.interceptors.response.use(
  (response) => response,

  (error) => {
    // So redireciona para login se NAO estiver ja na pagina de login
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      const isRegisterPage = window.location.pathname === '/register';

      if (!isLoginPage && !isRegisterPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;