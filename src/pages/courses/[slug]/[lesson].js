import { useRouter } from 'next/router';
import Link from 'next/link';

function unslugify(seg = '') {
  return seg
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function LessonPage() {
  const router = useRouter();
  const { slug, lesson } = router.query;

  const courseTitle = slug ? unslugify(slug) : '';
  const lessonTitle = lesson ? unslugify(lesson) : '';

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '1rem' }}>
      <nav style={{ marginBottom: '0.75rem', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <Link href="/courses" style={{ color: '#9ca3af', textDecoration: 'none' }}>Courses</Link>
        <span style={{ color: '#6b7280' }}>/</span>
        {slug ? (
          <Link href={`/courses/${slug}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>{courseTitle}</Link>
        ) : (
          <span style={{ color: '#9ca3af' }}>{courseTitle || '...'}</span>
        )}
        <span style={{ color: '#6b7280' }}>/</span>
        <span style={{ color: '#e5e7eb' }}>{lessonTitle || 'Lesson'}</span>
      </nav>

      <h1 style={{ marginTop: 0 }}>{lessonTitle || 'Loading...'}</h1>
      <p style={{ color: '#9ca3af' }}>Course: {courseTitle || '...'}</p>

      <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '0.9rem 1rem' }}>
        <p style={{ color: '#c9cdd3', margin: 0 }}>
          This is a placeholder lesson page. Add your lesson content, code examples, and practice links here.
        </p>
      </div>

      <div style={{ marginTop: 12 }}>
        <Link href={`/courses/${slug || ''}`} style={{ color: '#d1d5db', textDecoration: 'none', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.35rem 0.6rem', borderRadius: 8 }}>← Back to course</Link>
      </div>
    </div>
  );
}
