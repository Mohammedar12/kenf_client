import { useEffect } from 'react';
import { BannerCarousel } from '../../_service';
import { useResize } from '../../utils/helper';
import Images from '../image_panel';
import "animate.css"

import dynamic from "next/dynamic";
import { fx } from "jquery";
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

const responsive = {
  0: {
    items: 1,
  },
};

const Banner = () => {
    const { width } = useResize();

//     useEffect(() => {
//         BannerCarousel();
//     }, []);

    return (
        <OwlCarousel
        className="banners-main owl-theme  "
        loop
        margin={10}
        nav
        navSpeed={1000}
        autoplay={true}
        autoplaySpeed={2000}
        dotsSpeed={800}
        dragEndSpeed={800}
        responsive={responsive}
      >
        <div className="item">
          {width <= 700 ? (
            <Images
              src="images/bannn_mob_1.png"
              classnames="d-block img-fluid banners-mobail"
              alt="..."
            />
          ) : (
            <Images
              src="images/banner1.png"
              classnames="d-block img-fluid banners-descktop"
              alt="..."
            />
          )}
        </div>
        <div className="item">
          {width <= 700 ? (
            <Images
              src="images/bannn_mob_2.png"
              classnames="d-block img-fluid banners-mobail"
              alt="..."
            />
          ) : (
            <Images
              src="images/banner2.png"
              classnames="d-block img-fluid banners-descktop"
              alt="..."
            />
          )}
        </div>
      </OwlCarousel>
    )
}

export default Banner;
