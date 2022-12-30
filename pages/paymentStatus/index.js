import { ServerURI } from '../../config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Spinner from "../../components/spinner";
import { useEffect, useState } from 'react';
import thankyouStyle from '../../components/thank_you.module.css';
import Link from 'next/link';

const PaymentStatus = (props) => {
    const { t } = useTranslation();
    const [ loading, setLoading ] = useState(false);
    const [ status, setStatus ] = useState('Succss');
    const [ message, setMessage ] = useState();
    const [ orderId, setOrderId ] = useState();

    useEffect(()=>{
        (async()=>{
            setLoading(true);
            try{
                let response = await axios.post(`${ServerURI}/order/paymentStatus`,{session: sessionStorage.getItem('token'),},{ 
                    params: { paymentId: props.paymentId }
                });
                if(response.data.IsSuccess){
                    setStatus(response.data.orderId);
                    setStatus('Succss');
                    setMessage('Thank you for the purchase. We received your order.');
                }
                else{
                    setStatus(response.data.transactionStatus);
                    if(response.data.transactionStatus === 'Failed'){
                        setMessage("Transaction failed due to "+response.data.message);
                    }
                    else{
                        setMessage(response.data.message);
                    }
                }
            }
            catch(e){
                if(e.response && e.response.data.message){
                    setStatus('Error');
                    setMessage(e.response.data.message);
                }
                else{
                    setStatus('Error');
                    setMessage(e.message);
                }
            }
            setLoading(false);
        })();
    },[]);

    if(loading){
        return (
            <div className='container' style={{ height: '70vh' }}>
                <div className='row d-flex justify-content-center align-items-center' style={{ height: '70vh' }}>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

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

export async function getServerSideProps(context) {
    const paymentId = context.query.paymentId;
    if (!paymentId) {
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
    return {
      props: {
        paymentId
      },
    };
}

export default PaymentStatus;