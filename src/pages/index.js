import Link from 'next/link';
import styles from '../styles/HomeBlog.module.css';

const featured = {
  title: 'Announcing CodeCloudWorld Blogs',
  date: 'Oct 2025',
  read: '5 min read',
  excerpt: 'We are launching our new blog focused on question-solving strategies, patterns, and interview tips.',
  slug: 'announcing-codecloudworld-blogs',
};

const posts = [
  { title: 'Mastering Sliding Window', date: 'Oct 14, 2025', read: '7 min', slug: 'mastering-sliding-window' },
  { title: 'Two Pointers: 10 Must-Know Problems', date: 'Oct 12, 2025', read: '8 min', slug: 'two-pointers-top-10' },
  { title: 'Recursion vs Iteration in Practice', date: 'Oct 10, 2025', read: '6 min', slug: 'recursion-vs-iteration' },
  { title: 'Greedy or DP? Choosing Wisely', date: 'Oct 8, 2025', read: '9 min', slug: 'greedy-or-dp' },
  { title: 'Graph Traversals: Patterns That Stick', date: 'Oct 6, 2025', read: '10 min', slug: 'graph-traversal-patterns' },
];

export default function Home() {
  return (
    <div className={styles.page}>
      <section>
        <h2 className={styles.sectionTitle}>New Blog</h2>
        <article className={styles.featured}>
          <div className={styles.featuredThumb} />
          <div className={styles.featuredBody}>
            <h3 className={styles.featuredTitle}>{featured.title}</h3>
            <div className={styles.featuredMeta}>{featured.date} • {featured.read}</div>
            <p className={styles.featuredExcerpt}>{featured.excerpt}</p>
            <div style={{ marginTop: '0.6rem' }}>
              <Link href={`/blog/${featured.slug}`} className={styles.readMore}>Read more</Link>
            </div>
          </div>
        </article>
      </section>

      <section className={styles.listSection}>
        <h2 className={styles.sectionTitle}>Latest posts</h2>
        <div className={styles.list}>
          {posts.map((p) => (
            <article key={p.slug} className={styles.item}>
              <div className={styles.itemThumb} />
              <div>
                <h4 className={styles.itemTitle}>{p.title}</h4>
                <div className={styles.itemMeta}>{p.date} • {p.read}</div>
              </div>
              <Link href={`/blog/${p.slug}`} className={styles.readMore}>Read</Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
