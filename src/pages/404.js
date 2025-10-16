import Head from 'next/head';
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <>
      <Head>
        <title>404 • Page Not Found</title>
        <meta name="robots" content="noarchive" />
        <meta name="description" content="The page you are looking for does not exist." />
      </Head>
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: 2, background: 'linear-gradient(135deg, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>404</div>
          <h1 style={{ margin: '0.25rem 0 0.5rem', fontSize: '1.75rem' }}>Page not found</h1>
          <p style={{ color: '#475569', margin: 0 }}>The link may be broken, or the page may have been removed.</p>
        </div>

        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', marginTop: 20 }}>
          <Link href="/" style={linkBtnStyle}>Home</Link>
          <Link href="/courses" style={linkBtnStyle}>Courses</Link>
          <Link href="/blog" style={linkBtnStyle}>Blog</Link>
          <Link href="/donate" style={linkBtnStyle}>Donate</Link>
          <Link href="/about" style={linkBtnStyle}>About</Link>
          <Link href="/contact" style={linkBtnStyle}>Contact</Link>
        </div>
      </main>
    </>
  );
}

const linkBtnStyle = {
  textDecoration: 'none',
  textAlign: 'center',
  padding: '0.6rem 0.9rem',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#111',
};
