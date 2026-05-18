import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '@/services/postService';
import { isAuthenticated } from '@/services/authService';
import { Post } from '@/types';
import PostCard from '@/components/PostCard';

function Home() {
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const loggedIn              = isAuthenticated();

  // Ref para a secao de artigos em destaque
  const featuredRef = useRef<HTMLElement>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error('Erro ao carregar posts');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Scroll suave ate a secao de artigos
  function scrollToFeatured() {
    featuredRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const featured = posts.slice(0, 4);
  const recent   = posts.slice(4);

  return (
    <div>

      {/* ─── HERO ────────────────────────────────────────────── */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Explore o Futuro da{' '}
            <span style={styles.heroAccent}>Tecnologia</span>
          </h1>
          <p style={styles.heroSubtitle}>
            Artigos sobre IA, desenvolvimento,
            DevOps e as ultimas tendencias tecnologicas
          </p>
          <div style={styles.heroBtns}>

            {/* Scroll suave para artigos */}
            <button
              onClick={scrollToFeatured}
              style={styles.heroBtnPrimary}
            >
              Explorar Artigos
            </button>

            {/* Redireciona para criar post ou register */}
            <Link
              to={loggedIn ? '/posts/create' : '/register'}
              style={styles.heroBtnSecondary}
            >
              Comecar a Escrever
            </Link>

          </div>
        </div>
      </section>

      {/* ─── ARTIGOS EM DESTAQUE ─────────────────────────────── */}
      {!loading && featured.length > 0 && (
        <section ref={featuredRef} style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Artigos em Destaque</h2>
                <p style={styles.sectionSubtitle}>
                  Os melhores conteudos selecionados para voce
                </p>
              </div>
              <Link to="/" style={styles.seeAll}>Ver todos →</Link>
            </div>

            <div style={styles.featuredGrid}>
              {featured.map((post) => (
                <Link key={post.id} to={`/posts/${post.id}`} style={styles.cardLink}>
                  <PostCard post={post} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ARTIGOS RECENTES ────────────────────────────────── */}
      {!loading && recent.length > 0 && (
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>Artigos Recentes</h2>
                <p style={styles.sectionSubtitle}>
                  Conteudo recente da comunidade
                </p>
              </div>
            </div>

            <div style={styles.recentGrid}>
              {recent.map((post) => (
                <Link key={post.id} to={`/posts/${post.id}`} style={styles.cardLink}>
                  <PostCard post={post} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── ESTADO VAZIO ────────────────────────────────────── */}
      {!loading && posts.length === 0 && (
        <section ref={featuredRef} style={styles.section}>
          <div style={styles.container}>
            <div style={styles.empty}>
              <p style={styles.emptyText}>Nenhum artigo publicado ainda.</p>
              <Link to="/posts/create" style={styles.heroBtnPrimary}>
                Publicar primeiro artigo
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── NEWSLETTER — toca os dois lados ─────────────────── */}
      <section style={styles.newsletter}>
        <div style={styles.newsletterContent}>
          <div style={styles.newsletterIcon}>✉</div>
          <h2 style={styles.newsletterTitle}>Newsletter Semanal</h2>
          <p style={styles.newsletterSubtitle}>
            Receba os melhores artigos de tecnologia diretamente no seu email.
            Sem spam, apenas conteudo de qualidade.
          </p>
          <div style={styles.newsletterForm}>
            <input
              type="email"
              placeholder="exemplo@email.com"
              style={styles.newsletterInput}
            />
            <button style={styles.newsletterBtn}>Inscrever</button>
          </div>
          <p style={styles.newsletterNote}>
            Mais de 10.000 desenvolvedores ja recebem nossa newsletter
          </p>
        </div>
      </section>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  // ─── HERO
  hero: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 'var(--space-3xl) var(--space-xl)',
  },
  heroContent: {
    maxWidth: '640px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-lg)',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: 800,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  heroAccent: {
    color: 'var(--accent)',
  },
  heroSubtitle: {
    fontSize: 'var(--font-md)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth: '480px',
  },
  heroBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
    width: '100%',
    maxWidth: '360px',
  },
  heroBtnPrimary: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: 'var(--font-sm)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    display: 'block',
    width: '100%',
  },
  heroBtnSecondary: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 'var(--font-sm)',
    padding: 'var(--space-md)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    textAlign: 'center',
    display: 'block',
  },

  // ─── SECTIONS
  section: {
    padding: 'var(--space-2xl) 0',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 var(--space-xl)',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-xl)',
  },
  sectionTitle: {
    fontSize: 'var(--font-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-xs)',
  },
  sectionSubtitle: {
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
  },
  seeAll: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  },
  featuredGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 'var(--space-lg)',
  },
  recentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 'var(--space-lg)',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  },

  // ─── EMPTY
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-xl)',
    padding: 'var(--space-3xl) 0',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-lg)',
  },

  // ─── NEWSLETTER — sem maxWidth, ocupa 100% da tela
newsletter: {
  backgroundColor: 'var(--bg-secondary)',
  borderTop: '1px solid var(--border)',
  borderBottom: '1px solid var(--border)',
  padding: 'var(--space-3xl) var(--space-xl)',
  textAlign: 'center' as const,
  position: 'relative' as const,
  left: '50%',
  right: '50%',
  marginLeft: '-50vw',
  marginRight: '-50vw',
  width: '100vw',
},
  newsletterContent: {
    maxWidth: '480px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-md)',
  },
  newsletterIcon: {
    fontSize: '1.5rem',
    color: 'var(--text-secondary)',
  },
  newsletterTitle: {
    fontSize: 'var(--font-xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  newsletterSubtitle: {
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
  },
  newsletterForm: {
    display: 'flex',
    gap: 'var(--space-sm)',
    width: '100%',
  },
  newsletterInput: {
    flex: 1,
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-md)',
    color: 'var(--text-primary)',
    fontSize: 'var(--font-sm)',
    outline: 'none',
  },
  newsletterBtn: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-lg)',
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  newsletterNote: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};

export default Home;