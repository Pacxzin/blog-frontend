import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Layout é o "esqueleto" de todas as páginas
// Outlet = onde a página atual vai ser renderizada
// Toda rota dentro de <Route element={<Layout />}> herda Navbar + estrutura
function Layout() {
  return (
    <div style={styles.wrapper}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          {/* A página atual aparece aqui */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: 1,
    paddingTop: 'var(--space-xl)',
    paddingBottom: 'var(--space-2xl)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--space-lg)',
  },
};

export default Layout;