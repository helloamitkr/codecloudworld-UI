import { useState, useMemo } from 'react';
import Link from 'next/link';
import styles from '../styles/Interview.module.css';

const LANGS = ['JavaScript', 'Python', 'Java', 'C++'];

const QUESTIONS = [
  { id: 'js-1', lang: 'JavaScript', title: 'Debounce vs Throttle', difficulty: 'Easy' },
  { id: 'js-2', lang: 'JavaScript', title: 'Event Loop and Microtasks', difficulty: 'Medium' },
  { id: 'py-1', lang: 'Python', title: 'List vs Tuple vs Dict', difficulty: 'Easy' },
  { id: 'py-2', lang: 'Python', title: 'Generators and Iterators', difficulty: 'Medium' },
  { id: 'java-1', lang: 'Java', title: 'Collections Framework Basics', difficulty: 'Easy' },
  { id: 'java-2', lang: 'Java', title: 'ConcurrentHashMap Internals', difficulty: 'Hard' },
  { id: 'cpp-1', lang: 'C++', title: 'Pointers and References', difficulty: 'Easy' },
  { id: 'cpp-2', lang: 'C++', title: 'Move Semantics and Rvalue', difficulty: 'Hard' },
];

export default function InterviewPage() {
  const [active, setActive] = useState('JavaScript');

  const list = useMemo(
    () => QUESTIONS.filter((q) => q.lang === active),
    [active]
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Interview Questions</h1>
        <div className={styles.filters}>
          {LANGS.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`${styles.filterBtn} ${active === lang ? styles.filterBtnActive : ''}`}
              onClick={() => setActive(lang)}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.list}>
        {list.map((q) => (
          <article key={q.id} className={styles.item}>
            <h3 className={styles.qTitle}>{q.title}</h3>
            <div className={styles.qMeta}>{q.lang} • {q.difficulty}</div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Link href="/practice" className={styles.filterBtn}>Go to Practice →</Link>
      </div>
    </div>
  );
}
