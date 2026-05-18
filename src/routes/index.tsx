import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';

import Layout from '@/components/Layout';
import Home        from '@/pages/Home';
import Login       from '@/pages/Login';
import Register    from '@/pages/Register';
import Dashboard   from '@/pages/Dashboard';
import PostDetails from '@/pages/PostDetails';
import CreatePost  from '@/pages/CreatePost';
import EditPost    from '@/pages/EditPost';

// ─── ROTA PROTEGIDA ───────────────────────────────────────────────────────────

// Componente que verifica autenticação antes de renderizar a página
// Se não estiver logado, redireciona para /login automaticamente
function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
}

// ─── ROTA PÚBLICA (só para não autenticados) ──────────────────────────────────

// Evita que usuário logado acesse /login ou /register
// Se já estiver logado, manda para o dashboard
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  return !isAuthenticated() ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// ─── ROTAS DA APLICAÇÃO ───────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas dentro do Layout (com Navbar) */}
        <Route element={<Layout />}>

          {/* Públicas */}
          <Route path="/"         element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />

          {/* Só para não autenticados */}
          <Route path="/login"    element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />

          {/* Protegidas — exigem login */}
          <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/posts/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
          <Route path="/posts/edit/:id" element={<PrivateRoute><EditPost /></PrivateRoute>} />

        </Route>

        {/* Qualquer rota não mapeada vai para Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;