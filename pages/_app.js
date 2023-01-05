import React, { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useRouter } from 'next/router';
import Header from "../containers/header";
import Footer from "../containers/footer";
import Spinner from "../components/spinner";
import { AuthProvider } from '../components/auth_context';
import Script from 'next/script';

import '../styles/css/bootstrap.min.css';
import '../styles/css/owl.carousel.min.css';
import '../styles/css/owl.theme.default.min.css';
import '../styles/css/all.min.css';
import '../public/build/css/intlTelInput.min.css';
import '../styles/css/style.css';
import 'react-toastify/dist/ReactToastify.css';

var $ = require("jquery");
if (typeof window !== "undefined") {
  window.$ = window.jQuery = require("jquery");
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadPayment, setIsLoadPayment] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (hasMounted) {
    return (
      <HelmetProvider>
        <Script src="js/bootstrap.bundle.min.js" />
        <Script src="https://demo.myfatoorah.com/cardview/v2/session.js" onLoad={() => setIsLoadPayment(true)}></Script>
        <Script src="https://demo.myfatoorah.com/applepay/v2/applepay.js"></Script>
        <Script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js" />
        <Script src="js/chatra.js" onLoad={() => setIsLoad(true)}/>
        {
          isLoad && isLoadPayment &&
            <AuthProvider>
              { router.pathname != '/coupon' && <Header /> }
              <Component {...pageProps} />
              { router.pathname != '/coupon' && <Footer /> }
            </AuthProvider>
        }

        <Helmet>
          <script src="js/main.js" async />
        </Helmet>
      </HelmetProvider>
    )
  }
  else {
    return <Spinner />
  }
}

export default MyApp
