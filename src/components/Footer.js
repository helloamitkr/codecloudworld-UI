import styles from '../styles/Footer.module.css';
import Link from 'next/link';
import SubscribeForm from './SubscribeForm';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>CCW</div>
            <div>
              <h3 className={styles.title}>CodeCloudWorld</h3>
              <p className={styles.tagline}>Master questions. Ace interviews.</p>
            </div>
          </div>

          <nav className={styles.nav} aria-label="Footer Navigation">
            <ul className={styles.navList}>
              <li className={styles.navItem}><Link href="/courses" className={styles.navLink}>Courses</Link></li>
              <li className={styles.navItem}><Link href="/projects" className={styles.navLink}>Projects</Link></li>
              <li className={styles.navItem}><Link href="/interview" className={styles.navLink}>Interview</Link></li>
              <li className={styles.navItem}><Link href="/donate" className={styles.navLink}>Donate</Link></li>
              <li className={styles.navItem}><Link href="/contact" className={styles.navLink}>Contact</Link></li>
            </ul>
          </nav>

          <div className={styles.socials} aria-label="Social links">
            <a className={styles.socialBtn} href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true"><path fill="currentColor" d="M22 5.8c-.7.3-1.4.6-2.2.6.8-.5 1.3-1.2 1.6-2.1-.7.5-1.6.8-2.5 1-1.4-1.5-3.9-1.2-5 0-1.1 1.2-1.3 3.1-.3 4.5-2.7-.1-5.2-1.5-6.8-3.7-.9 1.6-.4 3.7 1.1 4.8-.6 0-1.2-.2-1.7-.5 0 1.7 1.2 3.3 2.9 3.6-.5.1-1 .2-1.5.1.4 1.5 1.9 2.6 3.5 2.6-1.3 1-2.9 1.5-4.5 1.5h-.8C5.6 20 7.6 20.6 9.7 20.6c6.6 0 10.2-5.7 10-10.7.7-.5 1.3-1.1 1.8-1.8z"/></svg>
            </a>
            <a className={styles.socialBtn} href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true"><path fill="currentColor" d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-2c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.2-1.4-1.2-1.4-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 .1.7 1.6 2.7 1.1.1-.8.4-1.3.7-1.6-2.2-.3-4.6-1.2-4.6-5.3 0-1.2.4-2.1 1.1-2.9-.1-.3-.5-1.5.1-3 0 0 .9-.3 3 1.1.9-.3 1.8-.4 2.7-.4s1.8.1 2.7.4c2.1-1.4 3-1.1 3-1.1.6 1.5.2 2.7.1 3 .7.8 1.1 1.7 1.1 2.9 0 4.1-2.4 5-4.6 5.3.4.3.8 1 .8 2v3c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z"/></svg>
            </a>
            <a className={styles.socialBtn} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true"><path fill="currentColor" d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 8h4V23h-4V8zm7.5 0h3.8v2.1h.1c.5-1 1.9-2.1 3.9-2.1 4.2 0 5 2.7 5 6.2V23h-4v-7.1c0-1.7 0-3.9-2.4-3.9-2.4 0-2.8 1.9-2.8 3.8V23h-4V8z"/></svg>
            </a>
          </div>
        </div>

        <div style={{ marginTop: '0.8rem' }}>
          <SubscribeForm compact />
        </div>

        <div className={styles.divider} />

        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} CodeCloudWorld. All rights reserved.</p>
          <div className={styles.smallNav}>
            <Link href="/privacy" className={styles.smallLink}>Privacy</Link>
            <span className={styles.dot} aria-hidden="true">•</span>
            <Link href="/terms" className={styles.smallLink}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
