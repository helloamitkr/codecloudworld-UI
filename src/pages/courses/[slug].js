import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/CourseDetail.module.css';
import { getAllSlugs, getItemBySlug } from '../../lib/content-helpers';

export default function CourseDetail({ course }) {
  const router = useRouter();
  const { lesson } = router.query;
  const [openDrawer, setOpenDrawer] = useState(false);
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [showResetModal, setShowResetModal] = useState(false);

  if (!course) {
    return (
      <div className={styles.page}>
        <p>Course not found</p>
      </div>
    );
  }

  // Create lessons - use actual lesson files if available, otherwise fall back to sections
  const lessons = course.lessons && Array.isArray(course.lessons) && course.lessons.length > 0 
    ? [
        // Add course overview as first lesson
        {
          id: 'overview',
          title: 'Course Overview',
          content: String(course.contentHtml || ''),
          lesson: 0
        },
        // Add actual lesson files with proper titles
        ...course.lessons.map((lessonData, index) => ({
          id: String(lessonData.slug || `lesson-${index + 1}`),
          title: String(lessonData.title || `Lesson ${lessonData.lesson || index + 1}`),
          content: String(lessonData.contentHtml || ''),
          lesson: Number(lessonData.lesson || index + 1),
          duration: String(lessonData.duration || '')
        }))
      ]
    : [
        // Fallback to sections for old course format
        { 
          id: 'overview', 
          title: 'Course Overview',
          content: `<div id="overview">${course.contentHtml.match(/<div id="overview">([\s\S]*?)<\/div>/)?.[1] || course.contentHtml}</div>`
        },
        { 
          id: 'learn', 
          title: 'What You\'ll Learn',
          content: `<div id="learn">${course.contentHtml.match(/<div id="learn">([\s\S]*?)<\/div>/)?.[1] || 'Learning objectives content'}</div>`
        },
        { 
          id: 'prerequisites', 
          title: 'Prerequisites',
          content: `<div id="prerequisites">${course.contentHtml.match(/<div id="prerequisites">([\s\S]*?)<\/div>/)?.[1] || 'Prerequisites content'}</div>`
        },
        { 
          id: 'outline', 
          title: 'Course Outline',
          content: `<div id="outline">${course.contentHtml.match(/<div id="outline">([\s\S]*?)<\/div>/)?.[1] || 'Course outline content'}</div>`
        },
        { 
          id: 'getting-started', 
          title: 'Getting Started',
          content: `<div id="getting-started">${course.contentHtml.match(/<div id="getting-started">([\s\S]*?)<\/div>/)?.[1] || 'Getting started content'}</div>`
        }
      ];

  const currentLessonIndex = lesson ? lessons.findIndex(l => l.id === lesson) : 0;
  const currentLesson = lessons[currentLessonIndex] || lessons[0];
  const totalLessons = lessons.length;
  const completedCount = completedLessons.size;
  const progress = Math.min(100, Math.max(0, (completedCount / totalLessons) * 100));

  // Load completed lessons from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`course-progress-${course.slug}`);
      if (saved) {
        setCompletedLessons(new Set(JSON.parse(saved)));
      }
    }
  }, [course.slug]);

  // Save completed lessons to localStorage
  const saveProgress = (newCompleted) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`course-progress-${course.slug}`, JSON.stringify([...newCompleted]));
    }
  };

  // Reset course progress
  const resetProgress = () => {
    setShowResetModal(true);
  };

  const confirmReset = () => {
    setCompletedLessons(new Set());
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`course-progress-${course.slug}`);
    }
    setShowResetModal(false);
  };

  const cancelReset = () => {
    setShowResetModal(false);
  };

  // Handle keyboard events for modal
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showResetModal) {
        cancelReset();
      }
    };

    if (showResetModal) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showResetModal]);

  // Add copy functionality to code blocks
  useEffect(() => {
    const addCopyButtons = () => {
      // Try multiple selectors to find code blocks
      const selectors = [
        '.lessonContent pre',
        '.lessonPanelText pre', 
        'pre',
        '.lessonContent code',
        '.lessonPanelText code'
      ];
      
      let codeBlocks = [];
      selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          if (el.tagName === 'PRE' || (el.tagName === 'CODE' && el.parentElement.tagName !== 'PRE')) {
            codeBlocks.push(el);
          }
        });
      });
      
      console.log('Found code blocks:', codeBlocks.length);
      
      codeBlocks.forEach((element, index) => {
        let targetElement = element;
        
        // If it's a code element without pre parent, wrap it
        if (element.tagName === 'CODE' && element.parentElement.tagName !== 'PRE') {
          const pre = document.createElement('pre');
          element.parentNode.insertBefore(pre, element);
          pre.appendChild(element);
          targetElement = pre;
        }
        
        // Skip if already has copy button
        if (targetElement.querySelector('.copy-btn-custom')) return;
        
        // Create copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn-custom';
        copyBtn.innerHTML = '📋 Copy';
        copyBtn.style.cssText = `
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #111827 !important;
          color: #e5e7eb !important;
          border: 1px solid #374151 !important;
          border-radius: 6px !important;
          padding: 0.25rem 0.5rem !important;
          font-size: 0.75rem !important;
          cursor: pointer !important;
          z-index: 1000 !important;
          display: flex !important;
          align-items: center !important;
          gap: 0.25rem !important;
          transition: all 0.2s ease !important;
          font-family: system-ui, -apple-system, sans-serif !important;
        `;
        
        // Ensure target has relative positioning and styling
        targetElement.style.position = 'relative';
        targetElement.style.paddingTop = '2.5rem';
        targetElement.style.background = '#0a0f1a';
        targetElement.style.color = '#e5e7eb';
        targetElement.style.padding = '2.5rem 1rem 1rem 1rem';
        targetElement.style.borderRadius = '8px';
        targetElement.style.margin = '1rem 0';
        targetElement.style.fontFamily = 'Monaco, Menlo, Ubuntu Mono, monospace';
        
        // Add click handler
        copyBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            const codeText = targetElement.textContent || '';
            await navigator.clipboard.writeText(codeText.trim());
            copyBtn.innerHTML = '✓ Copied!';
            copyBtn.style.background = '#065f46 !important';
            copyBtn.style.borderColor = '#10b981 !important';
            copyBtn.style.color = '#d1fae5 !important';
            
            setTimeout(() => {
              copyBtn.innerHTML = '📋 Copy';
              copyBtn.style.background = '#111827 !important';
              copyBtn.style.borderColor = '#374151 !important';
              copyBtn.style.color = '#e5e7eb !important';
            }, 2000);
          } catch (error) {
            console.error('Failed to copy:', error);
            copyBtn.innerHTML = '❌ Failed';
            setTimeout(() => {
              copyBtn.innerHTML = '📋 Copy';
            }, 2000);
          }
        });
        
        targetElement.appendChild(copyBtn);
        console.log('Added copy button to:', targetElement);
      });
    };

    // Add copy buttons after content loads with multiple attempts
    const timer1 = setTimeout(addCopyButtons, 100);
    const timer2 = setTimeout(addCopyButtons, 500);
    const timer3 = setTimeout(addCopyButtons, 1000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentLesson]);

  const toggleLessonComplete = (lessonId) => {
    const newCompleted = new Set(completedLessons);
    if (newCompleted.has(lessonId)) {
      newCompleted.delete(lessonId);
    } else {
      newCompleted.add(lessonId);
    }
    setCompletedLessons(newCompleted);
    saveProgress(newCompleted);
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      const nextLesson = lessons[currentLessonIndex + 1];
      router.push(`/courses/${course.slug}?lesson=${nextLesson.id}`, undefined, { shallow: true });
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = lessons[currentLessonIndex - 1];
      router.push(`/courses/${course.slug}?lesson=${prevLesson.id}`, undefined, { shallow: true });
    }
  };

  const goToLesson = (lessonId) => {
    router.push(`/courses/${course.slug}?lesson=${lessonId}`, undefined, { shallow: true });
    setOpenDrawer(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>{course.title}</h1>
          <span className={styles.subtle}>CodeCloudWorld • Course</span>
        </div>
        <button
          type="button"
          className={`${styles.mobileToggle} ${styles.mobileOnly}`}
          onClick={() => setOpenDrawer(true)}
          aria-label="Open course contents"
        >
          ☰ Contents
        </button>
      </div>

      {/* Progress Bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            {completedCount} of {totalLessons} lessons completed • Current: {currentLesson?.title || 'Loading...'}
          </span>
          <div className={styles.progressActions}>
            <span className={styles.progressPercent}>{Math.round(progress)}%</span>
            <button
              onClick={resetProgress}
              className={styles.resetButton}
              title="Reset course progress"
              aria-label="Reset course progress"
            >
              🔄
            </button>
          </div>
        </div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Mobile drawer */}
      {openDrawer && (
        <>
          <div className={styles.backdrop} onClick={() => setOpenDrawer(false)} />
          <div className={styles.drawer} role="dialog" aria-modal="true">
            <div className={styles.drawerInner}>
              <div className={styles.leftHeader}>
                <h2 className={styles.sectionTitle}>Course Content</h2>
                <button 
                  type="button" 
                  className={styles.mobileToggle} 
                  onClick={() => setOpenDrawer(false)}
                >
                  ✕
                </button>
              </div>
              <nav className={styles.left}>
                <ul className={styles.contentList}>
                  {lessons.map((lessonItem, idx) => (
                    <li key={lessonItem?.id || idx}>
                      <button
                        onClick={() => goToLesson(lessonItem?.id)}
                        className={`${styles.itemLink} ${currentLesson?.id === lessonItem?.id ? styles.active : ''} ${completedLessons.has(lessonItem?.id) ? styles.completed : ''}`}
                      >
                        <span className={`${styles.bullet} ${completedLessons.has(lessonItem?.id) ? styles.completedBullet : ''}`}>
                          {completedLessons.has(lessonItem?.id) ? '✓' : ''}
                        </span>
                        <span className={styles.lessonTitle}>{lessonItem?.title || 'Loading...'}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}

      <div className={styles.layout}>
        {/* Left Panel - Desktop Only */}
        <div className={styles.desktopOnly}>
          <nav className={styles.left}>
            <div className={styles.leftHeader}>
              <h2 className={styles.sectionTitle}>Course Content</h2>
            </div>
            <ul className={styles.contentList}>
              {lessons.map((lessonItem, idx) => (
                <li key={lessonItem?.id || idx}>
                  <button
                    onClick={() => goToLesson(lessonItem?.id)}
                    className={`${styles.itemLink} ${currentLesson?.id === lessonItem?.id ? styles.active : ''} ${completedLessons.has(lessonItem?.id) ? styles.completed : ''}`}
                  >
                    <span className={`${styles.bullet} ${completedLessons.has(lessonItem?.id) ? styles.completedBullet : ''}`}>
                      {completedLessons.has(lessonItem?.id) ? '✓' : ''}
                    </span>
                    <span className={styles.lessonTitle}>{lessonItem?.title || 'Loading...'}</span>
                  </button>
                </li>
              ))}
            </ul>
            
            <div className={styles.courseInfo}>
              <div className={styles.infoItem}>
                <strong>Level:</strong> {course.level}
              </div>
              <div className={styles.infoItem}>
                <strong>Duration:</strong> {course.duration}
              </div>
              <div className={styles.infoItem}>
                <strong>Lessons:</strong> {Array.isArray(course.lessons) ? course.lessons.length : course.lessons || 'N/A'}
              </div>
              {course.tag && (
                <div className={styles.infoItem}>
                  <strong>Technology:</strong> {course.tag}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Panel - Lesson Content */}
        <div className={styles.right}>
          <div className={`${styles.lessonContent} ${styles.lessonPanelText}`}>
            <div dangerouslySetInnerHTML={{ 
              __html: typeof currentLesson?.content === 'string' 
                ? currentLesson.content 
                : '<p>Loading lesson content...</p>' 
            }} />
          </div>
          
          {/* Lesson Navigation */}
          <div className={styles.lessonNavigation}>
            <div className={styles.navButtons}>
              <button
                onClick={goToPreviousLesson}
                disabled={currentLessonIndex === 0}
                className={`${styles.navButton} ${styles.prevButton}`}
              >
                ← Previous
              </button>
              
              <button
                onClick={() => toggleLessonComplete(currentLesson?.id)}
                className={`${styles.navButton} ${styles.completeButton} ${completedLessons.has(currentLesson?.id) ? styles.completed : ''}`}
              >
                {completedLessons.has(currentLesson?.id) ? '✓ Mark Incomplete' : 'Mark Complete'}
              </button>
              
              <button
                onClick={goToNextLesson}
                disabled={currentLessonIndex === totalLessons - 1}
                className={`${styles.navButton} ${styles.nextButton}`}
              >
                Next →
              </button>
            </div>
          </div>
          
          <div className={styles.courseActions}>
            <Link href="/courses" className={styles.backLink}>
              ← Back to courses
            </Link>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <>
          <div className={styles.modalBackdrop} onClick={cancelReset} />
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="reset-modal-title">
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h3 id="reset-modal-title" className={styles.modalTitle}>
                  🔄 Reset Course Progress
                </h3>
                <button
                  onClick={cancelReset}
                  className={styles.modalClose}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              <div className={styles.modalBody}>
                <p>Are you sure you want to reset your progress for this course?</p>
                <p className={styles.modalWarning}>
                  This will clear all completed lessons and cannot be undone.
                </p>
              </div>
              <div className={styles.modalFooter}>
                <button
                  onClick={cancelReset}
                  className={styles.modalButtonSecondary}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReset}
                  className={styles.modalButtonPrimary}
                >
                  Reset Progress
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllSlugs('courses');
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const course = await getItemBySlug('courses', params.slug);
  return {
    props: {
      course,
    },
  };
}
