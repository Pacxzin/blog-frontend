import { Post } from '@/types';

interface Props {
  post: Post;
}

function PostCard({ post }: Props) {

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  const bannerUrl = post.banner
    ? `http://localhost:3333/${post.banner}`
    : null;

  return (
    <div style={styles.card}>

      {/* Banner quadrado */}
      <div style={styles.bannerWrapper}>
        {bannerUrl ? (
          <img src={bannerUrl} alt={post.title} style={styles.banner} />
        ) : (
          <div style={styles.bannerPlaceholder}>
            <span style={styles.placeholderLetter}>
              {post.title[0].toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Corpo do card */}
      <div style={styles.body}>

        {/* Data */}
        <span style={styles.date}>{formatDate(post.created_at)}</span>

        {/* Titulo */}
        <h3 style={styles.title}>{post.title}</h3>

        {/* Preview */}
        <p style={styles.preview}>
          {post.content.length > 100
            ? post.content.substring(0, 100) + '...'
            : post.content}
        </p>

        {/* Autor */}
        <span style={styles.author}>{post.author_name}</span>

      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'border-color var(--transition)',
  },
  bannerWrapper: {
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  bannerPlaceholder: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, #f4a4a4 60%, #a4c4f4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderLetter: {
    fontSize: '4rem',
    fontWeight: 900,
    color: '#1a1a2e',
    fontFamily: 'serif',
  },
  body: {
    padding: 'var(--space-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-sm)',
  },
  date: {
    color: 'var(--text-muted)',
    fontSize: '0.7rem',
  },
  title: {
    fontSize: 'var(--font-sm)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.4,
  },
  preview: {
    fontSize: '0.75rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  author: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    fontWeight: 500,
    marginTop: 'var(--space-xs)',
  },
};

export default PostCard;