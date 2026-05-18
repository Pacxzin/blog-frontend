import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '@/services/authService';

function Navbar() {
  const navigate    = useNavigate();
  const loggedIn    = isAuthenticated();
  const user        = getCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>

        {/* Logo */}
        <Link to="/" style={styles.logo}>
          &lt;M/&gt;
        </Link>

        {/* Tudo à direita */}
        <div style={styles.rightSide}>

          {/* Links de navegacao */}
          <Link to="/" style={styles.navLink}>Home</Link>
          <Link to="/" style={styles.navLink}>Artigos</Link>

          {/* Separador vertical */}
          <div style={styles.separator} />

          {/* Icone lua */}
          <button style={styles.iconBtn} title="Tema">
            ☾
          </button>

          {loggedIn ? (
            <div ref={dropdownRef} style={styles.avatarWrapper}>
              <button
                onClick={() => setDropdownOpen(prev => !prev)}
                style={styles.avatarBtn}
                title={user?.name}
              >
                {getInitials(user?.name || 'U')}
              </button>

              {dropdownOpen && (
                <div style={styles.dropdown}>
                  <div style={styles.dropdownHeader}>
                    <span style={styles.dropdownName}>{user?.name}</span>
                    <span style={styles.dropdownEmail}>{user?.email}</span>
                  </div>
                  <div style={styles.dropdownDivider} />
                  <Link
                    to="/dashboard"
                    style={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/posts/create"
                    style={styles.dropdownItem}
                    onClick={() => setDropdownOpen(false)}
                  >
                    Novo Post
                  </Link>
                  <div style={styles.dropdownDivider} />
                  <button onClick={handleLogout} style={styles.dropdownItemDanger}>
                    Sair da conta
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authBtns}>
              <Link to="/login" style={styles.enterBtn}>Entrar</Link>
              <Link to="/register" style={styles.registerBtn}>Cadastrar</Link>
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--space-xl)',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    textDecoration: 'none',
    letterSpacing: '-0.5px',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  navLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 500,
  },
  separator: {
    width: '1px',
    height: '20px',
    backgroundColor: 'var(--border)',
  },
  iconBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1rem',
    cursor: 'pointer',
    padding: 'var(--space-xs)',
    lineHeight: 1,
  },
  authBtns: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  enterBtn: {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 500,
    padding: 'var(--space-sm) var(--space-md)',
  },
  registerBtn: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#000',
    fontWeight: 700,
    fontSize: 'var(--font-xs)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 10px)',
    right: 0,
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-lg)',
    minWidth: '200px',
    zIndex: 200,
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  dropdownName: {
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: 'var(--font-sm)',
  },
  dropdownEmail: {
    color: 'var(--text-muted)',
    fontSize: 'var(--font-sm)',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'var(--border)',
  },
  dropdownItem: {
    display: 'block',
    padding: 'var(--space-md)',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
  },
  dropdownItemDanger: {
    display: 'block',
    width: '100%',
    padding: 'var(--space-md)',
    color: 'var(--danger)',
    backgroundColor: 'transparent',
    border: 'none',
    textAlign: 'left',
    fontSize: 'var(--font-sm)',
    cursor: 'pointer',
  },
};

export default Navbar;