import {useContext} from "react";
import axios from "axios";
import Images from "../image_panel";
import { ServerURI } from "../../config";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";
import { CartContext } from "../../components/cart_context";

const ShoppingCard = props => {
    const { products, setProducts } = props;
    const { id, name_en, name_ar, ringSize, extra_price, images } = props.data;
    const { cartCount, setCartCount } = useContext(CartContext);
    const { t } = useTranslation();

    const onDelCart = key => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: products.filter(item => item.id != key).map(item => item.id)
        }

        axios.post(`${ServerURI}/settings/delCart`, postData)
            .then(res => {
                setCartCount(cartCount-1);
                setProducts(products.filter(item => item.id != key));
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="bag-product" >
            <div className="img">
                <Images src={ServerURI + '/getfile?id=' + (images[0]?.id ? images[0]?.id : images[0])} alt="img" width={140} height={140} />
            </div>
            <div className="info">
                <div className="title">{i18n.language === 'en' ? name_en : name_ar}</div>
                <div className="price">{extra_price} {t('sar')}</div>
                <div className="option">
                    <div className="size">
                        size : <span>{ringSize}</span>
                    </div>
                    
                </div>
            </div>
            <div className="delete">
                <i className="fa-solid fa-x" onClick={() => onDelCart(id)}></i>
            </div>
        </div>
    )
}

export default ShoppingCard;