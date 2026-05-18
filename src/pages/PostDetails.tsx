import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, deletePost } from '@/services/postService';
import { getCurrentUser, isAuthenticated } from '@/services/authService';
import { Post } from '@/types';

function PostDetails() {
  const { id }       = useParams();           // pega o :id da URL
  const navigate     = useNavigate();
  const [post, setPost]         = useState<Post | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [deleting, setDeleting] = useState(false);

  const currentUser  = getCurrentUser();
  const isOwner      = isAuthenticated() && post?.author_id === currentUser?.id;

  useEffect(() => {
    async function fetchPost() {
      try {
        const data = await getPostById(Number(id));
        setPost(data);
      } catch (err) {
        setError('Post nao encontrado');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  async function handleDelete() {
    if (!confirm('Tem certeza que deseja deletar este post?')) return;

    setDeleting(true);
    try {
      await deletePost(Number(id));
      navigate('/dashboard');
    } catch (err) {
      alert('Erro ao deletar post');
      setDeleting(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  }

  // ─── ESTADOS DE UI ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={styles.message}>Carregando post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={styles.centered}>
        <p style={styles.errorMessage}>{error || 'Post nao encontrado'}</p>
        <Link to="/" style={styles.backLink}>← Voltar para Home</Link>
      </div>
    );
  }

  const bannerUrl = post.banner
    ? `http://localhost:3333/${post.banner}`
    : null;

  // ─── RENDER PRINCIPAL ────────────────────────────────────────────────────

  return (
    <div style={styles.wrapper}>

      {/* Botao voltar */}
      <Link to="/" style={styles.backLink}>← Voltar</Link>

      {/* Banner */}
      {bannerUrl && (
        <div style={styles.bannerWrapper}>
          <img src={bannerUrl} alt={post.title} style={styles.banner} />
        </div>
      )}

      {/* Header do post */}
      <div style={styles.header}>
        <h1 style={styles.title}>{post.title}</h1>

        <div style={styles.meta}>
          <span style={styles.author}>Por {post.author_name}</span>
          <span style={styles.separator}>•</span>
          <span style={styles.date}>{formatDate(post.created_at)}</span>
          {post.updated_at !== post.created_at && (
            <>
              <span style={styles.separator}>•</span>
              <span style={styles.date}>
                Editado em {formatDate(post.updated_at)}
              </span>
            </>
          )}
        </div>

        {/* Acoes do dono do post */}
        {isOwner && (
          <div style={styles.actions}>
            <Link
              to={`/posts/edit/${post.id}`}
              style={styles.editBtn}
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              style={deleting ? styles.deleteBtnDisabled : styles.deleteBtn}
              disabled={deleting}
            >
              {deleting ? 'Deletando...' : 'Deletar'}
            </button>
          </div>
        )}
      </div>

      {/* Divisor */}
      <hr style={styles.divider} />

      {/* Conteudo do post */}
      <div style={styles.content}>
        {/* Quebra o conteudo em paragrafos por linha */}
        {post.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? (
            <p key={index} style={styles.paragraph}>{paragraph}</p>
          ) : (
            <br key={index} />
          )
        ))}
      </div>

    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  centered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '40vh',
    gap: 'var(--space-lg)',
  },
  backLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    display: 'inline-block',
    marginBottom: 'var(--space-xl)',
    transition: 'color var(--transition)',
  },
  bannerWrapper: {
    width: '100%',
    height: '400px',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    marginBottom: 'var(--space-xl)',
  },
  banner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  header: {
    marginBottom: 'var(--space-xl)',
  },
  title: {
    fontSize: 'var(--font-2xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    marginBottom: 'var(--space-md)',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-sm)',
    flexWrap: 'wrap',
  },
  author: {
    color: 'var(--accent)',
    fontWeight: 600,
    fontSize: 'var(--font-sm)',
  },
  separator: {
    color: 'var(--text-muted)',
  },
  date: {
    color: 'var(--text-muted)',
    fontSize: 'var(--font-sm)',
  },
  actions: {
    display: 'flex',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-lg)',
  },
  editBtn: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-lg)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
  },
  deleteBtn: {
    backgroundColor: 'rgba(239, 83, 80, 0.1)',
    color: 'var(--danger)',
    border: '1px solid var(--danger)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-lg)',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
    cursor: 'pointer',
  },
  deleteBtnDisabled: {
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-lg)',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
    cursor: 'not-allowed',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    marginBottom: 'var(--space-2xl)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-md)',
  },
  paragraph: {
    fontSize: 'var(--font-md)',
    color: 'var(--text-primary)',
    lineHeight: 1.8,
  },
  message: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-lg)',
  },
  errorMessage: {
    color: 'var(--danger)',
    fontSize: 'var(--font-lg)',
  },
};

export default PostDetails;