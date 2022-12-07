import Link from "next/link";
import Images from "../../components/image_panel";

const Footer = () => {
  return (
    <footer>
      <div className="container" dir="ltr">
      
        <div className="us">
          <h4 className="footer-title">About Us</h4>
          <p>Kanf is one of the largest trading platforms in the Middle East</p>
        </div>
        <div className="may-interest-you">
          <h4 className="footer-title">May Interest You</h4>
          <ul>
            <li>
              <Link href="/products">
                <a>Products</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>My Account</a>
              </Link>
            </li>
            <li>
              <Link href="/shopping">
                <a>Shopping Bag</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Size Guide</a>
              </Link>
            </li>
            <li>
              <Link href="/faqs">
                <a>FAQs</a>
              </Link>
            </li>
            <li>
              <Link href="/complaints">
                <a>Complaints</a>
              </Link>
            </li>
          </ul>
        </div>
        <div className="important-links">
          <h4 className="footer-title">Important Links</h4>
          <ul>
            <li>
              <Link href="/">
                <a>Terms and Conditions</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Privacy Policy</a>
              </Link>
            </li>
            <li>
              <Link href="/orders">
                <a>Shipping And Delivery</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a>Return And Exchange</a>
              </Link>
            </li>
          </ul>
        </div>

        <div className="contact-us">
          <h4 className="footer-title">Contact Us</h4>
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
                  All rights reserved to KENF 2022 <span>&copy;</span>
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
