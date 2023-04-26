import { useEffect, useState } from "react";
import axios from "../../utils/auth_axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { setCookie } from 'cookies-next';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddressPanel from "@/components/AddressPanel";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { imageURI } from "@/config";
import VisaIcon from '../../public/images/294654_visa_icon.png';
import MasterIcon from '../../public/images/MasterCard_early_1990s_logo.svg';
import MdIcon from '../../public/images/md.png';
import { useForm } from 'react-hook-form';
import Head from "next/head";
import Script from "next/script";

export default function Checkout(props){

    const { t, i18n } = useTranslation();

    const {products, shippingCompanies, paymentSession, isCart } = props;

    const { register, handleSubmit, setValue, setError, clearErrors ,formState: { errors } } = useForm();
    
    const [isSavedAddress, setIsSavedAddress] = useState(false);
    const [checkoutProgress, setCheckoutProgress] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [couponLoading, setCouponLoading] = useState(false);
    const [coupon, setCoupon] = useState();
    const [prevCheckOut, setPrevCheckOut] = useState({});
    const [checkOut, setCheckOut] = useState({});
    const [cardType, setCardType] = useState();
    const [couponCode, setCouponCode] = useState("");
    const [shipping, setShipping] = useState();
    const [addressLoading, setAddressLoading] = useState(false);

    useEffect(()=>{
        let subTotal = 0;
        let tax = 0;
        let discount = 0;
        let shippingPrice = 0;
        let total = 0;
        products?.map((val)=>{
            subTotal += val.extra_price;
        });
        if(shipping?.id){
            shippingPrice = shipping.price;
        }
        if(coupon?.id){
            if(coupon.discount_type === 'percent'){
                discount = (subTotal * coupon.discount ) / 100;
                if(coupon.max_discount){
                    discount = discount > coupon.max_discount ? coupon.max_discount : discount;
                }
            } else if(coupon.discount_type === 'fixed'){
                discount = coupon.discount;
            }
            if(discount > subTotal){
                discount = subTotal;
            }
            if(coupon.freeShipping && shipping?.id && coupon.freeShipping.includes(shipping.id)){
                shippingPrice = 0;
            }
        }
        tax = (subTotal - discount) * 0.15;
        total = subTotal - discount + tax + shippingPrice;
        setCheckOut({
            totalShoppingBag: subTotal,
            discount: discount,
            tax15: tax,
            shipping: shippingPrice,
            fullTotal: total

        });
    },[products,shipping,coupon]);

    const couponApply = async() => {
        setCouponLoading(true);
        try{
            let couponResponse = await axios.get('/market/coupon/apply',{
                params: {
                    code: couponCode
                }
            });
            let coupon = couponResponse.data.data;
            if(coupon.total_purchase_condition && coupon.total_purchase_condition != 0 && coupon.total_purchase_condition > checkOut.totalShoppingBag){
                toast.error("Minimum "+coupon.total_purchase_condition+" is required to apply this coupon.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setCouponLoading(false);
                return;
            }
            setCouponLoading(false);
            setCoupon(couponResponse.data.data);
        }
        catch(e){
            if(e.response?.data?.message){
                toast.error(e.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
            else{
                toast.error(e.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
        setCouponLoading(false);
    }

    const removeCoupon = () => {
        setCoupon();
        setCouponCode('');
    };

    const saveAddress = data =>{
        setAddressLoading(true);
        let body= {};
        body.address = {
            fullname: data.address.fullname,
            phone: data.address.phone,
            email: data.address.email,
            country: data.address.country,
            city: data.address.city,
            zipCode: data.address.zipCode,
            street: data.address.street
        };
        if (isChecked) {
            body.billingAddress = {
                fullname: data.address.fullname,
                phone: data.address.phone,
                email: data.address.email,
                country: data.address.country,
                city: data.address.city,
                zipCode: data.address.zipCode,
                street: data.address.street
            }
        }
        else{
            body.billingAddress = {
                fullname: data.billingAddress.fullname,
                phone: data.billingAddress.phone,
                email: data.billingAddress.email,
                country: data.billingAddress.country,
                city: data.billingAddress.city,
                zipCode: data.billingAddress.zipCode,
                street: data.billingAddress.street
            }
        }
        axios.put(`/user/profile`, body)
            .then(res => {
                toast.success(t('message.profile_saved'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setAddressLoading(false);
            })
            .catch(err => {
                if(err.response?.data){
                    if(!err.response.data.errors){
                        toast.error(err.response.data.message, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                        });
                    }
                    else{
                        //set errors
                        for (let errorKey in err.response.data.errors) {
                            setError(errorKey,{
                                message: err.response.data.errors[errorKey].message,
                                type: 'custom'
                            },{ shouldFocus: true });
                        }
                            
                    }
                }
                else {
                    toast.error(err.message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
                setAddressLoading(false);
            });
    };

    useEffect(()=>{
        var config = {
            countryCode: paymentSession.data.CountryCode, 
            sessionId: paymentSession.data.SessionId,
            cardViewId: "card-element-credit",
            style: {
                direction: i18n.language === 'ar' ? 'rtl' : 'ltr',
                error: {
                  borderColor: "red",
                  borderRadius: "8px",
                  boxShadow: "0px",
                },
            },
        };
        document.getElementById("card-element-credit").innerHTML = ""
        myFatoorah.init(config);
    },[]);

    useEffect(()=>{
        if(window.ApplePaySession && checkOut.fullTotal !== prevCheckOut.fullTotal){
            let applePayConfig = {
                countryCode: paymentSession.data.CountryCode,
                sessionId: paymentSession.data.SessionId,
                currencyCode: "SAR",
                amount: checkOut.fullTotal,
                cardViewId: "card-element-credit-apple",
                callback: (response) => { onCheckOut(response); },
                sessionStarted: (args)=>{ console.log("Apple pay session started");console.log(args); },
                sessionCanceled: (args) =>{ console.log("Apple pay session end");console.log(args);alert("ApplePay payment is cancelled"); }   
            };
            document.getElementById("card-element-credit-apple").innerHTML = ""
            myFatoorahAP.init(applePayConfig);
        }
        setPrevCheckOut(checkOut);
    },[checkOut]);

    const onCheckOut = async(myfatoorahResponse) => {
        if(!shipping?.id){
            toast.error("Shipping is not selected", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            return;
        }
        setCheckoutProgress(true);
        try{
            if(!myfatoorahResponse){
                myfatoorahResponse = await myFatoorah.submit();
            }
            const checkoutResponse = await axios.post('payment/execute',{
                sessionId: myfatoorahResponse.sessionId,
                cart: isCart,
                ...(!isCart && {items: products.map((val)=>{return { id: val.id, quantity: 1 };})}),
                ...(coupon?.id && { coupon: coupon.id }),
                shipping: shipping.id,
            });
            setCheckoutProgress(false);
            window.open(checkoutResponse.data.data.PaymentURL,"_self");
        }
        catch(e){
            if(e.response?.data?.message){
                toast.error(e.response?.data?.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
            else{
                toast.error(e.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
        setCheckoutProgress(false);
    }
    

    return (
        <>
            <Head>
                <title>Kenf Checkout</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="shortcut icon" href="/images/SVG/logo-3.svg" />
            </Head>
            <main>
                <section className="checkout">
                    <div className="page-title">{t('checkout')}</div>

                    <div className="container">
                    
                        <div className="checkout-details"dir="auto">
                            <div className="addresses">

                                <div className="address-list">
                                    <div className="header">
                                        <label htmlFor="address">{t('use_saved_address')}</label>
                                        <input type="radio" name="a" id="address" onChange={() => setIsSavedAddress(true)} />
                                    </div>
                                </div>
                                <div className="new-address" style={{overflow: "hidden"}}>
                                    <div className="header">
                                        <label htmlFor="addAddress">{t('add_new_address')}</label>
                                        <input type="radio" name="a" id="addAddress" onChange={() => setIsSavedAddress(false)} />
                                    </div>
                                    {
                                        !isSavedAddress &&
                                            <form onSubmit={handleSubmit(saveAddress)}>
                                                <div className="address-info" dir="auto">
                                                    <AddressPanel errors={errors} type="address" register={register} isChecked={isChecked} clearErrors={clearErrors}/>
                                                    <div className="check d-flex gap-1">
                                                        <input type="checkbox" id="checkbox" onChange={() => setIsChecked(!isChecked)} checked={isChecked} />
                                                        <label htmlFor="checkbox">{t('payment_and_shipping_address_are_the_same')}</label>
                                                    </div>
                                                    {
                                                        addressLoading ? 
                                                        <div className="spinner"></div>
                                                        :
                                                        <button type='submit' className="save-address">{t('save_address')}</button>
                                                    }
                                                </div>
                                                {
                                                    !isChecked &&
                                                        <div className="billing-address">
                                                            <div className="header">
                                                                <label htmlFor="">{t('billing_address')}</label>
                                                            </div>
                                                            <div className="address-info" dir={i18n.language === 'ar' ? "rtl" : "ltr"}>
                                                                <AddressPanel errors={errors} type="billingAddress" isChecked={isChecked} clearErrors={clearErrors} register={register} />
                                                            </div>
                                                        </div>
                                                }
                                            </form>
                                    }
                                </div>

                            </div>
                            <div className="checkout_ordedrs">
                                <div className="ordedrs-title fw-bold pb-1" style={{borderBottom: "2px solid"}}>{t('your_orders')} : </div>
                                <div className="ordedrs-list mt-3 gap-1 d-flex justify-content-between flex-column">
                                    {
                                        products.filter(item => Object.keys(item).length > 0).map((item, index) => (
                                            <div key={index} className="order d-flex gap-2 align-items-center">
                                                <div className="order_img" >
                                                {
                                                        item?.images === undefined ? "..." : <Image fill src={item.mainImage?.link ? ( imageURI + item.mainImage.link ) : ( item.images ? imageURI + item.images[0].link : '' ) } alt="..." />
                                                    }
                                                </div>
                                                <div className="order_price">
                                                    {item.extra_price} {t('sar')}
                                                </div>
                                                <div className="order_title">
                                                    {i18n.language === 'en' ? item.name_en : item.name_ar}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="checkout-info" dir="auto">
                            
                            <div className="shipping-company">
                                <div className="shipping-title fw-bold pb-1" style={{borderBottom: "2px solid"}}>{t('shipping_by')} : </div>
                                <div className="shipping-list mt-3 gap-3 d-flex justify-content-between flex-column">
                                    {
                                        shippingCompanies.map((item, index) => (
                                            <div className="company d-flex gap-2 justify-content-between" key={index}>
                                                <div className="d-flex gap-2">
                                                    <input type="radio" name="1" id={"co_" + index} onChange={ (e)=> { setShipping(item); }}  />
                                                    <label htmlFor={"co_" + index}>{item.company} <sub style={{padding: "0 5px"}}> { coupon?.freeShipping && coupon.freeShipping.includes(item.id) ? "FREE" : item.price + " " + t('sar') }</sub></label>
                                                </div>
                                                <div className="time">{item.time}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="discount-code" style={{ position: 'relative' }}>
                                <button onClick={()=>{ coupon?.id ? removeCoupon() : couponApply();}}>{coupon?.id ? t('remove') : t('apply')}</button>
                                <input style={{ textTransform: 'uppercase' }} type="text" placeholder={t('discount_code')} value={couponCode} onChange={e => setCouponCode(e.target.value)} dir="auto" disabled={coupon?.id ? true : false} />
                                {
                                    couponLoading ? 
                                        <div className="spinner" style={{ width: 20, height: 20, aspectRatio: 1, position: 'absolute', right: 10, top: 10 }}></div>
                                    :
                                        <></>
                                }
                            </div>
                            <div className="costs">
                                <div className="total-bag">
                                    <span>{t('total_shopping_bag')} :</span>
                                    <span className="amount">{checkOut.totalShoppingBag?.toFixed(2)} SAR</span>
                                </div>
                                {
                                    checkOut.discount && checkOut.discount !== 0 ?
                                        <div className="discount">
                                            <span>{t('discount')} :</span>
                                            <span className="amount">{checkOut.discount?.toFixed(2)} SAR</span>
                                        </div>
                                        :
                                        <></>
                                }
                                {
                                    checkOut.shipping !== 0 &&
                                        <div className="shipping">
                                            <span>{t('shipping')} :</span>
                                            <span className="amount">{checkOut.shipping?.toFixed(2)} SAR</span>
                                        </div>
                                }
                                <div className="tax">
                                    <span>{t('tax')} 15% :</span>
                                    <span className="amount">{checkOut.tax15?.toFixed(2)} SAR</span>
                                </div>
                                <div className="full-cost">
                                    <span>{t('full_total')} :</span>
                                    <span className="amount">{checkOut.fullTotal?.toFixed(2)} SAR</span>
                                </div>
                            </div>
                            <div className="payments" dir="auto">
                                <div className="title">{t('payment_method')}</div>
                                <div id="card-element-credit" style={{display: cardType == 'card' ? 'block' : 'none'}}></div>
                                <div className="payment_methods d-flex">
                                    <div className="method credit-card" id="credit-card">
                                        <button id="credit_btn" onClick={() => setCardType('card')}>
                                            <Image src={VisaIcon} alt="" width={32} />
                                            <Image src={MasterIcon} alt="" width={32} />
                                            <Image src={MdIcon} alt="" width={32} style={{marginLeft: 3}} />
                                        </button>
                                    </div>
                                    <div id="card-element-credit-apple"></div>
                                </div>
                            </div>
                            <div className="continue" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                {
                                    checkoutProgress ?
                                    <div className="spinner"></div>
                                    :
                                    <button className="continue__btn" onClick={()=>{onCheckOut();}}>{t('checkout')}</button>
                                }
                                
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer />
            </main>
        </>
    );
}

export async function getServerSideProps({ req, locale, res, query }) {
    let user;
    try{
        user = await axios.get('/user/profile',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        });
        user = user.data.data;
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
    if(query.cart !== 'true' && query.cart !== 'false'){
        return {
            notFound: true
        };
    }
    let products;
    if(query.cart === 'false'){
        if(!query.products){
            return {
                notFound: true
            };
        }
        try{
            products = JSON.parse(query.products);
            if(products.length == 0 || products.length > 20){
                return {
                    notFound: true
                };
            }
            let productsResponse = await axios.get('/product/find',{
                withCredentials: true,
                headers: {
                    Cookie: req.headers?.cookie ? req.headers.cookie : '',
                    token: process.env.AUTH_TOKEN
                },
                params: {
                    products: products
                }
            });
            productsResponse = productsResponse.data.data;
            if(productsResponse.length == 0){
                return {
                    notFound: true
                };
            }
            products = productsResponse;
        }
        catch(e){
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                }
            }
        }
    }
    else{
        try{
            products = await axios.get(`/user/cart`,{
                withCredentials: true,
                headers: {
                    Cookie: req.headers?.cookie ? req.headers.cookie : '',
                    token: process.env.AUTH_TOKEN
                }
            });
            products = products?.data?.data;
            if(products.length == 0){
                return {
                    notFound: true
                };
            }
        }
        catch(e){
            return {
                redirect: {
                    destination: '/500',
                    permanent: false,
                }
            }
        }
    }
    let shippingCompanies = [];
    let paymentSession = {};
    try{
        shippingCompanies = await axios.get('/settings/shipping',{
            withCredentials: true,
            headers: {
                token: process.env.AUTH_TOKEN
            },
            params: {
                limit: 10,
                page: 1
            }
        });
        shippingCompanies = shippingCompanies.data.data.docs;
        paymentSession = await axios.get('/payment/initiate',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        }); 
        paymentSession = paymentSession.data;
    }
    catch(e){
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
        user,
        products,
        shippingCompanies,
        paymentSession,
        isCart: query.cart === 'true',
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  } 