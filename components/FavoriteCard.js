import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { imageURI } from "@/config";
import { FaTrash } from 'react-icons/fa';
import axios from "../utils/auth_axios";

export default function FavoriteCard({ data, addedToCart, deleteFromFavorite, displayErrorMessage }){

    const { t, i18n } = useTranslation();

    const [favData, setFavData] = useState(data);
    const [loading, setLoading] = useState(false);

    useState(()=>{
        setFavData(data);
    },[data]);

    const addToCart = async()=>{
        setLoading(true);
        try{
            const res = await axios.post('/user/cart',{ products: [{ id: favData.product.id, quantity: 1 }] });
            addedToCart(favData.product.id);
        }
        catch(e){
            if(e.response?.data?.message){
                displayErrorMessage(e.response.data.message)
            }
            else{
                displayErrorMessage(e.message);
            }
        }
        setLoading(false);
    }

    const deleteFavorite = async()=>{
        setLoading(true);
        try{
            const res = await axios.delete('/user/favorite/'+ favData.product.id );
            deleteFromFavorite(favData.product.id);
        }
        catch(e){
            if(e.response?.data?.message){
                displayErrorMessage(e.response.data.message)
            }
            else{
                displayErrorMessage(e.message);
            }
        }
        setLoading(false);
    }

    return (
        <div className="fav-product">
            <Link href={'/product/'+favData.product?.id}>
                <div className="img-box">
                    <Image fill src={favData.product?.mainImage ? (imageURI + favData.product.mainImage.link) : ( favData.product?.images && favData.product.images.length > 0 ? (imageURI + favData.product.images[0].link) : '') } alt="" />
                </div>
            </Link>
            <div className="product-footer" dir="auto">
                <div className="info">
                    <h5 className="title">{ i18n.language === 'en' ? favData.product?.name_en : favData.product?.name_ar }</h5>
                    <span className="price">{favData.product?.extra_price} {t('sar')}</span>
                </div>
                {
                    loading ?
                        <div className="spinner btns" style={{ opacity: 1, bottom: '80px' }}></div>
                    :
                        <div className="btns">
                            <button className="del" onClick={()=>{deleteFavorite();}}><FaTrash className="fa-solid fa-trash" /></button>
                            {
                                favData.product?.outofStock === false ? 
                                <button className="add-bag" onClick={()=>{addToCart();}}>{t('add_to_bag')}</button>
                                :
                                <button className="add-bag" style={{ background: 'var(--sec-color)' }} disabled>Out Of Stock</button>
                            }
                        </div>
                }
            </div>
        </div>
    );
}