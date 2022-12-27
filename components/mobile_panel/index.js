import Link from 'next/link';
import React, { useContext, useState } from "react";
import { AuthContext } from '../auth_context';
import { useResize } from "../../utils/helper";
import i18n from '../../config/i18n';
import { useTranslation } from "react-i18next";

const Mobile = props => {
    const { groups, categories } = props;
    const { isMobile } = useResize();
    const { mobileTopbar } = useContext(AuthContext);

    const { t } = useTranslation();

    const [ selectedLanguage, setSelectedLanguage ] = useState(i18n.language);

    const changeLanguage = (lang) => {
        setSelectedLanguage(lang);
        i18n.changeLanguage(lang);
    }

    return (
        <>
            <div dir="rtl" className={"menu-mob accordion accordion-flush " + (mobileTopbar && isMobile && "menu-mob-show")} id="accordionFlushExample">
                {
                    groups.map((item, index) => (
                        <div key={index} className="accordion-item">
                            <h2 className=" text-center accordion-header" id={`flush-heading-${index}`}>
                                <button className={`group ${item.name_en.toLowerCase()}-group accordion-button collapsed`} type="button" data-bs-toggle="collapse"
                                    data-bs-target={`#flush-collapse-${index}`} aria-expanded="false" aria-controls={`flush-collapse-${index}`}>
                                    {i18n.language === 'en' ? item.name_en : item.name_ar}
                                </button>
                            </h2>
                            <div id={`flush-collapse-${index}`} className="accordion-collapse collapse" aria-labelledby={`flush-heading-${index}`}
                                data-bs-parent="#accordionFlushExample">
                                <ul className={`category-mob category-${item.name_en} d-flex text-center flex-column gap-1 align-items-center pt-2`}>
                                    <h5 className="fw-bold"><Link href={{ pathname: '/group', query: { group: item.id } }}><a>{i18n.language === 'en' ? item.name_en : item.name_ar}</a></Link></h5>
                                    <div className="links d-flex gap-3 flex-column">
                                        {
                                            categories.filter(item => !item.deleted).map((element, key) => (
                                                <Link key={key} href={{ pathname: '/category', query: { category: element.id, group: item.id } }}><a>{i18n.language === 'en' ? element.name_en : element.name_ar}</a></Link>
                                            ))
                                        }
                                    </div>
                                </ul>
                            </div>
                        </div>
                    ))
                }
                <div className="accordion-item lang-mob">
                    <h2 className=" text-center accordion-header " id="flush-headingLang">
                        <button className="group gold-group accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseLang" aria-expanded="false" aria-controls="flush-collapseLang">
                            <i className="fa-solid fa-globe"></i> <span className="fw-bold ar ">{selectedLanguage.toUpperCase()}</span>
                        </button>
                    </h2>
                    <div id="flush-collapseLang" className=" list-lang accordion-collapse collapse"
                        aria-labelledby="flush-headingLang" data-bs-parent="#accordionFlushExample">
                        <ul className="list-lang d-flex m-0 p-0 flex-column gap-1 align-items-center">
                            <li className={"ar" + ( selectedLanguage === 'ar' ? ' active' : '' ) } onClick={()=>{changeLanguage('ar');}}>AR</li>
                            <li className={"en" + ( selectedLanguage === 'en' ? ' active' : '' ) } onClick={()=>{changeLanguage('en');}}>EN</li>
                        </ul>
                    </div>
                </div>
            </div>
            {
                !isMobile &&
                    <nav className="btm-nav d-flex justify-content-center p-2 mt-1">
                        <div className="container d-flex justify-content-center">
                            <ul className=" desktop-list d-flex align-items-center gap-2 fw-bold m-0 position-relative p-0">
                                {
                                    groups.map((item, index) => (
                                        <div key={index} className="groups ps-2 pe-2">
                                            <li className={`group ${item.name_en}-group`}><Link href={{ pathname: '/group', query: { group: item.id } }}><a>{i18n.language === 'en' ? item.name_en : item.name_ar}</a></Link></li>
                                            <ul className={`category category-${item.name_en} d-flex text-center flex-column gap-1 align-items-center pt-2`}>
                                                <h5 className="fw-bold">{i18n.language === 'en' ? item.name_en : item.name_ar}</h5>
                                                <div className="links d-flex gap-3">
                                                    {
                                                        categories.filter(item => !item.deleted && !item.isKenf).map((element, key) => (
                                                            <li key={key}><Link href={{ pathname: '/category', query: { category: element.id, group: item.id } }}><a>{i18n.language === 'en' ? element.name_en : element.name_ar}</a></Link></li>
                                                        ))
                                                    }
                                                </div>
                                            </ul>
                                        </div>
                                    ))
                                }
                            </ul>
                        </div>
                    </nav>
            }
        </>
    )
}

export default Mobile;