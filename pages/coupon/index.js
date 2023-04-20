import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import styles from '../../styles/coupon.module.css';
import { FaChartLine, FaUser, FaMoneyBill } from 'react-icons/fa';
import Modal from '@/components/Modal';
import { useEffect, useState } from 'react';
import axios from '../../utils/auth_axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWRInfinite from 'swr/infinite';

const fetcher = async(url)=>{
    return (await axios.get(url)).data.data;
}

export default function Coupon(props){

    const { t, i18n } = useTranslation();
    const [couponLoading, setCouponLoading] = useState(false);
    const [coupon, setCoupon] = useState();
    const [selectedCoupon, selectCoupon] = useState();

    const {
        data,
        size,
        setSize,
        isLoading,
        mutate,
      } = useSWRInfinite( (index) => `market/coupon/?limit=${20}&page=${ index + 1 }` , fetcher, { fallbackData: props.coupons, revalidateOnFocus: false  });

    const coupons = data ? [].concat(...(data.map((val)=>val.docs))) : [];
    const isReachingEnd = data && data.length != 0 ? data[data.length-1].hasNextPage === false : true;

    useEffect(()=>{
        if(selectedCoupon){
            setCouponLoading(true);
            setCoupon();
            axios.get('/market/coupon/stats/'+selectedCoupon).then((couponResponse)=>{
                setCoupon(couponResponse.data.data);
                setCouponLoading(false);
            }).catch(e=>{
                if(e.response?.data?.message){
                    toast.error(e.response.data.message,{
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    })
                }
                else{
                    totast.error(e.message,{
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
                selectCoupon();
            });
        }
        else{
            setCoupon();
            setCouponLoading(false);
        }
    },[selectedCoupon]);

    return(
        <>
        <section className={styles.coupon_section}>
            <h2>Coupons List</h2>
            <div className={styles.coupons_list}>
                {
                    coupons.map((item)=>{
                        return(
                            <div key={"coupon_"+item.id} className={styles.coupons_list_item}>
                                <div>
                                    <p>Code: <b>{item.code}</b></p>
                                </div>
                                <div>
                                    <p>Discount Type: <b>{item.discount_type}</b></p>
                                    <p>Discount: <b>{item.discount}</b></p>
                                </div>
                                <div>
                                    <p>Profit type: <b>{item.profit_type}</b></p>
                                    <p>Profit: <b>{item.profit}</b></p>
                                </div>
                                <button className={styles.viewBtn} onClick={()=>{selectCoupon(item.id)}}>
                                    <FaChartLine />
                                </button>
                            </div>
                        )
                    })
                }
            </div>
            {
                isLoading && <div className='spinner' style={{ marginLeft: 'auto' , marginRight: 'auto'}}></div>
            }
            {
                !isLoading && !isReachingEnd ? <button onClick={()=>{setSize(size+1)}} className="load_more_btn">Load more</button> : <></>
            }
            <Modal show={selectedCoupon ? true : false} onModalClose={()=>{selectCoupon();}} cancelable={true} className={styles.stats_modal} onClick={(e)=>{e.stopPropagation()}}>
                { 
                    couponLoading ?
                    <div className='spinner' style={{ margin: 'auto' }}></div>
                    :
                    <div>
                        <div className="content d-flex gap-4 flex-column align-items-center ">
                            <div className="boxes">
                                <div className="box" style={{ textAlign: 'center' }}>
                                    <h3>{coupon?.code}</h3>
                                </div>
                                <div className="box d-flex">
                                    <FaUser size={16} style={{ marginTop: 5 }}/>
                                    <div className='d-flex flex-column'>
                                        <div className="title">&nbsp;&nbsp;&nbsp;Number Of Usage</div>
                                        <div className="amount">&nbsp;&nbsp;&nbsp;{coupon?.count}</div>
                                    </div>
                                </div>
                                <div className="box d-flex">
                                    <FaMoneyBill size={16} style={{ marginTop: 5 }}/>
                                    <div className='d-flex flex-column'>
                                        <div className="title">&nbsp;&nbsp;&nbsp;Profit</div>
                                        <div className="amount">&nbsp;&nbsp;&nbsp;{coupon?.profit ? coupon.profit : 0} SAR</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Modal>
        </section>
        <ToastContainer />
        </>
    )
}

export async function getServerSideProps({ req, locale, res }) {
    let coupons = [];
    try{
        coupons = await axios.get('/market/coupon?limit=20&page=1',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        }); 
        coupons = coupons.data.data;
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
        } else if(e.response?.status == 403){
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
        coupons: [coupons],
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }
