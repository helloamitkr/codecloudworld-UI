import '../styles/globals.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MyApp({ Component, pageProps }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ padding: '20px', flex: 1 }}>
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}
