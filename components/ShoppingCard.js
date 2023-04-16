import {useContext, useState} from "react";
import axios from "../utils/auth_axios";
import Image from "next/image";
import { useTranslation } from "next-i18next";
//import { CartContext } from "../../components/cart_context";
import { AuthContext } from "../context/AuthContext";
import { imageURI } from "@/config";
import { IoIosClose } from 'react-icons/io';

const ShoppingCard = props => {
    const { id, name_en, name_ar, ringSize, extra_price, images, mainImage } = props.data;
    const { isAuth } = useContext(AuthContext);
    //const { cartCount, setCartCount } = useContext(CartContext);
    const { t, i18n } = useTranslation();
    const [ deleteLoading, setDeleteLoading ] = useState(false);

    const onDelCart = async(key) => {
        try{
            setDeleteLoading(true);
            const responseUpdate = await axios.post('/user/cart',{ products:[{id: key, quantity: 0}] });
            props.deletedProduct(key);
        }
        catch(e){
            console.log(e);
        }
        setDeleteLoading(false);
    }

    return (
        <div className="bag-product" >
            <div className="img" style={{ position: 'relative' }}>
                <Image src={imageURI + ( mainImage?.link ?  mainImage.link : images[0]?.link )} fill alt="img" style={{ objectFit: 'contain' }}/>
            </div>
            <div className="info">
                <div className="title">{i18n.language === 'en' ? name_en : name_ar}</div>
                <div className="price">{extra_price} {t('sar')}</div>
                <div className="option">
                    <div className="size">
                        size : <span>{ringSize ? ( i18n.language === 'en' ? ringSize.name_en : ringSize.name_ar ) : ''}</span>
                    </div>
                    
                </div>
            </div>
            <div className="delete" style={{ left: 'unset !important' }}>
                {
                    deleteLoading ? 
                    <div className="spinner" style={{ height: 20, width: 20, borderTopColor: 'white'}}></div>
                    :
                    <IoIosClose className="" style={{ cursor: 'pointer' }} size={20} color="white" onClick={() => onDelCart(id)} />
                }
            </div>
        </div>
    )
}

export default ShoppingCard;