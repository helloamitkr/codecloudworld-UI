import { useState } from 'react';
import Head from 'next/head';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', suggestion: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.suggestion.trim()) e.suggestion = 'Please add your suggestion';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSubmitted(true);
      setForm({ name: '', email: '', suggestion: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Contact • CodeCloudWorld</title>
        <meta name="description" content="Contact CodeCloudWorld or send suggestions." />
      </Head>
      <main style={{ maxWidth: 860, margin: '0 auto', padding: '1.25rem 1rem' }}>
        <header style={{ marginBottom: '1rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#111827' }}>Contact Us</h1>
            <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>Email: <a href="mailto:ask@codecloudworld.com">ask@codecloudworld.com</a></p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={iconBtn}>
              {icons.linkedin}
            </a>
            <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={iconBtn}>
              {icons.youtube}
            </a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={iconBtn}>
              {icons.github}
            </a>
            <a href="https://medium.com/" target="_blank" rel="noopener noreferrer" aria-label="Medium" style={iconBtn}>
              {icons.medium}
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" style={iconBtn}>
              {icons.whatsapp}
            </a>
          </div>
        </header>

        {submitted && (
          <div role="status" style={{
            border: '1px solid #bbf7d0',
            background: '#ecfdf5',
            color: '#065f46',
            padding: '0.6rem 0.8rem',
            borderRadius: 12,
            marginBottom: '0.9rem',
            fontWeight: 600,
          }}>
            Thanks for your suggestion!
          </div>
        )}

        <section style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, padding: '1rem', boxShadow: '0 10px 24px rgba(0,0,0,0.04)' }}>
          <h2 style={{ marginTop: 0, fontSize: '1.2rem', color: '#111827' }}>Suggestion form</h2>
          <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: '0.8rem' }}>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label htmlFor="name" style={labelStyle}>Name</label>
                <input id="name" name="name" value={form.name} onChange={onChange} placeholder="Your name" style={inputStyle(errors.name)} />
                {errors.name && <div style={errStyle}>{errors.name}</div>}
              </div>
              <div>
                <label htmlFor="email" style={labelStyle}>Email</label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="you@example.com" style={inputStyle(errors.email)} />
                {errors.email && <div style={errStyle}>{errors.email}</div>}
              </div>
            </div>
            <div>
              <label htmlFor="suggestion" style={labelStyle}>Suggestion</label>
              <textarea id="suggestion" name="suggestion" rows={6} value={form.suggestion} onChange={onChange} placeholder="Share your ideas or feedback..." style={{ ...inputStyle(errors.suggestion), resize: 'vertical' }} />
              {errors.suggestion && <div style={errStyle}>{errors.suggestion}</div>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" disabled={submitting} style={submitBtn(submitting)}>
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}

const iconBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 10,
  border: '1px solid #e5e7eb',
  color: '#111827',
  background: '#fff',
};

const labelStyle = {
  display: 'block',
  fontWeight: 600,
  color: '#111827',
  marginBottom: 6,
};

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '0.55rem 0.75rem',
  borderRadius: 10,
  border: `1px solid ${hasError ? '#fecaca' : '#e5e7eb'}`,
  outline: 'none',
  background: '#fff',
});

const errStyle = { color: '#b91c1c', fontSize: '0.85rem', marginTop: 4 };

const submitBtn = (disabled) => ({
  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
  color: '#fff',
  padding: '0.6rem 1rem',
  borderRadius: 12,
  border: '1px solid rgba(0,0,0,0.05)',
  fontWeight: 700,
  cursor: 'pointer',
  opacity: disabled ? 0.7 : 1,
});

const icons = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.025-3.036-1.85-3.036-1.853 0-2.136 1.447-2.136 2.942v5.663H9.353V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.604 0 4.269 2.372 4.269 5.455v6.286zM5.337 7.433a2.064 2.064 0 1 1 0-4.129 2.064 2.064 0 0 1 0 4.129zM7.119 20.452H3.554V9h3.565v11.452z"/></svg>
  ),
  youtube: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a2.999 2.999 0 0 0-2.113-2.12C19.561 3.5 12 3.5 12 3.5s-7.561 0-9.385.566A3 3 0 0 0 .502 6.186 31.152 31.152 0 0 0 0 12a31.152 31.152 0 0 0 .502 5.814 2.999 2.999 0 0 0 2.113 2.12C4.439 20.5 12 20.5 12 20.5s7.561 0 9.385-.566a2.999 2.999 0 0 0 2.113-2.12A31.152 31.152 0 0 0 24 12a31.152 31.152 0 0 0-.502-5.814zM9.75 15.5v-7l6 3.5-6 3.5z"/></svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.73.5.98 5.24.98 11.5c0 4.84 3.14 8.94 7.49 10.39.55.1.75-.24.75-.53 0-.26-.01-1.12-.02-2.03-3.05.66-3.7-1.3-3.7-1.3-.5-1.28-1.22-1.62-1.22-1.62-.99-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.9.1-.71.38-1.2.69-1.48-2.44-.28-5-1.22-5-5.44 0-1.2.43-2.19 1.13-2.97-.11-.28-.49-1.4.11-2.91 0 0 .93-.3 3.05 1.13A10.63 10.63 0 0 1 12 6.8c.94.01 1.89.13 2.77.38 2.12-1.43 3.05-1.13 3.05-1.13.6 1.51.22 2.63.11 2.91.71.78 1.13 1.77 1.13 2.97 0 4.23-2.57 5.16-5.01 5.43.39.34.73 1 .73 2.01 0 1.45-.01 2.62-.01 2.98 0 .29.19.64.75.53A10.52 10.52 0 0 0 23.02 11.5C23.02 5.24 18.27.5 12 .5z"/></svg>
  ),
  medium: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2 7.5c0-.3.1-.6.4-.8L4.8 4.5c.4-.3.9 0 .9.4v10.5l5.6-9.1c.2-.3.7-.3.8 0l6.2 10.1V5.1c0-.3.3-.6.6-.6h1.6c.3 0 .5.2.5.5v13.9c0 .3-.2.5-.5.5h-2.4c-.2 0-.4-.1-.5-.3l-6.2-10.2-6.4 10.3c-.1.2-.3.3-.5.3H2.6c-.3 0-.6-.3-.6-.6V7.5z"/></svg>
  ),
  whatsapp: (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12 0C5.37 0 .01 5.37.01 12c0 2.11.55 4.17 1.59 6.01L0 24l6.17-1.62A11.92 11.92 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 21.82c-1.88 0-3.71-.5-5.3-1.45l-.38-.22-3.66.96.98-3.56-.25-.41A9.8 9.8 0 0 1 2.18 12C2.18 6.57 6.57 2.18 12 2.18S21.82 6.57 21.82 12 17.43 21.82 12 21.82zm5.36-6.14c-.29-.15-1.7-.84-1.96-.94-.26-.1-.45-.15-.64.15-.19.29-.74.94-.91 1.14-.17.19-.34.22-.64.07-.29-.15-1.22-.45-2.33-1.42-.86-.77-1.44-1.72-1.61-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.5.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.15-.64-1.55-.88-2.13-.23-.56-.47-.49-.64-.5h-.55c-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43s1.02 2.82 1.16 3.01c.15.19 2.01 3.08 4.86 4.32.68.29 1.2.46 1.61.59.68.22 1.31.19 1.8.12.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34z"/></svg>
  ),
};
