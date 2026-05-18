import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '@/services/postService';

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle]     = useState('');
  const [content, setContent] = useState('');
  const [banner, setBanner]   = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleBannerChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setBanner(file);

    if (file) {
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
      const post = await createPost({ title, content, banner });
      navigate(`/posts/${post.id}`);
    } catch (err: any) {
      const message = err.response?.data?.error || 'Erro ao criar post';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>

      <div style={styles.header}>
        <Link to="/" style={styles.backLink}>← Voltar</Link>
        <h1 style={styles.title}>Criar Novo Artigo</h1>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.field}>
          <label style={styles.label}>Titulo</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o titulo do artigo"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Imagem de Capa (opcional)</label>

          {preview && (
            <div style={styles.previewWrapper}>
              <img src={preview} alt="Preview" style={styles.previewImg} />
            </div>
          )}

          <label style={styles.fileLabel}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleBannerChange}
              style={styles.fileInput}
            />
            {banner ? `✓ ${banner.name}` : 'Selecionar imagem'}
          </label>

          {banner && (
            <button
              type="button"
              onClick={() => { setBanner(null); setPreview(null); }}
              style={styles.removeBtn}
            >
              Remover imagem
            </button>
          )}
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Conteudo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva o conteudo do artigo..."
            style={styles.textarea}
            rows={12}
            required
          />
        </div>

        <div style={styles.btnGroup}>
          {/* Cancelar volta para home */}
          <Link to="/" style={styles.cancelBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            style={loading ? styles.submitBtnDisabled : styles.submitBtn}
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar Artigo'}
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
  },
  previewImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
};

export default CreatePost;