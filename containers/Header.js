import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import styles from '../styles/header.module.css';
import { FaSearch } from 'react-icons/fa';
import {MdLanguage} from 'react-icons/md';
import SubHeader from "@/components/SubHeader";
import Logo from '../public/images/logo.svg';
import { useRouter } from "next/router";
import { GrMenu } from 'react-icons/gr';
import LoginModal from "./LoginModal";
import { AuthContext } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import axios from '../utils/auth_axios';
import { getCookie } from 'cookies-next';
import Modal from "@/components/Modal";
import { locale } from "moment";
import Logo2 from '../public/images/logo-3.svg';

const HeaderIcons = dynamic(() => import('@/components/HeaderIcons'), {
    ssr: false,
});

const Header = (props) => {
    const { t, i18n } = useTranslation();

    const [mobileMenu, showMobileMenu] = useState(false);
    const [searchVisible, showSearch] = useState(false);
    const router = useRouter();
    const { isAuth, setIsAuth, visibleLoginModal, showLoginModal } = useContext(AuthContext);

    const { locales, locale: activeLocale } = router;

    useEffect(()=>{
        if(getCookie('login') === true){
            setIsAuth();
            localStorage.removeItem("user");
            showLoginModal(true);
        }
    },[]);

    const logout = async() =>{
        try{
            const response = await axios.post('/auth/logout',{},{
                withCredentials: true
            });
            localStorage.removeItem("user");
            setIsAuth();
            window.location = "/";
        }
        catch(e){}
    };

    return (
        <>
            <nav className={styles.nav_container}>
                <div className={styles.nav1}>
                    <div className={styles.nav1Container}>
                        <HeaderIcons onLogoutClick={()=>{logout();}} onLoginClick={()=>{showLoginModal(true);}}/>
                        <Link href="/" aria-label="Home page" className={styles.navLogo}>
                            <Image
                                fill
                                src={Logo}
                                alt="kenf logo"
                            />
                        </Link>
                        <div className={styles.nav1RightIcons}>
                            <div className={styles.language}>
                                <MdLanguage size={22}/>
                                <span>{activeLocale.toUpperCase()}</span>
                                <ul className={styles.languages_options}>
                                    {
                                        locales?.map((locale) => {
                                            const { pathname, query, asPath } = router;
                                            return (
                                                <Link aria-label={"Change language to "+locale} className={`${styles.languages_option} ${activeLocale === locale ? styles.lang_active : ""}`} key={"locale-" + locale} href={{ pathname, query }} as={asPath} locale={locale}>
                                                {locale.toUpperCase()}
                                                </Link>
                                            );
                                        })
                                    }
                                </ul>
                            </div>
                            <FaSearch size={18} onClick={()=>{showSearch(!visibleLoginModal)}} style={{ cursor: 'pointer' }}/>
                            <button aria-label="Menu open" onClick={()=>{showMobileMenu(true)}} className={styles.menuButton}>
                                <GrMenu size={18}/>
                            </button>
                        </div>
                    </div>
                </div>
                <SubHeader mobileMenu={mobileMenu} showMobileMenu={showMobileMenu} categories={props.categories} groups={props.groups}/>
            </nav>
            <LoginModal show={visibleLoginModal} onModalClose={()=>{showLoginModal(false);}} cancelable={false}/>
            <Modal show={searchVisible} onModalClose={()=>{showSearch(false);}} cancelable={true}>
                <div style={{border: 'none', paddingLeft: 10, paddingRight: 10, width: '100%', display: 'flex', flexDirection: 'column', gap: 20}} onClick={(e)=>{e.stopPropagation();}}>
                    <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 'fit-content' }}>
                        <Image
                            width={70}
                            src={Logo2}
                            alt="kenf logo"
                        />
                    </div>
                    <input dir={locale === 'ar' ? 'rtl' : 'ltr'} className="search focused" type="search" name="" placeholder={t('search')} style={{ padding: 5 }}/>
                </div>
            </Modal>
        </>
    );
};

export default Header;
