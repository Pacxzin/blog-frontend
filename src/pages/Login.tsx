import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/services/authService';

function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('1 - handleSubmit chamado');

    if (loading) return;

    setError('');
    setLoading(true);

    try {
      console.log('2 - tentando login');
      await login({ email, password });
      console.log('3 - login ok, redirecionando');
      navigate('/dashboard');
    } catch (err: any) {
      console.log('4 - erro capturado:', err);
      const message = err.response?.data?.error || 'Erro ao fazer login';
      console.log('5 - setando erro:', message);
      setError(message);
    } finally {
      console.log('6 - finally');
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>

        <div style={styles.header}>
          <h1 style={styles.title}>Entrar na Plataforma</h1>
          <p style={styles.subtitle}>Acesse sua conta para gerenciar seus posts</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.field}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              required
            />
          </div>

          <button
            type="submit"
            style={loading ? styles.btnDisabled : styles.btn}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

        </form>

        <p style={styles.footer}>
          Nao tem uma conta?{' '}
          <Link to="/register" style={styles.link}>
            Cadastre-se
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-2xl)',
    width: '100%',
    maxWidth: '440px',
    boxShadow: 'var(--shadow-lg)',
  },
  header: {
    marginBottom: 'var(--space-xl)',
    textAlign: 'center',
  },
  title: {
    fontSize: 'var(--font-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-sm)',
  },
  subtitle: {
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
  },
  errorBox: {
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    border: '1px solid var(--danger)',
    color: 'var(--danger)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    marginBottom: 'var(--space-lg)',
    fontSize: 'var(--font-sm)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-lg)',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  label: {
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  input: {
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    color: 'var(--text-primary)',
    fontSize: 'var(--font-md)',
    outline: 'none',
  },
  btn: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    fontSize: 'var(--font-md)',
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 'var(--space-sm)',
  },
  btnDisabled: {
    backgroundColor: 'var(--text-muted)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    fontSize: 'var(--font-md)',
    fontWeight: 700,
    cursor: 'not-allowed',
    marginTop: 'var(--space-sm)',
  },
  footer: {
    textAlign: 'center',
    marginTop: 'var(--space-lg)',
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 600,
  },
};

export default Login;