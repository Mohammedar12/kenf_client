import { ServerURI } from '../../config';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import Spinner from "../../components/spinner";
import { useEffect, useState } from 'react';

const PaymentStatus = (props) => {
    const { t } = useTranslation();
    const [ loading, setLoading ] = useState(true);
    const [ status, setStatus ] = useState();
    const [ message, setMessage ] = useState();

    useEffect(()=>{
        (async()=>{
            setLoading(true);
            try{
                response = await axios.post(`${ServerURI}/order/paymentStatus`,{},{ params: { paymentId: props.paymentId }});
                if(response.data.IsSuccess){
                    setStatus('Paid');
                    setMessage('Thank you for the purchase. We received your order.');
                }
                else{
                    setStatus(response.data.transactionStatus);
                    setMessage(response.data.message);
                }
            }
            catch(e){
                console.log(e.response);
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

    return (
        <div className='container' style={{ height: '70vh' }}>
                <div className='row d-flex flex-column justify-content-center align-items-center' style={{ height: '70vh', ...( status === 'Failed' || status === 'Error' ? {color: 'red'} : {}) }}>
                    { ( status === 'Error' && <img style={{ width: 200, padding: 10 }} src='/images/error.png' alt='Error'/> ) }
                    { ( status === 'Failed' && <img style={{ width: 200, padding: 10 }} src='/images/credit-card.png' alt='Payment failed'/> ) }
                    { ( status === 'Paid' && <img style={{ width: 200, padding: 10 }} src='/images/successful.png' alt='Order placed successfully.'/> ) }
                    {message}
                    { ( status === 'Paid' && <div className='d-flex justify-content-center pt-4'><button className='btn btn-outline-success'>My Orders</button></div> ) }
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