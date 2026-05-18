import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts, deletePost } from '@/services/postService';
import { getCurrentUser } from '@/services/authService';
import { Post } from '@/types';

function Dashboard() {
  const currentUser = getCurrentUser();
  const [posts, setPosts]     = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyPosts() {
      try {
        const allPosts = await getAllPosts();
        const myPosts  = allPosts.filter(p => p.author_id === currentUser?.id);
        setPosts(myPosts);
      } catch (err) {
        console.error('Erro ao carregar posts');
      } finally {
        setLoading(false);
      }
    }
    fetchMyPosts();
  }, []);

  async function handleDelete(postId: number) {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      alert('Erro ao excluir post');
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>

      {/* ─── HEADER ────────────────────────────────────────── */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard</h1>
          <p style={styles.subtitle}>Bem-vindo de volta, {currentUser?.name}!</p>
        </div>
        <div style={styles.headerActions}>
          <Link to="/posts/create" style={styles.newPostBtn}>
            + Novo Artigo
          </Link>
        </div>
      </div>

      {/* ─── CARDS DE METRICAS ─────────────────────────────── */}
      <div style={styles.metricsGrid}>

        <div style={styles.metricCard}>
          <div style={styles.metricTop}>
            <span style={styles.metricLabel}>Total de Artigos</span>
            <span style={styles.metricIcon}>📄</span>
          </div>
          <span style={styles.metricValue}>{posts.length}</span>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricTop}>
            <span style={styles.metricLabel}>Engajamento</span>
            <span style={styles.metricIcon}>💬</span>
          </div>
          <span style={styles.metricValue}>0</span>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricTop}>
            <span style={styles.metricLabel}>Curtidas</span>
            <span style={styles.metricIcon}>♡</span>
          </div>
          <span style={styles.metricValue}>0</span>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricTop}>
            <span style={styles.metricLabel}>Tempo medio de leitura</span>
            <span style={styles.metricIcon}>↗</span>
          </div>
          <span style={styles.metricValue}>
            {posts.length > 0 ? `${Math.ceil(posts.length * 4)} min` : '0 min'}
          </span>
        </div>

      </div>

      {/* ─── CONTEUDO PRINCIPAL ────────────────────────────── */}
      <div style={styles.mainGrid}>

        {/* Meus Artigos */}
        <div style={styles.postsSection}>
          <h2 style={styles.sectionTitle}>Meus Artigos</h2>

          {posts.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyText}>Voce ainda nao publicou nenhum artigo.</p>
              <Link to="/posts/create" style={styles.newPostBtn}>
                Criar primeiro artigo
              </Link>
            </div>
          ) : (
            <div style={styles.postsList}>
              {posts.map((post) => (
                <div key={post.id} style={styles.postRow}>

                  {/* Thumbnail */}
                  <div style={styles.thumbnail}>
                    {post.banner ? (
                      <img
                        src={`http://localhost:3333/${post.banner}`}
                        alt={post.title}
                        style={styles.thumbnailImg}
                      />
                    ) : (
                      <div style={styles.thumbnailPlaceholder}>
                        <span style={styles.thumbnailLetter}>
                          {post.title[0].toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={styles.postInfo}>
                    <p style={styles.postTitle}>{post.title}</p>
                    <p style={styles.postPreview}>
                      {post.content.length > 60
                        ? post.content.substring(0, 60) + '...'
                        : post.content}
                    </p>
                    <div style={styles.postMeta}>
                      <span style={styles.postDate}>{formatDate(post.created_at)}</span>
                      <span style={styles.metaDot}>•</span>
                      <span style={styles.postStat}>💬 0</span>
                      <span style={styles.metaDot}>•</span>
                      <span style={styles.postStat}>♡ 0</span>
                    </div>
                  </div>

                  {/* Acoes */}
                  <div style={styles.postActions}>
                    <Link to={`/posts/edit/${post.id}`} style={styles.editBtn}>
                      ✎ Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      style={styles.deleteBtn}
                    >
                      🗑 Excluir
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Atividade Recente */}
        <div style={styles.activitySection}>
          <h2 style={styles.sectionTitle}>Atividade Recente</h2>

          <div style={styles.activityList}>
            {posts.length === 0 ? (
              <p style={styles.emptyText}>Nenhuma atividade ainda.</p>
            ) : (
              posts.slice(0, 3).map((post) => (
                <div key={post.id} style={styles.activityItem}>
                  <div style={styles.activityAvatar}>
                    {currentUser?.name[0].toUpperCase()}
                  </div>
                  <div style={styles.activityInfo}>
                    <p style={styles.activityText}>
                      <strong>{currentUser?.name}</strong> publicou
                    </p>
                    <Link
                      to={`/posts/${post.id}`}
                      style={styles.activityLink}
                    >
                      {post.title}
                    </Link>
                    <p style={styles.activityDate}>
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: 'var(--space-xl)',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh',
  },
  loadingText: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-lg)',
  },

  // ─── HEADER
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 'var(--space-xl)',
    flexWrap: 'wrap',
    gap: 'var(--space-md)',
  },
  title: {
    fontSize: 'var(--font-2xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-xs)',
  },
  subtitle: {
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
  },
  headerActions: {
    display: 'flex',
    gap: 'var(--space-md)',
    alignItems: 'center',
  },
  newPostBtn: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    textDecoration: 'none',
    padding: 'var(--space-sm) var(--space-lg)',
    borderRadius: 'var(--radius-md)',
    fontWeight: 700,
    fontSize: 'var(--font-sm)',
    whiteSpace: 'nowrap' as const,
  },

  // ─── METRICAS
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: 'var(--space-md)',
    marginBottom: 'var(--space-xl)',
  },
  metricCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  metricTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 'var(--font-sm)',
    color: 'var(--text-secondary)',
  },
  metricIcon: {
    fontSize: '1rem',
    color: 'var(--text-muted)',
  },
  metricValue: {
    fontSize: 'var(--font-2xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },

  // ─── GRID PRINCIPAL
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: 'var(--space-xl)',
    alignItems: 'start',
  },

  // ─── POSTS
  postsSection: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
  },
  sectionTitle: {
    fontSize: 'var(--font-lg)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginBottom: 'var(--space-lg)',
  },
  postsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  postRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-md)',
    padding: 'var(--space-md) 0',
    borderBottom: '1px solid var(--border)',
  },
  thumbnail: {
    width: '72px',
    height: '72px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #f4a4a4 60%, #a4c4f4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailLetter: {
    fontSize: '1.5rem',
    fontWeight: 900,
    color: '#1a1a2e',
    fontFamily: 'serif',
  },
  postInfo: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xs)',
  },
  postTitle: {
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  postPreview: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  postMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
  },
  postDate: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  metaDot: {
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
  },
  postStat: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  postActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
    flexShrink: 0,
  },
  editBtn: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-xs) var(--space-md)',
    fontSize: '0.75rem',
    fontWeight: 500,
    textAlign: 'center' as const,
    whiteSpace: 'nowrap' as const,
  },
  deleteBtn: {
    backgroundColor: 'transparent',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
    borderRadius: 'var(--radius-sm)',
    padding: 'var(--space-xs) var(--space-md)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'var(--space-lg)',
    padding: 'var(--space-2xl) 0',
  },
  emptyText: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-sm)',
  },

  // ─── ATIVIDADE
  activitySection: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--space-lg)',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  activityItem: {
    display: 'flex',
    gap: 'var(--space-md)',
    alignItems: 'flex-start',
  },
  activityAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'var(--accent)',
    color: '#000',
    fontWeight: 700,
    fontSize: 'var(--font-sm)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  activityInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  activityText: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
  },
  activityLink: {
    fontSize: '0.75rem',
    color: 'var(--accent)',
    textDecoration: 'none',
    fontWeight: 500,
  },
  activityDate: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
};

export default Dashboard;