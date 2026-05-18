import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        {/* Topo do footer */}
        <div style={styles.top}>

          {/* Coluna esquerda — Logo e descricao */}
          <div style={styles.brand}>
            <Link to="/" style={styles.logo}>&lt;M/&gt;</Link>
            <p style={styles.description}>
              Seu portal de tecnologia com artigos, tutoriais
              e novidades do mundo tech.
            </p>
          </div>

          {/* Colunas direita — Links */}
          <div style={styles.columns}>

            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Navegacao</h4>
              <div style={styles.columnLinks}>
                <Link to="/" style={styles.footerLink}>Home</Link>
                <Link to="/" style={styles.footerLink}>Artigos</Link>
                <Link to="/dashboard" style={styles.footerLink}>Dashboard</Link>
              </div>
            </div>

            <div style={styles.column}>
              <h4 style={styles.columnTitle}>Redes Sociais</h4>
              <div style={styles.columnLinks}>
                <a href="#" style={styles.footerLink}>LinkedIn</a>
                <a href="#" style={styles.footerLink}>GitHub</a>
                <a href="#" style={styles.footerLink}>Twitter</a>
              </div>
            </div>

          </div>
        </div>

        {/* Divisor */}
        <div style={styles.divider} />

        {/* Copyright */}
        <p style={styles.copyright}>
          © 2025 TechBlog. Todos os direitos reservados.
        </p>

      </div>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    backgroundColor: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border)',
    marginTop: 'auto',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--space-2xl) var(--space-xl)',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 'var(--space-2xl)',
    flexWrap: 'wrap',
    marginBottom: 'var(--space-xl)',
  },
  brand: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    maxWidth: '260px',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textDecoration: 'none',
  },
  description: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-sm)',
    lineHeight: 1.6,
  },
  columns: {
    display: 'flex',
    gap: 'var(--space-2xl)',
    flexWrap: 'wrap',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  columnTitle: {
    color: 'var(--text-primary)',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
  },
  columnLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  footerLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    transition: 'color var(--transition)',
  },
  divider: {
    height: '1px',
    backgroundColor: 'var(--border)',
    marginBottom: 'var(--space-lg)',
  },
  copyright: {
    color: 'var(--text-muted)',
    fontSize: 'var(--font-sm)',
    textAlign: 'center',
  },
};

export default Footer;