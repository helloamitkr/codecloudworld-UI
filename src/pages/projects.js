import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from '../styles/Courses.module.css';
import { getAllItems } from '../lib/content-helpers';

export default function ProjectsPage({ projects }) {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return projects;
    return projects.filter((p) => {
      const hay = [p.title, p.description, Array.isArray(p.stack) ? p.stack.join(' ') : '']
        .join(' ') 
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q]);
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <p className={styles.subtitle}>Curated practical projects with stack, code and live demos.</p>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '0.8rem' }}>
        <div style={{ position: 'relative', flex: '1 1 auto' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', left: 10, top: 10, color: '#6b7280' }}>
            <path d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8L20 21.5 21.5 20 15.5 14zm-6 0A4.5 4.5 0 1 1 14 9.5 4.49 4.49 0 0 1 9.5 14z" fill="currentColor"/>
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects by title, stack, or description"
            aria-label="Search projects"
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

      <div className={styles.grid} style={{ gridTemplateColumns: '1fr' }}>
        {list.map((p) => (
          <article key={p.slug} className={styles.card}>
            <div className={styles.thumb} />
            <div className={styles.body}>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <div className={styles.meta}>{Array.isArray(p.stack) ? p.stack.join(' • ') : ''}</div>
              <p style={{ margin: '0.35rem 0 0.6rem', color: '#444' }}>{p.description}</p>
              <div className={styles.actions}>
                <span className={styles.tag}>{p.difficulty || 'Project'}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Link href={`/projects/${p.slug}`} className={styles.cta}>View</Link>
                  {p.github && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className={styles.cta}>GitHub</a>
                  )}
                  {p.demo && (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer" className={styles.cta} style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }}>Demo</a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const projects = getAllItems('projects');
  return {
    props: {
      projects,
    },
  };
}
