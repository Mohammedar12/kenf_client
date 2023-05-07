import { useEffect, useState, useContext } from 'react';
import { useResize } from "../utils/helper";
import { AuthContext } from '../context/AuthContext';
import Link from 'next/link';
import { useTranslation } from "next-i18next";
import { useRouter } from 'next/router';
import { FaShoppingBag } from 'react-icons/fa';

export default function BuyButton(props) {

    const { t, i18n } = useTranslation();

    const { isSmallScreen } = useResize();
    const { isAuth, showLoginModal } = useContext(AuthContext);
    const { outofStock, onAddToCart, loading, isCart, products } = props;
    const hideAddToCart = props.hideAddToCart;
    const buyNowText = props.buyNowText ? props.buyNowText : t('buy_now');

    const router = useRouter();

    if(props.onlyMobile === true){
        if(!isSmallScreen){
            return <></>
        }
    }

    if(props.onlyDesktop === true){
        if(isSmallScreen){
            return <></>
        }
    }

    if(loading){
      return(
        <div className='spinner' style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '1rem' }}></div>
      );
    }

    return (
        <>
        <div
          className={"btns "}
          style={
            !isSmallScreen
              ? { backgroundColor: "" }
              : outofStock !== true
              ? {  }
              : { backgroundColor: "#f7e8d2" }
          }
        >
          {
            hideAddToCart !== true ? 
            <>
              {outofStock !== true ? (
                <button
                  className="add-bag"
                  onClick={()=>{onAddToCart();}}
                  style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center' }}
                  // disabled={currentProduct.quantity > 0 ? false : "true"}
                >
                  {!isSmallScreen &&
                    (outofStock !== true
                      ? t("add_to_bag")
                      : "Out Of Stock")}
                    <FaShoppingBag className='' color='white' size={18}/>
                      
                </button>
              ) : (
                <div className="out_of_stock">
                  <h6>Out Of Stock</h6>
                </div>
              )}
            </>
            :
            <></>
          }

          {isAuth && outofStock !== true ? (
            <Link
              style={{ flex: '1 1' }}
              href={{
                pathname: "/checkout",
                query: { products: products, cart: isCart === true },
              }}
            >
              <button className="buy-now" style={{ width: '100%'  }}>{buyNowText}</button>
            </Link>
          ) : outofStock !== true ? (
            <button className="buy-now" onClick={()=>{showLoginModal(true);}}>
              {buyNowText}
            </button>
          ) : (
            ""
          )}
        </div>
      </>
    );

}