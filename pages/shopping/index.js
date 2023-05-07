import Link from "next/link";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShoppingCard from "@/components/ShoppingCard";
import { useTranslation } from "next-i18next";
import axios from "../../utils/auth_axios";
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { ToastContainer } from "react-toastify";
import Head from "next/head";
import Script from "next/script";

const BuyButton = dynamic(() => import('@/components/BuyButton'), { 
    ssr: false 
})
export default function Cart(props){

    const { t, i18n } = useTranslation();

    const [ cartItems, setCartItems ] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [tax, setTax] = useState(0);

    useEffect(()=>{
        setCartItems(props.cartItems);
    },[props.cartItems]);

    useEffect(()=>{
        let total = cartItems.map((val)=>val.extra_price).reduce((partialSum, a) => partialSum + a, 0);
        let tax15 = total ? total * 0.15 : 0;
        setSubTotal(total);
        setTax(tax15);
    },[cartItems]);

    const onDeleted = (id) =>{
        console.log(id);
        setCartItems(cartItems.filter((product)=> product.id !== id ));
    };

    

    return (
        <>
            <section className="bag">
                <div className="page-title">{t('shopping_bag')}</div>
                <div className="container">
                    {
                        cartItems?.length > 0 &&
                            <div className="bag-info">
                                <div className="costs" >
                                    <div className="total-bag">
                                        <span>{t('total_shopping_bag')} :</span>
                                        <span className="amount">{t('sar')} {subTotal ? subTotal : 0}</span>
                                    </div>
                                    <div className="tax">
                                        <span>{t('tax')} 15% :</span>
                                        <span className="amount">{t('sar')} {parseFloat(tax.toFixed(2))}</span>
                                    </div>
                                </div>
                                <div className="continue">
                                    <BuyButton hideAddToCart={true} buyNowText={t('continue_payment')} products={null} isCart={true}/>
                                </div>
                            </div>
                    }
                    {
                        cartItems?.length > 0 ?
                        <div className="bag-products">
                            {
                                cartItems.map((item, index) => (
                                    <ShoppingCard key={index} data={item} deletedProduct={onDeleted}/>
                                ))
                            }
                        </div> :
                        <div className='bag-text-center'>{t('message.no_products_shopping_bag')}</div>
                    }
                </div>
            </section>
        </>
    );
}

export async function getServerSideProps({ req, locale, params }) {
    let groups = [];
    let categories = [];
    try{
      const appData = await getAppData();
      groups = appData.groups;
      categories = appData.categories;
    }
    catch(e){}

    let cartItems = [];
    try{
        cartItems = await axios.get(`/user/cart`,{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        });
        cartItems = cartItems?.data?.data;
    }
    catch(e){
        console.log(e);
    }

    return {
      props: {
        groups,
        categories,
        cartItems,
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }
  