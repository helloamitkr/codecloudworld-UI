import Link from 'next/link';
import styles from '../../styles/Blog.module.css';
import { getAllSlugs, getItemBySlug } from '../../lib/content-helpers';

export default function ProjectDetail({ project }) {
  if (!project) {
    return (
      <div className={styles.page}>
        <p>Project not found</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.postHeader}>
        <h1 className={styles.postTitle}>{project.title}</h1>
        <div className={styles.postMeta}>
          {project.difficulty} • {project.category}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {Array.isArray(project.stack) && project.stack.map((tech) => (
            <span 
              key={tech} 
              style={{ 
                background: '#f3f4f6', 
                padding: '0.25rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '0.875rem',
                color: '#374151'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: project.contentHtml }} />
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '2rem', 
        padding: '1rem', 
        background: '#f9fafb', 
        borderRadius: '8px' 
      }}>
        {project.github && (
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              background: '#374151',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            View on GitHub
          </a>
        )}
        {project.demo && (
          <a 
            href={project.demo} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              color: 'white',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            Live Demo
          </a>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/projects" className={styles.read}>← Back to projects</Link>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllSlugs('projects');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const project = await getItemBySlug('projects', params.slug);
  return {
    props: {
      project,
    },
  };
}
