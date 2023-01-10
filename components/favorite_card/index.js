import Link from "next/link";
import axios from "axios";
import Images from "../image_panel";
import { ServerURI } from "../../config";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { useContext } from "react";
import { CartContext } from "../cart_context";

const FavoriteCard = props => {
    const { favorite, setFavorite, cart, setCart, toast } = props;
    const { id, name_en, name_ar, extra_price, images } = props.data;
    const { cartCount, setCartCount } = useContext(CartContext);
    const { t } = useTranslation();

    const onAddFavorite = () => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: [...cart.filter(item => item.id != id).map(item => item.id), id]
        }

        axios.post(`${ServerURI}/settings/cart`, postData)
            .then(res => {
                setCartCount(cartCount+1);
                toast.success('Favorite product has been added on cart', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            })
            .catch(err => console.log(err));
    }

    const onDelFavorite = () => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: favorite.filter(item => item.id != id).map(item => item.id)
        }

        axios.post(`${ServerURI}/settings/delFavorite`, postData)
            .then(res => {
                setFavorite(favorite.filter(item => item.id != id));
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <div className="fav-product">
                <Link href={{ pathname: '/products', query: { product: id } }}><a>
                    <div className="img-box">
                        <Images src={ServerURI + '/getfile?id=' + images[0]} alt="" />
                    </div>
                </a></Link>
                <div className="product-footer" dir="auto">
                    <div className="info">
                        <h5 className="title">{i18n.language === 'en' ? name_en : name_ar}</h5>
                        <span className="price">{extra_price} {t('sar')}</span>
                    </div>
                    <div className="btns">
                        <button className="del" onClick={onDelFavorite}><i className="fa-solid fa-trash"></i></button>
                        <button className="add-bag" onClick={onAddFavorite}>{t('add_to_bag')}</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FavoriteCard;