import '../styles/globals.css';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import OfflineIndicator from '../components/OfflineIndicator';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content={process.env.NEXT_PUBLIC_PWA_SHORT_NAME || "CCW Learn"} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content={process.env.NEXT_PUBLIC_PWA_SHORT_NAME || "CCW Learn"} />
        <meta name="description" content={process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "Interactive learning platform for programming courses and tutorials"} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content={process.env.NEXT_PUBLIC_PWA_THEME_COLOR || "#3b82f6"} />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content={process.env.NEXT_PUBLIC_PWA_THEME_COLOR || "#3b82f6"} />

        {/* Manifest */}
        <link rel="manifest" href="/api/manifest" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Viewport */}
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </Head>
      
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: '20px', flex: 1 }}>
          <Component {...pageProps} />
        </main>
        <Footer />
        <PWAInstallPrompt />
        <OfflineIndicator />
      </div>
    </>
  );
}
