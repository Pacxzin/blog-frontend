import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPostById, updatePost } from '@/services/postService';
import { getCurrentUser } from '@/services/authService';
import api from '@/services/api';

function EditPost() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [title, setTitle]       = useState('');
  const [content, setContent]   = useState('');
  const [banner, setBanner]     = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState<string | null>(null);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const post        = await getPostById(Number(id));
        const currentUser = getCurrentUser();

        if (post.author_id !== currentUser?.id) {
          navigate('/');
          return;
        }

        setTitle(post.title);
        setContent(post.content);

        // Guarda o banner atual para mostrar preview
        if (post.banner) {
          setCurrentBanner(`http://localhost:3333/${post.banner}`);
        }

      } catch (err) {
        setError('Post nao encontrado');
      } finally {
        setFetching(false);
      }
    }

    fetchPost();
  }, [id]);

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setBanner(file);

    if (file) {
      // Preview local da nova imagem selecionada
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!title.trim() || !content.trim()) {
      setError('Titulo e conteudo sao obrigatorios');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Se tem nova imagem, usa FormData para enviar tudo junto
      if (banner) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('banner', banner);

        await api.put(`/posts/${id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        // Sem nova imagem, envia só texto normalmente
        await updatePost(Number(id), { title, content });
      }

      navigate(`/posts/${id}`);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao atualizar post';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div style={styles.centered}>
        <p style={styles.message}>Carregando post...</p>
      </div>
    );
  }

  // Qual imagem mostrar no preview:
  // 1. Nova imagem selecionada (preview local)
  // 2. Banner atual do post
  // 3. Nenhuma
  const displayImage = preview || currentBanner;

  return (
    <div style={styles.wrapper}>

      <div style={styles.header}>
        <Link to={`/posts/${id}`} style={styles.backLink}>← Voltar</Link>
        <h1 style={styles.title}>Editar Artigo</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* Titulo */}
        <div style={styles.field}>
          <label style={styles.label}>Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* Banner */}
        <div style={styles.field}>
          <label style={styles.label}>
            Imagem de Capa {currentBanner ? '(clique para trocar)' : '(opcional)'}
          </label>

          {/* Preview da imagem atual ou nova */}
          {displayImage && (
            <div style={styles.previewWrapper}>
              <img src={displayImage} alt="Preview" style={styles.previewImg} />
              {preview && (
                <span style={styles.newBadge}>Nova imagem</span>
              )}
            </div>
          )}

          <label style={styles.fileLabel}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleBannerChange}
              style={styles.fileInput}
            />
            {banner ? `✓ ${banner.name}` : currentBanner ? 'Trocar imagem' : 'Selecionar imagem'}
          </label>

          {/* Botao para remover nova selecao e voltar para a atual */}
          {banner && (
            <button
              type="button"
              onClick={() => { setBanner(null); setPreview(null); }}
              style={styles.removeBtn}
            >
              Cancelar troca — manter imagem atual
            </button>
          )}
        </div>

        {/* Conteudo */}
        <div style={styles.field}>
          <label style={styles.label}>Conteudo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
            rows={12}
            required
          />
        </div>

        <div style={styles.btnGroup}>
          <Link to={`/posts/${id}`} style={styles.cancelBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            style={loading ? styles.submitBtnDisabled : styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alteracoes'}
          </button>
        </div>

      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: 'var(--space-xl)',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '40vh',
  },
  header: {
    marginBottom: 'var(--space-xl)',
  },
  backLink: {
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    display: 'inline-block',
    marginBottom: 'var(--space-md)',
  },
  title: {
    fontSize: 'var(--font-2xl)',
    fontWeight: 700,
    color: 'var(--text-primary)',
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
    gap: 'var(--space-xl)',
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
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    color: 'var(--text-primary)',
    fontSize: 'var(--font-lg)',
    fontWeight: 600,
    outline: 'none',
  },
  textarea: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md)',
    color: 'var(--text-primary)',
    fontSize: 'var(--font-md)',
    lineHeight: 1.8,
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  previewWrapper: {
    width: '100%',
    height: '250px',
    borderRadius: 'var(--radius-md)',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    position: 'relative',
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  newBadge: {
    position: 'absolute',
    top: 'var(--space-sm)',
    right: 'var(--space-sm)',
    backgroundColor: 'var(--accent)',
    color: '#000',
    fontSize: '0.7rem',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: 'var(--radius-sm)',
  },
  fileLabel: {
    display: 'inline-block',
    backgroundColor: 'var(--bg-tertiary)',
    border: '1px dashed var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-md) var(--space-lg)',
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-sm)',
    cursor: 'pointer',
    textAlign: 'center',
  },
  fileInput: {
    display: 'none',
  },
  removeBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--danger)',
    fontSize: 'var(--font-sm)',
    cursor: 'pointer',
    textAlign: 'left',
    padding: 0,
  },
  btnGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 'var(--space-md)',
    marginTop: 'var(--space-md)',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border)',
    color: 'var(--text-secondary)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-xl)',
    textDecoration: 'none',
    fontSize: 'var(--font-sm)',
    fontWeight: 600,
  },
  submitBtn: {
    backgroundColor: 'var(--accent)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-xl)',
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    cursor: 'pointer',
  },
  submitBtnDisabled: {
    backgroundColor: 'var(--text-muted)',
    color: '#000',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--space-sm) var(--space-xl)',
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    cursor: 'not-allowed',
  },
  message: {
    color: 'var(--text-secondary)',
    fontSize: 'var(--font-lg)',
  },
};

export default EditPost;