import Head from 'next/head';
import Link from 'next/link';

export default function DonatePage() {
  return (
    <>
      <Head>
        <title>Donate • CodeCloudWorld</title>
        <meta name="description" content="Support CodeCloudWorld to help us create more high-quality problem-solving content." />
      </Head>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
        <h1 style={{ marginTop: 0 }}>Support CodeCloudWorld</h1>
        <p>
          Your support helps us create and maintain high-quality courses, practice problems, and interview guides.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          <a href="#upi" style={{ textDecoration: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.5rem 0.8rem', background: '#fff', color: '#111' }}>UPI</a>
          <a href="#paypal" style={{ textDecoration: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.5rem 0.8rem', background: '#fff', color: '#111' }}>PayPal</a>
          <a href="#stripe" style={{ textDecoration: 'none', border: '1px solid #e5e7eb', borderRadius: 10, padding: '0.5rem 0.8rem', background: '#fff', color: '#111' }}>Card</a>
        </div>
        <p style={{ color: '#6b6b6b', marginTop: 16 }}>
          Prefer another method? <Link href="/contact">Contact us</Link>
        </p>
      </main>
    </>
  );
}
