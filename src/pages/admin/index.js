import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../../styles/Admin.module.css';
import { getContentStats } from '../../lib/content-helpers';
import AdminAuth from '../../components/AdminAuth';

export default function AdminDashboard({ stats }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <AdminAuth>
      <div className={styles.container}>
      <div className={styles.header}>
        <h1>🚀 Admin Dashboard</h1>
        <p>Create and manage your content</p>
      </div>

      <div className={styles.dashboard}>
        <div className={styles.statsGrid}>
          {Object.entries(stats).map(([type, data]) => (
            <div key={type} className={styles.statCard}>
              <h3 className={styles.statTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              <div className={styles.statNumbers}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{data.total}</span>
                  <span className={styles.statLabel}>Total</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{data.published}</span>
                  <span className={styles.statLabel}>Published</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{data.featured}</span>
                  <span className={styles.statLabel}>Featured</span>
                </div>
                {data.drafts > 0 && (
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{data.drafts}</span>
                    <span className={styles.statLabel}>Drafts</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Primary Actions */}
        <div className={styles.primaryActions}>
          <Link href="/admin/blog-builder" className={styles.primaryCard}>
            <div className={styles.primaryIcon}>✍️</div>
            <div className={styles.primaryContent}>
              <h3>Create Blog Post</h3>
              <p>Write and publish new blog content</p>
            </div>
            <div className={styles.primaryArrow}>→</div>
          </Link>

          <Link href="/admin/course-builder" className={styles.primaryCard}>
            <div className={styles.primaryIcon}>🎓</div>
            <div className={styles.primaryContent}>
              <h3>Create Course</h3>
              <p>Build structured learning content</p>
            </div>
            <div className={styles.primaryArrow}>→</div>
          </Link>
        </div>

        {/* Management Tools */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>📊 Management & Analytics</h2>
          <div className={styles.managementGrid}>
            <Link href="/admin/blog-dashboard" className={styles.managementCard}>
              <div className={styles.managementIcon}>📝</div>
              <h4>Blog Dashboard</h4>
              <p>Manage posts & analytics</p>
            </Link>

            <Link href="/admin/model-dashboard" className={styles.managementCard}>
              <div className={styles.managementIcon}>🎯</div>
              <h4>Course Dashboard</h4>
              <p>Track course progress</p>
            </Link>

            <Link href="/admin/create-content" className={styles.managementCard}>
              <div className={styles.managementIcon}>⚡</div>
              <h4>Quick Tools</h4>
              <p>Generate content files</p>
            </Link>

            <div className={styles.managementCard} style={{ opacity: 0.6 }}>
              <div className={styles.managementIcon}>⚙️</div>
              <h4>Settings</h4>
              <p>Site configuration</p>
              <span className={styles.badge}>Soon</span>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>🚀 Quick Access</h2>
          <div className={styles.quickAccessGrid}>
            <Link href="/blog" className={styles.quickAccessLink}>
              <span className={styles.quickIcon}>📖</span>
              <span>View Blog</span>
            </Link>
            <Link href="/courses" className={styles.quickAccessLink}>
              <span className={styles.quickIcon}>🎓</span>
              <span>View Courses</span>
            </Link>
            <Link href="/projects" className={styles.quickAccessLink}>
              <span className={styles.quickIcon}>💼</span>
              <span>View Projects</span>
            </Link>
            <Link href="/markdown-reference" className={styles.quickAccessLink}>
              <span className={styles.quickIcon}>📝</span>
              <span>Markdown Reference</span>
            </Link>
            <a 
              href="https://github.com/your-repo" 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.quickAccessLink}
            >
              <span className={styles.quickIcon}>🔗</span>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    </AdminAuth>
  );
}

export async function getStaticProps() {
  const stats = getContentStats();
  return {
    props: {
      stats,
    },
  };
}
