import { useState, useEffect } from 'react';
import styles from '../styles/DarkModeToggle.module.css';

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Save preference
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button className={styles.toggle} aria-label="Toggle theme">
        <span className={styles.icon}>🌙</span>
      </button>
    );
  }

  return (
    <button 
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className={`${styles.icon} ${isDark ? styles.dark : styles.light}`}>
        {isDark ? '☀️' : '🌙'}
      </span>
      <span className={styles.text}>
        {isDark ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
