import { useEffect } from 'react';
import { BannerCarousel } from '../../_service';
import { useResize } from '../../utils/helper';
import Images from '../image_panel';
import "animate.css"

const Banner = () => {
    const { width } = useResize();

    useEffect(() => {
        BannerCarousel();
    }, []);

    return (
        <section className="banners animate__animated animate__fadeInUp">
            <div className="banners-main owl-carousel owl-theme ">
                <div className="item">
                    {
                        width <= 700 ?
                            <Images src="images/bannn_mob_1.png" classnames="d-block img-fluid banners-mobail" alt="..." /> :
                            <Images src="images/banner1.png" classnames="d-block img-fluid banners-descktop" alt="..." />
                    }
                </div>
                <div className="item">
                    {
                        width <= 700 ?
                            <Images src="images/bannn_mob_2.png" classnames="d-block img-fluid banners-mobail" alt="..." /> :
                            <Images src="images/banner2.png" classnames="d-block img-fluid banners-descktop" alt="..." />
                    }
                </div>
            </div>
        </section>
    )
}

export default Banner;