
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/category_images.module.css';
import { useTranslation } from "next-i18next";
import { imageURI } from "../config";

const ProductGroupImages = (props) => {   
    const { product_groups } = props;
    const { t, i18n} = useTranslation();
 
    if(!product_groups){
        return <></>;
    }

    return (
        <section className={styles.container}>
            {
                product_groups.map((product_group, index) => (
                    <Link aria-label={i18n.language === 'en' ? product_group.name_en : product_group.name_ar} key={index} href={`/group/${encodeURIComponent(product_group.id)}`} className={styles.category}>
                        <h4 className={styles.group_name} suppressHydrationWarning>{i18n.language === 'en' ? product_group.name_en : product_group.name_ar}</h4>
                        <Image loading='eager' className={styles.group_image} quality={50} fill src={product_group.images &&  product_group.images.length > 0 ? ( imageURI + product_group.images[0].link ) : ''} alt={i18n.language === 'en' ? product_group.name_en : product_group.name_ar} sizes='@media (max-width: 395px) 550px, 620px'/>
                    </Link>
                ))
            }
        </section>
    );
}

export default ProductGroupImages;
