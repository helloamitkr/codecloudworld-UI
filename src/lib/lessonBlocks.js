import React, { useState } from 'react';
import styles from '../styles/CourseDetail.module.css';

export function LessonBlocks({ blocks = [] }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const onCopy = async (code, index) => {
    try {
      await navigator.clipboard.writeText(code || '');
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className={styles.lessonPanelText}>
      {blocks.map((blk, i) => {
        if (!blk || !blk.type) return null;
        switch (blk.type) {
          case 'heading': {
            const L = Math.min(3, Math.max(1, Number(blk.level) || 2));
            if (L === 1) return <h1 key={i}>{blk.text}</h1>;
            if (L === 2) return <h2 key={i}>{blk.text}</h2>;
            return <h3 key={i}>{blk.text}</h3>;
          }
          case 'paragraph':
            return <p key={i}>{blk.text}</p>;
          case 'list':
            return blk.ordered ? (
              <ol key={i}>{(blk.items || []).map((it, idx) => <li key={idx}>{it}</li>)}</ol>
            ) : (
              <ul key={i}>{(blk.items || []).map((it, idx) => <li key={idx}>{it}</li>)}</ul>
            );
          case 'code': {
            const lang = blk.language ? String(blk.language).toLowerCase() : '';
            const isCopied = copiedIndex === i;
            return (
              <div key={i} className={styles.codeWrap}>
                <div className={styles.codeHeader}>
                  <span className={styles.codeLang}>{lang || 'code'}</span>
                  <button 
                    type="button" 
                    className={`${styles.copyBtn} ${isCopied ? styles.copied : ''}`}
                    onClick={() => onCopy(blk.code, i)} 
                    aria-label="Copy code"
                  >
                    {isCopied ? (
                      <>
                        <span className={styles.copyIcon}>✓</span>
                        Copied!
                      </>
                    ) : (
                      <>
                        <span className={styles.copyIcon}>📋</span>
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <pre className={styles.codePre}><code>{blk.code}</code></pre>
              </div>
            );
          }
          case 'quote':
            return <blockquote key={i}>{blk.text}</blockquote>;
          case 'image':
            return blk.src ? <img key={i} src={blk.src} alt={blk.alt || ''} /> : null;
          default:
            return null;
        }
      })}
    </div>
  );
}
