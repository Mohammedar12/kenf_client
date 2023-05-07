import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaShoppingBag, FaHeart, FaUser } from 'react-icons/fa';
import Link from "next/link";
import styles from "../styles/header_icons.module.css";
import { useTranslation } from "next-i18next";

export default function HeaderIcons(props){

    const { t, i18n } = useTranslation();
    const { isAuth } = useContext(AuthContext);
    const { onLoginClick, onLogoutClick } = props;

    return (
        <div className={styles.container}>
            <Link href="/shopping" aria-label="Shopping cart" style={{ padding:'3px' }}>
                <FaShoppingBag size={18}/>
            </Link>
            {
                isAuth ?
                    <Link href="/favorite" aria-label="Favorite products" style={{ padding:'3px' }}>
                        <FaHeart size={18}/>
                    </Link>
                :
                <></>
            }
            <div className={styles.user_button}>
                <FaUser size={18}/>
                <div className={styles.user_options}>
                    {
                        isAuth ?
                            <>
                                <Link href="/profile" className={styles.user_option}>{t("my_profile")}</Link>
                                <Link href="/orders" className={styles.user_option}>{t("my_orders")}</Link>
                                <button onClick={(e)=>{onLogoutClick();}} className={styles.user_option}>{t("logout")}</button>
                            </>
                        :
                        <button onClick={(e)=>{onLoginClick();}} className={styles.user_option}>{t("login")}</button> 
                    }
                </div>
            </div>
        </div>
    );
}