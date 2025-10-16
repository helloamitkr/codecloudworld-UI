import { useState } from 'react';

export default function SubscribeForm({ compact = false }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  const inputBase = {
    flex: compact ? '0 1 260px' : '1 1 360px',
    minWidth: 220,
    padding: '0.6rem 0.8rem 0.6rem 2.2rem',
    borderRadius: 12,
    border: status === 'error' ? '1px solid #ef4444' : '1px solid #e5e7eb',
    outline: 'none',
    background: '#fff',
    position: 'relative',
    boxShadow: '0 1px 0 rgba(0,0,0,0.02)'
  };

  const formInner = (
    <form onSubmit={onSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ position: 'absolute', left: 10, color: '#6b7280' }}>
          <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-1.4 3L12 11 5.4 7h13.2zM4 18V8l8 5 8-5v10H4z" fill="currentColor" />
        </svg>
        <label htmlFor="subscribe-email" className="sr-only" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>Email address</label>
        <input
          id="subscribe-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          required
          onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.25)')}
          onBlur={(e) => (e.currentTarget.style.boxShadow = '0 1px 0 rgba(0,0,0,0.02)')}
          style={inputBase}
        />
      </div>
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          padding: '0.6rem 0.9rem',
          borderRadius: 12,
          border: '1px solid #93c5fd',
          background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
          color: '#fff',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 8px 16px rgba(59,130,246,0.25)'
        }}
        aria-live="polite"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
        </svg>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {status === 'success' && (
        <span style={{ color: '#16a34a' }} role="status">Subscribed! Check your inbox.</span>
      )}
      {status === 'error' && (
        <span style={{ color: '#ef4444' }} role="alert">Enter a valid email.</span>
      )}
    </form>
  );

  if (compact) {
    return formInner;
  }

  return (
    <section style={{
      border: '1px solid #93c5fd',
      background: '#eff6ff',
      borderRadius: 14,
      padding: '1rem',
    }}>
      <h3 style={{ margin: 0, marginBottom: 6 }}>Get new lessons and posts in your inbox</h3>
      <p style={{ margin: 0, marginBottom: 10, color: '#475569' }}>No spam. Unsubscribe anytime.</p>
      {formInner}
    </section>
  );
}
