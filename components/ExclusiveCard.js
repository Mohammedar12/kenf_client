import React from "react";
import Link from "next/link";
import Image from 'next/image';
import { imageURI } from "../config";
import { useTranslation } from "next-i18next";
import styles from "../styles/exclusive_card.module.css";

const ExclusiveCard = props => {
    const { id, name_en, name_ar, images, mainImage } = props.product;
    const { t, i18n } = useTranslation();
    
    let imageLink = '';
    if(images && images.length > 0){
        imageLink = images[0].link;
    }
    if(mainImage && mainImage != null){
        imageLink = mainImage.link;
    }
    return (
        <div className={`${styles.card_container} ${props.isActive ? styles.card_container_active : ''} keen-slider__slide`}>
            <Link aria-label={i18n.language === 'en' ? name_en : name_ar} href={`product/${encodeURIComponent(id)}`} className={`${styles.card} ${props.isActive ? styles.card_active : ''}`}>
                <Image loading="eager" className={`${styles.card_image}`} quality={50} fill src={imageURI + imageLink} alt={i18n.language === 'en' ? name_en : name_ar} sizes='(max-width: 750px) 40vw, 300px'/>
                <div className={styles.info}>
                    <h4 className={styles.product_title} suppressHydrationWarning>{i18n.language === 'en' ? name_en : name_ar}</h4>
                </div>
            </Link>
        </div>
        
    )
}

export default ExclusiveCard;