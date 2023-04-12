import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from '../../utils/auth_axios';
import { useEffect } from 'react';
import thankyouStyle from '../../styles/thank_you.module.css';

export default function PaymentStatus(props){

    const { t } = useTranslation();
    const {paymentStatus} = props;

    const [ status, setStatus ] = useState('Succss');
    const [ message, setMessage ] = useState();
    const [ orderId, setOrderId ] = useState();

    useEffect(()=>{
        if(paymentStatus.IsSuccess){
            setOrderId(paymentStatus.orderId);
            setStatus('Succss');
            setMessage('Thank you for the purchase. We received your order.');
        }
        else{
            setStatus(paymentStatus.transactionStatus);
            if(paymentStatus.transactionStatus === 'Failed'){
                setMessage("Transaction failed due to "+paymentStatus.message);
            }
            else{
                setMessage(paymentStatus.message);
            }
        }
    },[paymentStatus]);

    if(status === 'Succss'){
        return (
            <>
                <div className='container' style={{ height: '70vh' }}>
                    <div className='row d-flex flex-column justify-content-center align-items-center' style={{ height: '70vh' }}>
                        <div className={["d-flex flex-column gap-3 justify-content-center align-items-center"]}>
                            <div className={[thankyouStyle.thanksMsg,"d-flex flex-column align-items-center gap-2 text-center"]}>
                                <i className="fa-regular fa-face-smile-beam fa-3x"></i>
                                <h1 className="fw-light">Thank You</h1>
                                <p>Thanks For Choosing Us , Enjoy Your Products ! <br /> We Hope To See You Soon
                                    Here ;</p>
                            </div>
                            <div className={thankyouStyle.orderNumber}>
                                Your Order Number Is <span className="fw-bold">#{orderId}</span>
                            </div>
                            <div className={thankyouStyle.noteMsg}>
                                <span>notes :</span> We Will Send A Message To You If Your Order Has Been Shipped
                            </div>
                            <div className={thankyouStyle.buttons}>
                                <Link href='/orders'>MY ORDERS</Link>
                                <Link href='/'>HOME</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className='container' style={{ height: '70vh' }}>
                <div className='row d-flex flex-column justify-content-center align-items-center' style={{ height: '70vh', ...( status === 'Failed' || status === 'Error' ? {color: 'red'} : {}) }}>
                    { ( status === 'Error' && <img style={{ width: 200, padding: 10 }} src='/images/error.png' alt='Error'/> ) }
                    { ( status === 'Failed' && <img style={{ width: 200, padding: 10 }} src='/images/credit-card.png' alt='Payment failed'/> ) }
                    { ( status === 'Succss' && <img style={{ width: 200, padding: 10 }} src='/images/successful.png' alt='Order placed successfully.'/> ) }
                    {message}
                    { ( status === 'Succss' && <div className='d-flex justify-content-center pt-4'><button className='btn btn-outline-success'>My Orders</button></div> ) }
                </div>
            </div>
    )
}

export async function getServerSideProps({ req, locale, res, query }) {
    if(query.paymentId || query.paymentId.trim() === ''){
        return {
            notFound: true
        };
    }
    let paymentStatus = {};
    try{
        paymentStatus = await axios.get('/payment/status',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            },
            params: {
                paymentId: query.paymentId
            }
        }); 
        paymentStatus = paymentStatus.data;
    }
    catch(e){
        if(e.response?.status == 401){
            setCookie('login', 'true', { req, res, maxAge: 10 });
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }
        return {
            redirect: {
                destination: '/500',
                permanent: false,
            }
        }
    }
    let groups = [];
    let categories = [];
    try{
      const appData = await getAppData();
      groups = appData.groups;
      categories = appData.categories;
    }
    catch(e){}

    return {
      props: {
        groups,
        categories,
        paymentStatus,
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }  