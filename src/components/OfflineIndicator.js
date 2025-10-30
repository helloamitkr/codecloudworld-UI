import { useState, useEffect } from 'react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);

      const handleOnline = () => {
        setIsOnline(true);
        setShowOfflineMessage(false);
      };

      const handleOffline = () => {
        setIsOnline(false);
        setShowOfflineMessage(true);
      };

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  if (!showOfflineMessage && isOnline) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: isOnline ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '12px 16px',
      borderRadius: '8px',
      zIndex: 1000,
      fontSize: '14px',
      fontWeight: '500'
    }}>
      {isOnline ? 'Back online!' : 'You are offline'}
    </div>
  );
}
