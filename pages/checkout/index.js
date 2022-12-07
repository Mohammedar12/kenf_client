import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { ServerURI } from '../../config';
import Images from '../../components/image_panel'
import AddressPanel from '../../components/address_panel';

const Checkout = props => {
    const router = useRouter();
    const { getAllShipping, getProductDetail } = props;
    const { register, handleSubmit } = useForm();
    const [profile, setProfile] = useState({});
    const [products, setProducts] = useState([getProductDetail]);
    const [discount, setDiscount] = useState('');
    const [checkOut, setCheckOut] = useState({});
    const [shipping, setShipping] = useState({});
    const [cardType, setCardType] = useState(null);
    const [isChecked, setIsChecked] = useState(true);
    const [isSavedAddress, setIsSavedAddress] = useState(false);

    useEffect(() => {
        axios.post(`${ServerURI}/getProfile`, { token: sessionStorage.getItem('token') })
            .then(res => {
                setProfile(res.data);
            })
            .catch(err => console.log(err));

        if (router.query.cart == "true") {
            axios.get(`${ServerURI}/settings/favorite?token=${sessionStorage.getItem("token")}`)
                .then(res => {
                    setProducts(res.data.cart);
                })
                .catch(err => console.log(err));
        }

        getCheckout();
    }, []);

    useEffect(() => {
        getCheckout();
    }, [shipping, products]);

    const getCheckout = () => {
        var totalShoppingBag = 0,
            shippingPrice = Object.keys(shipping).length ? shipping.price : 0,
            tax15 = 0,
            fullTotal = 0;

        products.map(item => {
            totalShoppingBag += item.extra_price;
            tax15 = totalShoppingBag * 0.15;
            fullTotal = totalShoppingBag + shippingPrice + tax15;
        })

        setCheckOut({
            totalShoppingBag: totalShoppingBag,
            discount: checkOut.discount,
            shipping: shippingPrice,
            tax15: tax15,
            fullTotal: fullTotal,
            fullTotalCache: fullTotal,
        });
    }

    const onSaveAddress = data => {
        var billingAddress = {};

        if (isChecked) {
            billingAddress = {
                billingAddressName: data.addressName,
                billingAddressPhone: data.addressPhone,
                billingAddressEmail: data.addressEmail,
                billingAddressCountry: data.addressCountry,
                billingAddressCity: data.addressCity,
                billingAddressZipCode: data.addressZipCode,
                billingAddressStreet: data.addressStreet,
            }
        }

        axios.post(`${ServerURI}/saveAddress`, {...data, ...billingAddress, token: sessionStorage.getItem("token")})
            .then(res => {
                if (res.data.nModified) {
                    setProfile({...profile, ...data, ...billingAddress});

                    toast.success('New address has been added', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                } else {
                    toast.error('New address has never added', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
            })
            .catch(err => console.log(err));
    }

    

    const onApplyDiscount = () => {
        axios.get(`${ServerURI}/market/confirmDiscount?code=${discount}`)
            .then(res => {
                if (res.data != null) {
                    if (res.data.discount_type == "percent") {
                        var discount = res.data.discount * checkOut.totalShoppingBag / 100;
                        var maxDiscount = res.data.max_discount;
                        
                        setCheckOut({...checkOut, coupon_id: res.data.id, fullTotal: checkOut.fullTotal - (discount > maxDiscount ? maxDiscount : discount), discount: discount > maxDiscount ? maxDiscount : discount});
                    } else {
                        var discount = res.data.discount * checkOut.totalShoppingBag / 100;

                        setCheckOut({...checkOut, coupon_id: res.data.id, fullTotal: checkOut.fullTotal - discount, discount: discount});
                    }
                } else {
                    toast.error('Discount code does not exist', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
            })
            .catch(err => console.log(err));
    }

    const onRemoveDiscount = () => {
        setCheckOut({...checkOut, discount: null, fullTotal: checkOut.fullTotalCache});
    }

    const onCheckOut = async () => {
        
        var access_token = '';
        
        // Get access_token using refresh_token
        await axios.get(`${ServerURI}/order/refreshToken`)
            .then(res => access_token = res.data.access_token)
            .catch(err => console.log(err));

        var data = { session: sessionStorage.getItem('token'), token: access_token, cartType: router.query.cart, ...profile, ...checkOut, productList: products };

        await myFatoorah.submit()
            .then(function (response) {
                // Create order using node server
                axios.post(`${ServerURI}/order/executePayment`, {...data, ...response})
                    .then(res => {
                        if (res.data.IsSuccess) {
                            window.open(res.data.Data.PaymentURL);

                            axios.post(`${ServerURI}/order/createOrder`, {...data, ...response})
                                .then(res => {
                                    if (Object.keys(res.data).length) {
                                        router.push('/orders');
                                    }
                                })
                                .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err));

            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <section className="checkout">
                <div className="page-title">Checkout</div>

                <div className="container">
                   
                    <div className="checkout-details"dir="auto">
                        <div className="addresses">

                            <div className="address-list">
                                <div className="header">
                                    <label htmlFor="address">Use Saved address</label>
                                    <input type="radio" name="a" id="address" onChange={() => setIsSavedAddress(true)} />
                                </div>
                            </div>
                            <div className="new-address" style={{overflow: "hidden"}}>
                                <div className="header">
                                    <label htmlFor="addAddress">Add New Address</label>
                                    <input type="radio" name="a" id="addAddress" onChange={() => setIsSavedAddress(false)} />
                                </div>
                                {
                                    !isSavedAddress &&
                                        <form onSubmit={handleSubmit(onSaveAddress)}>
                                            <div className="address-info" dir="auto">
                                                <AddressPanel type="address" register={register} />
                                                <div className="check d-flex gap-1">
                                                    <input type="checkbox" id="checkbox" onChange={() => setIsChecked(!isChecked)} checked={isChecked} />
                                                    <label htmlFor="checkbox">Payment and shipping address are the same</label>
                                                </div>
                                                <button type='submit' className="save-address">Save Address</button>
                                            </div>
                                            {
                                                !isChecked &&
                                                    <div className="billing-address">
                                                        <div className="header">
                                                            <label htmlFor="">Billing Address</label>
                                                        </div>
                                                        <div className="address-info" dir="rtl">
                                                            <AddressPanel type="billingAddress" isChecked={isChecked} register={register} />
                                                        </div>
                                                    </div>
                                            }
                                        </form>
                                }
                            </div>

                        </div>
                        <div className="checkout_ordedrs">
                            <div className="ordedrs-title fw-bold pb-1" style={{borderBottom: "2px solid"}}>Your Orders : </div>
                            <div className="ordedrs-list mt-3 gap-1 d-flex justify-content-between flex-column">
                                {
                                    products.filter(item => Object.keys(item).length > 0).map((item, index) => (
                                        <div key={index} className="order d-flex gap-2 align-items-center">
                                            <div className="order_img" >
                                                <Images src={ServerURI + (item.images[0].link ? item.images[0].link : '/getfile?id=' + item.images[0])} width={100} height={100} alt="" />
                                            </div>
                                            <div className="order_price">
                                                {item.extra_price} SAR
                                            </div>
                                            <div className="order_title">
                                                {item.name_en}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                     <div className="checkout-info" dir="auto">
                        
                        <div className="shipping-company">
                            <div className="shipping-title fw-bold pb-1" style={{borderBottom: "2px solid"}}>Shipping By : </div>
                            <div className="shipping-list mt-3 gap-3 d-flex justify-content-between flex-column">
                                {
                                    getAllShipping.map((item, index) => (
                                        <div className="company d-flex gap-2 justify-content-between" key={index}>
                                            <div className="d-flex gap-2">
                                                <input type="radio" name="1" id={"co_" + index} onClick={() => setShipping(item)} />
                                                <label htmlFor={"co_" + index}>{item.company} <sub style={{padding: "0 5px"}}>{item.price} SAR</sub></label>
                                            </div>
                                            <div className="time">{item.time}</div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="discount-code">
                            <button onClick={checkOut.discount ? onRemoveDiscount : onApplyDiscount}>{checkOut.discount ? 'Remove' : 'Apply'}</button>
                            <input type="text" placeholder="discount code" value={discount} onChange={e => setDiscount(e.target.value)} dir="auto" disabled={checkOut.discount} />
                        </div>
                        <div className="costs">
                            <div className="total-bag">
                                <span>Total Shopping Bag :</span>
                                <span className="amount">{checkOut.totalShoppingBag} SAR</span>
                            </div>
                            {
                                checkOut.discount &&
                                    <div className="discount">
                                        <span>Discount :</span>
                                        <span className="amount">{checkOut.discount} SAR</span>
                                    </div>
                            }
                            {
                                checkOut.shipping !== 0 &&
                                    <div className="shipping">
                                        <span>Shipping :</span>
                                        <span className="amount">{checkOut.shipping} SAR</span>
                                    </div>
                            }
                            <div className="tax">
                                <span>tax 15% :</span>
                                <span className="amount">{checkOut.tax15} SAR</span>
                            </div>
                            <div className="full-cost">
                                <span>Full Total :</span>
                                <span className="amount">{checkOut.fullTotal} SAR</span>
                            </div>
                        </div>
                        <div className="payments" dir="auto">
                            <div className="title">Payment Method</div>
                            <div id="card-element-credit" style={{display: cardType == 'card' ? 'block' : 'none'}}></div>
                            <Script src='js/initiateSessionCard.js' />
                            <div className="payment_methods d-flex">
                                <div className="method credit-card" id="credit-card">
                                    <button id="credit_btn" onClick={() => setCardType('card')}>
                                        <Images src="../images/294654_visa_icon.png" alt="" width="35px" />
                                        <Images src="../images/MasterCard_early_1990s_logo.svg" alt="" width="32 px" />
                                        <Images src="../images/md.png" alt="" width="35px" style={{marginLeft: 3}} />
                                    </button>
                                </div>
                                <div className="method apple-pay">
                                    <button onClick={() => setCardType('apple')}><i className="fa-brands fa-apple-pay fa-2x"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="continue">
                            <button className="continue__btn" onClick={onCheckOut}>Checkout</button>
                        </div>
                    </div>
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export async function getServerSideProps({ query }) {
    const getAllShipping = await fetch(`${ServerURI}/settings/shipping`);
    const allShipping = await getAllShipping.json();

    const getProductDetail = await fetch(`${ServerURI}/product?id=${query.product}`);
    const productDetail = await getProductDetail.json();

    return {
        props: {
            getAllShipping: allShipping,
            getProductDetail: productDetail,
        }
    }
}

export default Checkout;