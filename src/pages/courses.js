import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../styles/Courses.module.css';
import courses from '../data/courses.json';

export default function CoursesPage() {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((c) => {
      const hay = [c.title, c.level, c.tag, String(c.lessons?.length || 0)]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q]);
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Courses</h1>
        <p className={styles.subtitle}>Sharpen your problem-solving skills with curated tracks.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.8rem' }}>
        <div style={{ position: 'relative', flex: '1 1 auto' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', left: 10, top: 10, color: '#6b7280' }}>
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8L20 21.5 21.5 20 15.5 14zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" fill="currentColor"/>
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses by title, tag, or level"
            aria-label="Search courses"
            style={{
              width: '100%',
              padding: '0.55rem 0.7rem 0.55rem 2rem',
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {list.map((c) => (
          <article key={c.slug} className={styles.card}>
            <div className={styles.thumb} />
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{c.title}</h3>
              <div className={styles.meta}>{c.level} • {c.lessons?.length ?? 0} lessons</div>
              <div className={styles.actions}>
                <span className={styles.tag}>{c.tag}</span>
                <Link href={`/courses/${c.slug}`} className={styles.cta}>Start</Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
