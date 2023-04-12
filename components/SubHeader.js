import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import styles from "../styles/sub_header.module.css";
import {MdLanguage} from 'react-icons/md';
import { useRouter } from "next/router";

const SubHeader = props => {
    const { categories, groups, mobileMenu, showMobileMenu } = props;
    const { t, i18n } = useTranslation();
    const [ expandedIndexMobileMenu, setExpandedIndexMobileMenu ] = useState();
    const router = useRouter();
    const { locales, locale: activeLocale } = router;

    return (
        <>
            <div className={styles.sub_header_container}>
                <div className={styles.groups}>
                    {
                        groups && groups.map((group,index)=>(
                            <div className={styles.group_link} key={"sub_header_group_"+index}>
                                <Link aria-label={i18n.language === 'en' ? group.name_en : group.name_ar} href={`/group/${encodeURIComponent(group.id)}`}>{i18n.language === 'en' ? group.name_en : group.name_ar}</Link>
                                <div className={styles.expandable}>
                                    <h5 className={styles.group_heading}>{i18n.language === 'en' ? group.name_en : group.name_ar}</h5>
                                    <ul className={styles.group_links}>
                                        {
                                            categories.map((category,cat_index)=>(
                                                <Link aria-label={i18n.language === 'en' ? category.name_en : category.name_ar} className={styles.cat_link} href={'/category/'+category.id+'/'+group.id} key={'sub_header_category_'+cat_index}>
                                                    <span className={styles.cat_link_text}>{i18n.language === 'en' ? category.name_en : category.name_ar}</span>
                                                </Link>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                mobileMenu ?
                <div onClick={()=>{setExpandedIndexMobileMenu();showMobileMenu(false);}} className={styles.transBg}>
                    <ul className={styles.mobileMenu}>
                        {
                            groups && groups.map((group,index)=>(
                                <React.Fragment key={"mobile_menu_links_" +index}>
                                    <li>
                                        <button
                                            onClick={(e)=>{
                                                if(index === expandedIndexMobileMenu){
                                                    setExpandedIndexMobileMenu();
                                                }
                                                else{
                                                    setExpandedIndexMobileMenu(index);
                                                }
                                                e.stopPropagation();
                                            }} 
                                            className={`${styles.mobile_menu_expandable_button} ${index === expandedIndexMobileMenu ? styles.mobile_menu_expandable_button_active : ''}`}
                                            >
                                                {i18n.language === 'en' ? group.name_en : group.name_ar}
                                        </button>
                                    </li>
                                    <div className={`${styles.mobile_menu_collapsable} ${expandedIndexMobileMenu === index ? styles.mobile_menu_expand : ''}`}>
                                        <>
                                            <Link aria-label={i18n.language === 'en' ? group.name_en : group.name_ar} className={styles.mobile_group_title} href={`/group/${encodeURIComponent(group.id)}`}>
                                                {i18n.language === 'en' ? group.name_en : group.name_ar}
                                            </Link>
                                        {
                                            categories.map((category,cat_index)=>(
                                                <Link aria-label={i18n.language === 'en' ? category.name_en : category.name_ar} className={styles.mobile_menu_link} key={"mobile_cat_links_"+cat_index} href={'/category/'+group.id+'/'+category.id}>
                                                    {i18n.language === 'en' ? category.name_en : category.name_ar}
                                                </Link>
                                            ))
                                        }
                                        </>
                                    </div>
                                </React.Fragment>
                            ))
                        }
                        <li>
                            <button
                                aria-label="Expand change language menu"
                                onClick={(e)=>{
                                    if(3 === expandedIndexMobileMenu){
                                        setExpandedIndexMobileMenu();
                                    }
                                    else{
                                        setExpandedIndexMobileMenu(3);
                                    }
                                    e.stopPropagation();
                                }} 
                                className={`${styles.mobile_menu_expandable_button} ${styles.mobile_lang_btn} ${3 === expandedIndexMobileMenu ? styles.mobile_menu_expandable_button_active : ''}`}
                                >
                                    <MdLanguage size={16}/>
                                    <span>{i18n.language.toUpperCase()}</span>
                            </button>
                        </li>
                        <div className={`${styles.mobile_menu_collapsable} ${expandedIndexMobileMenu === 3 ? styles.mobile_menu_expand : ''}`}>
                            {
                                locales.map((locale)=> {
                                    const { pathname, query, asPath } = router;
                                    return (
                                        <Link aria-label={"Change language to "+locale} className={`${styles.mob_languages_option} ${activeLocale === locale ? styles.mob_lang_active : ""}`} key={"mob_locale-" + locale} href={{ pathname, query }} as={asPath} locale={locale}>
                                            {locale.toUpperCase()}
                                        </Link>
                                    )
                                })
                            }
                        </div>
                    </ul>
                </div>
                :
                <></>
            }
        </>
    )
}

export default SubHeader;