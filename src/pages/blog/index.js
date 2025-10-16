import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import blogs from '../../data/blogs.json';
import SubscribeForm from '../../components/SubscribeForm';

export default function BlogIndex() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <p className={styles.subtitle}>Guides on patterns, problem-solving, and interviews</p>
      </header>

      <div style={{ marginBottom: '1rem' }}>
        <SubscribeForm />
      </div>

      <div className={styles.list}>
        {blogs.map((b) => (
          <Link key={b.slug} href={`/blog/${b.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article className={styles.card}>
              <div className={styles.thumb} />
              <div>
                <h3 className={styles.cardTitle}>{b.title}</h3>
                <div className={styles.meta}>{b.date} • {b.read}</div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
