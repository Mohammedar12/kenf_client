import React, { useEffect } from 'react';
// import { ExclusiveCarousel } from '../../_service';
import ExclusiveCard from '../../components/exclusive_card';
import { useTranslation } from 'react-i18next';

import dynamic from "next/dynamic";
import { fx } from "jquery";
const OwlCarousel = dynamic(() => import("react-owl-carousel"), {
  ssr: false,
});

const ExclusiveProducts = props => {
    const { datas } = props;

    const { t } = useTranslation();

//     useEffect(() => {
//         $(".exclusive-carousel").owlCarousel({
//             center: true,
//             loop: true,
//             margin: 10,
//             autoplay: true,
//             autoplaySpeed: 1000,
//             dragEndSpeed: 800,
//             nav: false,
//             dots: false,
//             responsive: {
//                 0: {
//                     items: 2,
//                 },
//                 600: {
//                     items: 2,
//                 },
//                 700: {
//                     items: 3,
//                 },
//                 1000: {
//                     items: 3,
//                 },
//             },
//         });
//     }, []);
    
    const responsive = {
  0: {
    items: 2,
  },
  600: {
    items: 2,
  },
  700: {
    items: 3,
  },
  1000: {
    items: 3,
  },
};


    return (
  <OwlCarousel
        className="exclusive-carousel owl-theme "
        responsive={responsive}
        center={true}
        loop
        margin={10}
        autoplay={true}
        autoplaySpeed={1000}
        dragEndSpeed={800}
        nav={false}
        dots={false}
      >
        {datas
          .filter((item) => item.isExclusive && !item.deleted && !item.hidden)
          .map((item, index) => (
            <ExclusiveCard key={index} data={item} />
          ))}
      </OwlCarousel>
    )
}

export default ExclusiveProducts;
