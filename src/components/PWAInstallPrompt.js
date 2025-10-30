import { useState, useEffect } from 'react';
import styles from '../styles/PWAInstallPrompt.module.css';

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
    
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Remember user dismissed (optional - could use localStorage)
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or user dismissed
  if (isInstalled || !showInstallPrompt) {
    return null;
  }

  // Check if user previously dismissed
  if (typeof window !== 'undefined' && localStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  return (
    <div className={styles.installPrompt}>
      <div className={styles.promptContent}>
        <div className={styles.promptIcon}>📱</div>
        <div className={styles.promptText}>
          <h3>Install CCW Learn</h3>
          <p>Get quick access to courses and learn offline!</p>
        </div>
        <div className={styles.promptActions}>
          <button 
            onClick={handleInstallClick}
            className={styles.installButton}
          >
            Install
          </button>
          <button 
            onClick={handleDismiss}
            className={styles.dismissButton}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
