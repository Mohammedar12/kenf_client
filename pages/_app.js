import Footer from '@/containers/Footer';
import { AuthProvider } from '@/context/AuthContext.js';
import Header from '@/containers/Header.js';
import '@/styles/globals.css';
import '@/styles/bootstrap.min.css';
import { appWithTranslation } from 'next-i18next'
import Script from 'next/script.js';
import nextI18NextConfig from '../next-i18next.config.js';

const MyApp = ({ Component, pageProps }) => {
  
  return(
    <>
      <Script src="/js/chatra.js" strategy="lazyOnload" />
      <AuthProvider>
        <Header {...pageProps} />
        <Component {...pageProps} />
        <Footer />
      </AuthProvider>
    </>
  );
}

export default appWithTranslation(MyApp,nextI18NextConfig);