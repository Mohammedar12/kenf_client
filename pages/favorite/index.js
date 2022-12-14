import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { AuthContext } from "../../components/auth_context";
import FavoriteCard from "../../components/favorite_card";
import { ServerURI } from "../../config";
import { useTranslation } from "react-i18next";

const Favorite = () => {
    const { isAuth } = useContext(AuthContext);
    const [favorite, setFavorite] = useState([]);
    const [cart, setCart] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (isAuth) {
            axios.get(`${ServerURI}/settings/favorite?token=${sessionStorage.getItem("token")}`)
                .then(res => {
                    setCart(res.data.cart)
                    setFavorite(res.data.favorite)
                })
                .catch(err => console.log(err));
        }
    }, [isAuth]);

    const onAddAllFavorite = () => {
        
        var postData = {
            token: sessionStorage.getItem("token"),
            product: favorite.map(item => item.id)
        }

        axios.post(`${ServerURI}/settings/cart`, postData)
            .then(res => {
                setCartCount(cartCount+(postData.product.length));
                toast.success('All favorite products have been added on cart', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            })
            .catch(err => console.log(err));
    }

    const onDelAllFavorite = () => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: []
        }

        axios.post(`${ServerURI}/settings/delFavorite`, postData)
            .then(res => {
                setFavorite([]);
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <section className="favorite" dir="auto">
                <div className="page-title">{t('favorite')}</div>
                <div className="container">
                    {
                        favorite.length > 0 &&
                            <div className="fav-btns">
                                <button className="add-all-to-bag" onClick={onAddAllFavorite}>{t('add_all_to_bag')}</button>
                                <button className="del-all" onClick={onDelAllFavorite}>{t('delete_all')}</button>
                            </div>
                    }
                    {
                        favorite.length > 0 ?
                            <div className="fav-products">
                                {
                                    favorite.map((item, index) => (
                                        <FavoriteCard key={index} data={item} favorite={favorite} setFavorite={setFavorite} cart={cart} setCart={setCart} toast={toast} />
                                    ))
                                }
                            </div> :
                            <div className="d-flex justify-content-center">{t('message.there_are_no_favorite_products')}</div>
                    }
                </div>
            </section>
            <ToastContainer />
        </>
    )
}

export default Favorite;