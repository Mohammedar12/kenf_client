import Link from "next/link";
import Images from "../../components/image_panel";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";

const Footer = () => {

  const { t } = useTranslation();

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
              <Link href="/products">
                <a>{t('products')}</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>{t('my_account')}</a>
              </Link>
            </li>
            <li>
              <Link href="/shopping">
                <a>{t('shopping_bag')}</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>{t('size_guide')}</a>
              </Link>
            </li>
            <li>
              <Link href="/faqs">
                <a>{t('faqs')}</a>
              </Link>
            </li>
            <li>
              <Link href="/complaints">
                <a>{t('complaints')}</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="important-links">
          <h4 className="footer-title">{t('important_links')}</h4>
          <ul>
            <li>
              <Link href="/">
                <a>{t('terms_and_conditions')}</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>{t('privacy_policy')}</a>
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <a>{t('shipping_and_delivery')}</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>{t('return_and_exchange')}</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="contact-us">
          <h4 className="footer-title">{t('contact_us')}</h4>
          <ul>
            <div className="media ">
              <li>
                <Link href="/">
                  <a>
                    <i className="fa-brands fa-whatsapp"></i>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a>
                    <i className="fa-brands fa-instagram"></i>
                  </a>
                </Link>
              </li>
            </div>
            <li>support@kenf.sa</li>
          </ul>
        </div> 
         <div className="logo-footer">
          <Images src="images/logo-2.svg" alt="logo" />
        </div>
      </div>
      <div className="bottom_footer ">
        <div className="bottom_footer-container">
          <div className="footer-content col-md-4 col-4">
            <div className="left-content">
              <div className="img">
                <Images src="images/payment.png" alt="img" />
              </div>
            </div>
          </div>
          <div className="footer-content col-md-3 col-4">
            <div className="center-content">
              <div className="copyright">
                <span dir="auto">
                  {t('all_rights_reserved_to_kenf', { date: new Date() })}<span>&copy;</span>
                </span>
              </div>
            </div>
          </div>
          <div className="footer-content col-md-4 col-4">
            <div className="right-content"></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
