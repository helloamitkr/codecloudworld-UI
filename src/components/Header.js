import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import DarkModeToggle from './DarkModeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const isActive = (href) => {
    const p = router.pathname || '';
    if (href === '/') return p === '/';
    return p === href || p.startsWith(href + '/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand} onClick={closeMenu}>
            <div className={styles.logo}>CCW</div>
          </Link>
        </div>

        <button
          type="button"
          className={styles.menuButton}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg className={styles.menuIcon} viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
          </svg>
        </button>

        <div id="primary-nav" className={`${styles.right} ${menuOpen ? styles.open : ''}`}>
          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link
                  href="/courses"
                  className={`${styles.navLink} ${isActive('/courses') ? styles.active : ''}`}
                  onClick={closeMenu}
                  aria-current={isActive('/courses') ? 'page' : undefined}
                >
                  Courses
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/projects"
                  className={`${styles.navLink} ${isActive('/projects') ? styles.active : ''}`}
                  onClick={closeMenu}
                  aria-current={isActive('/projects') ? 'page' : undefined}
                >
                  Projects
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/interview"
                  className={`${styles.navLink} ${isActive('/interview') ? styles.active : ''}`}
                  onClick={closeMenu}
                  aria-current={isActive('/interview') ? 'page' : undefined}
                >
                  Interview
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  href="/contact"
                  className={`${styles.navLink} ${isActive('/contact') ? styles.active : ''}`}
                  onClick={closeMenu}
                  aria-current={isActive('/contact') ? 'page' : undefined}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <DarkModeToggle />
            <Link href="/about" className={styles.cta} onClick={closeMenu}>About Author</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
