import styles from '../styles/product_card.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from "next-i18next";
import { imageURI } from '@/config';

export default function ProductCard(props){

    const { id, name_en, name_ar, images, mainImage, extra_price } = props.product;
    const { t, i18n } = useTranslation();

    let imageLink = '';
    if(images && images.length > 0){
        imageLink = imageURI + images[0].link;
    }
    if(mainImage && mainImage != null){
        imageLink = imageURI + mainImage.link;
    }

    return(
        <Link href={`/product/${encodeURIComponent(id)}`} className={`${styles.card} ${props.className ? props.className : ''}`}>
            <div className={`${styles.imageContainer}`}>
                <Image sizes='(max-width: 650px) 150px,300px' src={imageLink} fill className={styles.card_image} alt={i18n.language === 'en' ? name_en : name_ar}/>
            </div>
            <div className={styles.info}>
                <h5 className={styles.title}>{i18n.language === 'en' ? name_en : name_ar}</h5>
                <span className={styles.price}>{extra_price} SAR</span>
            </div>
        </Link>
    );
}