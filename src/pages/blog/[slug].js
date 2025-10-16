import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import blogs from '../../data/blogs.json';
import SubscribeForm from '../../components/SubscribeForm';
import Error from 'next/error';

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const post = blogs.find((b) => b.slug === slug);

  // If the slug is present but not found in data, show 404
  if (slug && !post) {
    return <Error statusCode={404} />;
  }

  // Initial client-side navigation state
  if (!post) {
    return (
      <div className={styles.page}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        <div className={styles.postMeta}>{post.date} • {post.read}</div>
      </header>

      <div className={styles.content}>
        {post.content}
      </div>

      <div className={styles.subscribeBox}>
        <h3 style={{ marginTop: 0, marginBottom: 8 }}>Get new posts in your inbox</h3>
        <SubscribeForm />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link href="/blog" className={styles.read}>← Back to blog</Link>
      </div>
    </div>
  );
}
