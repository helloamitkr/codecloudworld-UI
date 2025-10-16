import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/CourseDetail.module.css';
import { LessonBlocks } from '../../lib/lessonBlocks';

function mdToHtml(src = '') {
  let s = src;
  s = s.replace(/^###\s+(.+)$/gm, '<h3>$1<\/h3>');
  s = s.replace(/^##\s+(.+)$/gm, '<h2>$1<\/h2>');
  s = s.replace(/^#\s+(.+)$/gm, '<h1>$1<\/h1>');
  s = s.replace(/```([\s\S]*?)```/g, '<pre><code>$1<\/code><\/pre>');
  s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1<\/strong>');
  s = s.replace(/\*(.*?)\*/g, '<em>$1<\/em>');
  s = s.replace(/`([^`]+)`/g, '<code>$1<\/code>');
  s = s.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1<\/li>');
  s = s.replace(/(<li>.*<\/li>)(?![\s\S]*<li>)/g, '<ul>$1<\/ul>');
  s = s.replace(/\n{2,}/g, '</p><p>');
  s = `<p>${s}<\/p>`;
  return s;
}

export default function RightPanel({ activeLesson, unslugify, totalLessons, activeLessonObj, isCompleted, onToggleComplete, completedCount, onReset }) {
  const [steps, setSteps] = useState([]); // [{ text, done }]
  const [showSteps, setShowSteps] = useState(false);
  const storageKey = activeLesson ? `lesson-steps:${activeLesson}` : '';

  useEffect(() => {
    // Load saved checklist when lesson changes
    if (!storageKey) return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSteps(parsed.map((x) => ({ text: String(x.text || ''), done: !!x.done })).filter((x) => x.text));
          setShowSteps(false); // keep hidden by default
        }
      } else {
        setSteps([]);
        setShowSteps(false);
      }
    } catch {}
  }, [storageKey]);

  const saveSteps = (next) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}
  };
  const generateSteps = () => {
    // Toggle visibility: if currently shown, hide
    if (showSteps) {
      setShowSteps(false);
      return;
    }
    // If steps already exist, just show
    if (steps && steps.length > 0) {
      setShowSteps(true);
      return;
    }
    // Otherwise, derive steps from content
    const out = [];
    if (Array.isArray(activeLessonObj?.blocks)) {
      for (const b of activeLessonObj.blocks) {
        if (!b) continue;
        if (b.type === 'heading' && b.text) out.push(String(b.text));
        if (b.type === 'list' && Array.isArray(b.items)) out.push(...b.items.map(String));
      }
    } else if (activeLessonObj?.content) {
      const lines = String(activeLessonObj.content).split(/\n+/);
      for (const ln of lines) {
        const m = ln.match(/^\s*[-*]\s+(.+)/);
        if (m) out.push(m[1]);
      }
    }
    const deduped = out.map((s) => s.trim()).filter(Boolean).slice(0, 12);
    const next = deduped.map((t) => ({ text: t, done: false }));
    setSteps(next);
    saveSteps(next);
    setShowSteps(true);
  };

  const toggleStep = (idx) => {
    setSteps((prev) => {
      const next = prev.map((s, i) => (i === idx ? { ...s, done: !s.done } : s));
      saveSteps(next);
      return next;
    });
  };
  const pct = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
  return (
    <aside className={styles.right}>
      {activeLesson ? (
        <div className={styles.panel}>
          <div style={{ marginBottom: '0.6rem' }}>
            <div className={styles.stats}>
              <span className={styles.stat}>Progress: {completedCount}/{totalLessons}</span>
              <span className={styles.stat}>{pct}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 9999, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }} />
              </div>
              <button type="button" onClick={onReset} className={styles.actionButtonBlue} aria-label="Reset Progress">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 5V2L7 7l5 5V9a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
          <h3 className={styles.lessonPanelTitle}>{activeLessonObj?.title || unslugify(activeLesson)}</h3>
          {Array.isArray(activeLessonObj?.blocks) && activeLessonObj.blocks.length > 0 ? (
            <LessonBlocks blocks={activeLessonObj.blocks} />
          ) : (
            <div
              className={styles.lessonPanelText}
              dangerouslySetInnerHTML={{ __html: mdToHtml(activeLessonObj?.content || 'No content available for this lesson yet.') }}
            />
          )}
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onToggleComplete}
              className={styles.actionButtonGreen}
              aria-pressed={isCompleted}
            >
              {isCompleted ? '✓ Completed' : 'Mark as Completed'}
            </button>
            <button
              type="button"
              onClick={generateSteps}
              className={styles.actionButtonBlue}
              aria-expanded={showSteps}
            >
              {showSteps ? 'Hide Steps' : 'Generate Steps'}
            </button>
            <Link href="/ask" className={styles.actionButton} aria-label="Ask a question about this lesson">
              Ask
            </Link>
          </div>
          {showSteps && steps.length > 0 && (
            <div className={styles.lessonPanelText} style={{ marginTop: '0.5rem' }}>
              <h3>Checklist</h3>
              <ul className={styles.checklist}>
                {steps.map((s, i) => (
                  <li key={i} className={styles.checkItem}>
                    <label className={styles.checkLabel}>
                      <input
                        type="checkbox"
                        checked={!!s.done}
                        onChange={() => toggleStep(i)}
                      />
                      <span>{s.text}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.panel}>
          <div className={styles.stats}>
            <span className={styles.stat}>Lessons: {totalLessons}</span>
            <span className={styles.stat}>Completed: {completedCount}</span>
            <span className={styles.stat}>{pct}%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <div style={{ flex: 1, height: 8, background: '#e5e7eb', borderRadius: 9999, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }} />
            </div>
            <button type="button" onClick={onReset} className={styles.actionButtonBlue} aria-label="Reset Progress">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 5V2L7 7l5 5V9a5 5 0 1 1-5 5H5a7 7 0 1 0 7-7z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* Removed floating FAB; completion button now placed under content */}
    </aside>
  );
}
