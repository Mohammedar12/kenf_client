import React, { useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthContext } from '../auth_context';
import Images from '../image_panel';
import "animate.css"
import i18n from '../../config/i18n';
import {Button} from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const Topbar = props => {
    const router = useRouter();
    const { products, cartCount , handleShow } = props;
    const { isAuth, setIsAuth, mobileTopbar, setMobileTopbar } = useContext(AuthContext);
    const [keyword, setKeyword] = useState('');
    const [isShow, setIsShow] = useState(false);

    
    

    const { t } = useTranslation();

    const [ selectedLanguage, setSelectedLanguage ] = useState(i18n.language);

    const changeLanguage = (lang) => {
        setSelectedLanguage(lang);
        i18n.changeLanguage(lang);
    }

    const onChange = e => {
        setKeyword(e.target.value);
    }

    const onLogout = () => {
        sessionStorage.removeItem("token");
        setIsAuth(false);
    }

    const onRedirect = e => {
        if (e.key === 'Enter') {
            setKeyword('');

            router.push({
                pathname: '/search',
                query: { keyword: keyword }
            })
        }
    }

    const closeModal = () => {
        $("#searchModal").modal('hide');
    }

    return (
        <nav className="nav animate__animated animate__fadeIn">
            <div className="container-fluid p-0">
                <nav className="main-nav p-1">
                    <div className="container">
                        <div className="top-nav position-relative d-flex justify-content-between align-items-center p-3 ">
                            <div className="left-content col-md-5 col-4 animate__animated animate__fadeIn">
                                <div className="left-content_container">

                                    <div className="bag-icon" style={{ position: 'relative' }}>
                                        <Link href="/shopping">
                                            <a>
                                                <i className="fa-solid fa-bag-shopping fa-1x p-md-2 p-sm-1"></i>
                                                {
                                                    cartCount && cartCount != 0 ?
                                                    <div className='px-1 text-white' style={{ position: 'absolute', background: 'red', top: -7, left: '75%', borderRadius: 5, fontSize: '0.55rem' }}>{cartCount}</div>
                                                    :
                                                    <></>
                                                }
                                            </a>
                                        </Link>
                                    </div>

                                    <div className="favorite-icon">
                                        <Link href="/favorite"><a>
                                            <i className="fa-solid fa-heart fa-1x p-md-2 p-sm-1"></i>
                                        </a></Link>
                                    </div>

                                    <div className=" user position-relative">
                                        <i className="fa-solid fa-user user-icon fa-1x p-md-2 p-sm-1"></i>
                                        <ul className=" user-list flex-column position-absolute gap-2">
                                            {
                                                isAuth ?
                                                    <>
                                                        <li><Link href='/profile'><a>{t('my_profile')}</a></Link></li>
                                                        <li><Link href='/orders'><a>{t('my_orders')}</a></Link></li>
                                                        <li><Link href='/'><a onClick={onLogout}>{t('logout')}</a></Link></li>
                                                    </> :
                                                    <li><Button variant='Light' type="button" className="bg-Light shadow-none p-0" onClick={handleShow}>{t('login')}</Button></li>
                                            }
                                        </ul>
                                    </div>

                                </div>
                            </div>
                            <div className="center-content col-md-2 col-4 animate__animated animate__fadeIn">
                                <div className="center-content_container">
                                    <div className="logo">
                                        <Link href="/"><a>
                                            <Images className="img-fluid" src="images/logo.svg" alt="" />
                                        </a></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="right-content col-md-5 col-4 animate__animated animate__fadeIn">
                                <div className="right-content_container">
                                    <div className="lang d-none d-md-flex align-items-center gap-1 pb-2 pt-2 position-relative">
                                        <i className="fa-solid fa-globe fa-1x"></i> <span className="fw-bold ar ">{selectedLanguage.toUpperCase()}</span>
                                        <ul className="list-lang ">
                                            <li className={"ar" + ( selectedLanguage === 'ar' ? ' active' : '' ) } onClick={()=>{changeLanguage('ar');}}>AR</li>
                                            <li className={"en" + ( selectedLanguage === 'en' ? ' active' : '' ) } onClick={()=>{changeLanguage('en');}}>EN</li>
                                        </ul>
                                    </div>
                                    <div tabIndex="0" className="search-box d-flex align-items-center ">
                                        <div tabIndex="0" className="search-box d-flex align-items-center" onClick={() => setIsShow(true)} data-bs-toggle="modal" data-bs-target="#searchModal">
                                            <i className="fa-solid fa-search fa-1x p-1"></i>
                                        </div>
                                    </div>
                                    <div className="bar" onClick={() => setMobileTopbar(!mobileTopbar)}>
                                        <i className="menu-bar fa-solid fa-bars fa-1x p-1"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
            <div className="login-modal modal fade" id="searchModal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="searchModal" aria-hidden="true" onClick={() => setKeyword('')}>
                <div className="modal-dialog modal-dialog-centered m-auto">
                    <div className="modal-content" style={{border: 'none'}}>
                        <input dir="rtl" className="search focused" type="search" name="" id="" value={keyword} onKeyDown={onRedirect} onChange={onChange} placeholder={t('search')} />
                        {
                            keyword.length >= 3 &&
                                <div className='search-hint'>
                                    <ul>
                                        {
                                            products.filter(item => !item.deleted && ( i18n.language === 'en' ? item.name_en.toLowerCase() : item.name_ar.toLowerCase() ).includes(keyword.toLowerCase())).length ? 
                                            products.filter(item => !item.deleted && ( i18n.language === 'en' ? item.name_en.toLowerCase() : item.name_ar.toLowerCase() ).includes(keyword.toLowerCase()))
                                                ?.map((item, index) => (
                                                    <Link key={index} href={{ pathname: '/search', query: { keyword: item.id } }}><li onClick={closeModal}>
                                                        <span>{i18n.language === 'en' ? item.name_en : item.name_ar}</span> <span>({i18n.language === 'en' ? (item.purity_id[0].name_en + ' ' + item.category_id.name_en) : (item.purity_id[0].name_ar + ' ' + item.category_id.name_ar) })</span>
                                                    </li></Link>
                                                )
                                            ) : 
                                            <div style={{padding: "3px 20px"}}>{t('message.no_result')}</div>
                                        }
                                    </ul>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Topbar;