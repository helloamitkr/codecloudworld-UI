import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AskPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    topic: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.whatsapp.trim()) e.whatsapp = 'WhatsApp number is required';
    if (!form.topic.trim()) e.topic = 'Topic is required';
    if (!form.description.trim()) e.description = 'Please describe your question';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      // Placeholder submit. Integrate API here if needed.
      await new Promise((res) => setTimeout(res, 800));
      setSubmitted(true);
      setForm({ name: '', email: '', whatsapp: '', topic: '', description: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Ask a Question • CodeCloudWorld</title>
        <meta name="description" content="Ask a question about our courses or projects." />
      </Head>
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '1.25rem 1rem' }}>
        <header style={{ marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.6rem', color: '#111827' }}>Ask a Question</h1>
          <p style={{ margin: '0.35rem 0 0', color: '#6b7280' }}>
            Have a doubt about a lesson or project? Send it here and I’ll get back to you.
          </p>
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
            Thanks! Your question has been recorded.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: 14,
          padding: '1rem',
          display: 'grid',
          gap: '0.8rem',
          boxShadow: '0 10px 24px rgba(0,0,0,0.04)'
        }}>
          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label htmlFor="name" style={labelStyle}>Name</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                placeholder="Your full name"
                style={inputStyle(errors.name)}
              />
              {errors.name && <div style={errStyle}>{errors.name}</div>}
            </div>
            <div>
              <label htmlFor="email" style={labelStyle}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                style={inputStyle(errors.email)}
              />
              {errors.email && <div style={errStyle}>{errors.email}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <label htmlFor="whatsapp" style={labelStyle}>WhatsApp Number</label>
              <input
                id="whatsapp"
                name="whatsapp"
                inputMode="tel"
                value={form.whatsapp}
                onChange={onChange}
                placeholder="e.g. +91 98765 43210"
                style={inputStyle(errors.whatsapp)}
              />
              {errors.whatsapp && <div style={errStyle}>{errors.whatsapp}</div>}
            </div>
            <div>
              <label htmlFor="topic" style={labelStyle}>Topic</label>
              <input
                id="topic"
                name="topic"
                value={form.topic}
                onChange={onChange}
                placeholder="Lesson name, project, or subject"
                style={inputStyle(errors.topic)}
              />
              {errors.topic && <div style={errStyle}>{errors.topic}</div>}
            </div>
          </div>

          <div>
            <label htmlFor="description" style={labelStyle}>Description</label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={form.description}
              onChange={onChange}
              placeholder="Describe your question with enough context..."
              style={{ ...inputStyle(errors.description), resize: 'vertical' }}
            />
            {errors.description && <div style={errStyle}>{errors.description}</div>}
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
            <Link href="/" style={linkBtnStyle}>← Back to home</Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#fff',
                padding: '0.6rem 1rem',
                borderRadius: 12,
                border: '1px solid rgba(0,0,0,0.05)',
                fontWeight: 700,
                cursor: 'pointer',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

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

const errStyle = {
  color: '#b91c1c',
  fontSize: '0.85rem',
  marginTop: 4,
};

const linkBtnStyle = {
  textDecoration: 'none',
  textAlign: 'center',
  padding: '0.5rem 0.75rem',
  borderRadius: 12,
  border: '1px solid #e5e7eb',
  background: '#fff',
  color: '#111',
};
