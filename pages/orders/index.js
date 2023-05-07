import Link from 'next/link';
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import axios from '../../utils/auth_axios';
import useSWRInfinite from 'swr/infinite';

const fetcher = async(url)=>{
    return (await axios.get(url)).data.data;
}

export default function Order(props){

    const { t } = useTranslation();

    const {
        data,
        size,
        setSize,
        isLoading,
        mutate,
      } = useSWRInfinite( (index) => `order/?limit=${20}&page=${ index + 1 }` , fetcher, { fallbackData: props.orders, revalidateOnFocus: false  });

    const orders = data ? [].concat(...(data.map((val)=>val.docs))) : [];
    const isReachingEnd = data && data.length != 0 ? data[data.length-1].hasNextPage === false : true;

    return (
        <>
            <section className="orders">
                <div className="page-title">{t('my_orders')}</div>
                <div className="container">
                    {
                        orders.map((item, index) => (
                            <div key={"order_"+item.id} className="order" dir="auto">
                                <div className="order__number">
                                    {t('order_details_number')}
                                    <span>#{item.paymentInfo.invoiceId}</span>
                                </div>
                                <div className="order__details">
                                    <div className="order__info">
                                        <div className="order__cost">{t('order_cost')}<span className="cost">{item.totalPrice} SAR</span></div>
                                        <div className="order__status">{t('order_status')} <span className="status">{item.status}</span></div>
                                    </div>
                                    <div className="invoice">
                                        <button onClick={()=>{}}>{t('invoice')}</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
                {
                    isLoading && <div className='spinner' style={{ marginLeft: 'auto' , marginRight: 'auto'}}></div>
                }
                {
                    !isLoading && !isReachingEnd ? <button onClick={()=>{setSize(size+1)}} className="load_more_btn">Load more</button> : <></>
                }
            </section>
        </>
    )
}

export async function getServerSideProps({ req, locale, res, query }) {
    let orders = {};
    try{
        orders = await axios.get('/order?limit=20&page=1',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        }); 
        orders = orders.data.data;
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
        orders: [orders],
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }  