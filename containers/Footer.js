import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import Logo2 from '../public/images/logo-2.svg';
import PaymentImg from '../public/images/payment.png';


const Footer = (props) => {

    const { t, i18n } = useTranslation();

  return (
    <footer>
      <div className="container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      
        <div className="us">
          <h4 className="footer-title">{t('about_us')}</h4>
          <p>{t('about_us.description')}</p>
        </div>
        <div className="may-interest-you">
          <h4 className="footer-title">{t('may_interest_you')}</h4>
          <ul>
            <li>
              <Link href="/affiliate" aria-label="Be affiliate">
                {t('Affiliate')}
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="My account">
                {t('my_account')}
              </Link>
            </li>
            <li>
              <Link href="/shopping" aria-label="Shopping cart">
                {t('shopping_bag')}
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="Size guard">
                {t('size_guide')}
              </Link>
            </li>
            <li>
              <Link href="/faqs" aria-label="FAQS">
                {t('faqs')}
              </Link>
            </li>
            <li>
              <Link href="/complaints" aria-label="complaints">
                {t('complaints')}
              </Link>
            </li>
          </ul>
        </div>
        <div className="important-links">
          <h4 className="footer-title">{t('important_links')}</h4>
          <ul>
            <li>
              <Link href="/" aria-label="terms and conditions">
                {t('terms_and_conditions')}
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="privacy policy">
                {t('privacy_policy')}
              </Link>
            </li>
            <li>
              <Link href="/orders" aria-label="Orders">
                {t('shipping_and_delivery')}
              </Link>
            </li>
            <li>
              <Link href="/" aria-label="return and exchange">
                {t('return_and_exchange')}
              </Link>
            </li>
          </ul>
        </div>

        <div className="contact-us">
          <h4 className="footer-title">{t('contact_us')}</h4>
          <ul>
            <div className="media ">
              <li>
                <Link href="/" aria-label="Whatsapp contact">
                    <i className="fa-brands fa-whatsapp"></i>
                </Link>
              </li>
              <li>
                <Link href="/" aria-label="Instagram contact">
                    <i className="fa-brands fa-instagram"></i>
                </Link>
              </li>
            </div>
            <li>support@kenf.sa</li>
          </ul>
        </div> 
         <div className="logo-footer">
          <Image src={Logo2} alt="logo" />
        </div>
      </div>
      <div className="bottom_footer ">
        <div className="bottom_footer-container" style={{ justifyContent: 'space-around' }}>
          <div className="footer-content col-md-4 col-4">
            <div className="left-content">
              <div className="img">
                <Image src={PaymentImg} alt="img" />
              </div>
            </div>
          </div>
          <div className="footer-content col-md-3 col-4">
            <div className="center-content">
              <div className="copyright">
                <span dir="auto">
                  {t('all_rights_reserved_to_kenf', { date: new Date().getFullYear() })}<span>&copy;</span>
                </span>
              </div>
            </div>
          </div>
          <div className="footer-content col-md-4 col-4">
            <div className="right-content">
              <a href="https://maroof.sa/businesses/details/280561">
                <img src="https://maroof.sa/maroof-logo-type--gold2x.91d514e61999e937.svg" loading="lazy" alt=".." width="50px"/>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
