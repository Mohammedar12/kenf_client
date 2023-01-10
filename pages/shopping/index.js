import axios from 'axios';
import Link from 'next/link';
import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from '../../components/auth_context';
import { CartContext } from '../../components/cart_context';
import { ServerURI } from "../../config";
import ShoppingCard from "../../components/shopping_card";
import { useTranslation } from 'react-i18next';

const Shopping = () => {
    const { isAuth } = useContext(AuthContext);
    const { cartCount, setCartCount } = useContext(CartContext);
    const [state, setState] = useState({});
    const [products, setProducts] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (isAuth) {
            axios.get(`${ServerURI}/settings/favorite?token=${sessionStorage.getItem("token")}`)
                .then(async res => {
                    var totalShoppingBag = 0;
                    var tax15 = 0;
                    var unsigned = [];

                    if (sessionStorage.getItem('cart')) {
                        await axios.post(`${ServerURI}/settings/decodeCart`, { token: sessionStorage.getItem('cart') })
                            .then(res => {
            
                                res.data.map(item => {
                                    totalShoppingBag += item.extra_price;
                                    tax15 = totalShoppingBag * 0.15;
                                });

                                unsigned = res.data;
                            })
                            .catch(err => console.log(err));
                    }
    
                    res.data.cart.map(item => {
                        totalShoppingBag += item.extra_price;
                        tax15 = totalShoppingBag * 0.15;
                    })
    
                    setProducts(res.data.cart.concat(unsigned));
                    setState({
                        totalShoppingBag: totalShoppingBag,
                        tax15: tax15
                    })
                })
                .catch(err => console.log(err));
        } else {
            if (sessionStorage.getItem('cart')) {
                axios.post(`${ServerURI}/settings/decodeCart`, { token: sessionStorage.getItem('cart') })
                    .then(res => {
                        var totalShoppingBag = 0;
                        var tax15 = 0;
    
                        res.data.map(item => {
                            totalShoppingBag += item.extra_price;
                            tax15 = totalShoppingBag * 0.15;
                        })
    
                        setProducts(res.data);
                        setState({
                            totalShoppingBag: totalShoppingBag,
                            tax15: tax15
                        })
                    })
                    .catch(err => console.log(err));
            }
        }
    }, [products, isAuth]);

    const restAll = () => {
        document.querySelector(".login-title").classList.remove("hide-this");
        document.querySelector(".field-email").classList.remove("show-this-block");
        document.querySelector(".field-phone").classList.remove("show-this-block");
        document.querySelector(".modal-footer").classList.remove("hide-this");
        document.querySelector(".verification-email").classList.remove("show-this-flex");
        document.querySelector(".verification-phone").classList.remove("show-this-flex");
    }

    return (
        <>
            <section className="bag">
                <div className="page-title">{t('shopping_bag')}</div>
                <div className="container">
                    {
                        products.length > 0 &&
                            <div className="bag-info">
                                <div className="costs" >
                                    <div className="total-bag">
                                        <span>{t('total_shopping_bag')} :</span>
                                        <span className="amount">{t('sar')} {state.totalShoppingBag ? state.totalShoppingBag : 0}</span>
                                    </div>
                                    <div className="tax">
                                        <span>{t('tax')} 15% :</span>
                                        <span className="amount">{t('sar')} {state.tax15 ? state.tax15 : 0}</span>
                                    </div>
                                </div>
                                <div className="continue">
                                    {
                                        isAuth ? 
                                            <Link href={{ pathname: '/checkout', query: { product: 0, cart: true } }}><button className="continue__btn">{t('continue_payment')}</button></Link> :
                                            <button className="continue__btn" onClick={restAll} data-bs-toggle="modal" data-bs-target="#staticBackdrop">{t('continue_payment')}</button>
                                    }
                                </div>
                            </div>
                    }
                    {
                        products.length > 0 ?
                        <div className="bag-products">
                            {
                                products.map((item, index) => (
                                    <ShoppingCard key={index} data={item} products={products} setProducts={setProducts} />
                                ))
                            }
                        </div> :
                        <div className='bag-text-center'>{t('message.no_products_shopping_bag')}</div>
                    }
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export default Shopping;