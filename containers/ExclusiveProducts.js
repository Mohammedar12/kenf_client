import { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from '../styles/exclusive_products.module.css';
import { useTranslation } from "next-i18next";
import ExclusiveCard from '@/components/ExclusiveCard';

const ExclusiveProducts = (props) => {   
    const { exclusive_products } = props;
    const { t } = useTranslation('common');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slides:{
            origin: "center",
            number: exclusive_products && exclusive_products.length,
            perView: 3,
            spacing: 30,
        },
        breakpoints: {
            '(max-width: 750px)': {
                mode: "snap",
                loop: true,
                slides:{
                    perView: 2,
                    spacing: 30,
                    origin: "center",
                }
            },
        },
        slideChanged(slider){
            setCurrentSlide(slider.track.details.rel);
        },
        renderMode: 'performance',
        defaultAnimation: { duration: 500, easing: (t) => t },
    },[
        (slider) => {
        let timeout;
        function clearNextTimeout() {
            clearTimeout(timeout);
        }
        function nextTimeout() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                slider.next();
            }, 2000);
        }
        slider.on("created", () => {
            nextTimeout();
        })
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
        },
    ]);

    if(!exclusive_products || exclusive_products.length == 0){
        return <></>;
    }
    
    return (
        <section className={styles.section}>
            <h2 className={styles.section_title} suppressHydrationWarning> {t("exclusive_products")} </h2>
            <div ref={sliderRef} className={`${styles.slider} keen-slider`}>
                 {  exclusive_products.map((exclusive_product,index) => (
                    <ExclusiveCard key={"exclusive_product_"+index} product={exclusive_product} isActive={currentSlide === index}/>
                 ))
                }
            </div>
        </section>
    );
}

export default ExclusiveProducts;
