import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../../styles/CourseDetail.module.css';
import LeftPanel from '../../components/course/LeftPanel';
import RightPanel from '../../components/course/RightPanel';
import courses from '../../data/courses.json';

export default function CourseDetail() {
  const router = useRouter();
  const { slug, lesson } = router.query;

  const heading = (() => {
    if (!slug) return '';
    const c = courses.find((x) => x.slug === slug);
    return c?.title || slug
      .split('-')
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : ''))
      .join(' ');
  })();

  const lessonSlug = (title) =>
    title
      .toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const unslugify = (seg = '') =>
    seg
      .replace(/-/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (m) => m.toUpperCase());

  const course = slug ? courses.find((x) => x.slug === slug) : undefined;
  const lessons = course?.lessons || [];

  const activeLessonObj = lesson
    ? lessons.find((l) => lessonSlug(l.title) === lesson)
    : undefined;

  const [openDrawer, setOpenDrawer] = useState(false);
  const drawerRef = useRef(null);
  const [completedSet, setCompletedSet] = useState(new Set());
  const didInitRef = useRef(false);

  // Close on Esc key and trap focus within drawer when open
  useEffect(() => {
    if (!openDrawer) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpenDrawer(false);
      } else if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const items = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    const focusFirst = () => {
      if (!drawerRef.current) return;
      const focusable = drawerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable) focusable.focus();
    };

    document.addEventListener('keydown', onKeyDown, true);
    focusFirst();
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [openDrawer]);

  // If no lesson is selected, default to the first lesson once on initial mount
  useEffect(() => {
    if (!router.isReady || didInitRef.current) return;
    didInitRef.current = true;
    if (!slug) return;
    if (!lesson && lessons.length > 0) {
      const first = lessonSlug(lessons[0].title);
      router.replace(
        { pathname: router.pathname, query: { slug, lesson: first } },
        undefined,
        { shallow: true }
      );
    }
  }, [router.isReady]);

  // Close mobile drawer on any route change
  useEffect(() => {
    const handleRoute = () => setOpenDrawer(false);
    router.events.on('routeChangeStart', handleRoute);
    return () => router.events.off('routeChangeStart', handleRoute);
  }, [router.events]);

  // Load/save completed lessons from localStorage per course
  useEffect(() => {
    if (!slug) return;
    try {
      const raw = localStorage.getItem(`course-completed:${slug}`);
      if (raw) {
        const arr = JSON.parse(raw);
        setCompletedSet(new Set(Array.isArray(arr) ? arr : []));
      } else {
        setCompletedSet(new Set());
      }
    } catch {}
  }, [slug]);

  const saveCompleted = (nextSet) => {
    try {
      localStorage.setItem(`course-completed:${slug}`, JSON.stringify(Array.from(nextSet)));
    } catch {}
  };

  const currentLessonSlug = activeLessonObj ? lessonSlug(activeLessonObj.title) : (lesson || '');

  const toggleComplete = () => {
    if (!currentLessonSlug) return;
    setCompletedSet((prev) => {
      const next = new Set(prev);
      if (next.has(currentLessonSlug)) next.delete(currentLessonSlug); else next.add(currentLessonSlug);
      saveCompleted(next);
      return next;
    });
  };

  const completedCount = completedSet.size;

  const resetProgress = () => {
    setCompletedSet(new Set());
    try {
      localStorage.removeItem(`course-completed:${slug}`);
    } catch {}
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>{heading || 'Loading...'}</h1>
        <span className={styles.subtle}>CodeCloudWorld • Course</span>
        <button
          type="button"
          className={`${styles.mobileToggle} ${styles.mobileOnly}`}
          onClick={() => setOpenDrawer(true)}
          aria-label="Open course contents"
        >
          ☰ Contents
        </button>
      </div>

      {/* Mobile drawer */}
      {openDrawer && (
        <>
          <div className={styles.backdrop} onClick={() => setOpenDrawer(false)} />
          <div
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-contents-title"
          >
            <div className={styles.drawerInner} ref={drawerRef}>
              <div className={styles.leftHeader}>
                <h2 id="course-contents-title" className={styles.sectionTitle}>Course Content</h2>
                <button type="button" className={styles.mobileToggle} onClick={() => setOpenDrawer(false)} aria-label="Close contents">
                  ✕
                </button>
              </div>
              <LeftPanel
                slug={slug || ''}
                lessons={lessons}
                activeLesson={lesson}
                toSlug={lessonSlug}
                onSelect={() => setOpenDrawer(false)}
                completedSet={completedSet}
              />
            </div>
          </div>
        </>
      )}

      <div className={styles.layout}>
        <div className={styles.desktopOnly}>
          <LeftPanel
            slug={slug || ''}
            lessons={lessons}
            activeLesson={lesson}
            toSlug={lessonSlug}
            completedSet={completedSet}
          />
        </div>

        <RightPanel
          activeLesson={activeLessonObj ? lesson : ''}
          unslugify={(s) => activeLessonObj?.title || unslugify(s)}
          totalLessons={lessons.length}
          activeLessonObj={activeLessonObj}
          isCompleted={currentLessonSlug ? completedSet.has(currentLessonSlug) : false}
          onToggleComplete={toggleComplete}
          completedCount={completedCount}
          onReset={resetProgress}
        />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = (courses || []).map((c) => ({ params: { slug: c.slug } }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { slug } = params || {};
  const exists = (courses || []).some((c) => c.slug === slug);
  if (!exists) return { notFound: true };
  return { props: {} };
}
