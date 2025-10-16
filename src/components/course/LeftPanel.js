import Link from 'next/link';
import styles from '../../styles/CourseDetail.module.css';

export default function LeftPanel({ slug, lessons, activeLesson, toSlug, onSelect, completedSet }) {
  return (
    <section className={styles.left}>
      <div className={styles.leftHeader}>
        <h2 className={styles.sectionTitle}>Course Content</h2>
      </div>
      <ul className={styles.contentList}>
        {lessons.map((lesson, idx) => {
          const title = lesson.title || String(lesson);
          const ls = toSlug(title);
          return (
            <li key={idx}>
              <Link
                href={{ pathname: `/courses/${slug || ''}`, query: { lesson: ls } }}
                shallow
                className={`${styles.itemLink} ${completedSet && completedSet.has(ls) ? styles.completed : ''}`}
                aria-current={activeLesson === ls ? 'true' : undefined}
                onClick={onSelect}
              >
                <span className={styles.bullet} />
                <span className={styles.lessonTitle}>{idx + 1}. {title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
