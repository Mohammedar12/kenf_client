import React, { useEffect } from 'react';
// import { ExclusiveCarousel } from '../../_service';
import ExclusiveCard from '../../components/exclusive_card';

const ExclusiveProducts = props => {
    const { datas } = props;

    useEffect(() => {
        $(".exclusive-carousel").owlCarousel({
            center: true,
            loop: true,
            margin: 10,
            autoplay: true,
            autoplaySpeed: 1000,
            dragEndSpeed: 800,
            nav: false,
            dots: false,
            responsive: {
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
            },
        });
    }, []);

    return (
        <section className="exclusive pt-md-3 pb-md-3 pt-1 pb-1 position-relative ">
            <h3 className="section-title">Exclusive Products</h3>
            <div className="exclusive-carousel owl-carousel owl-theme ">
                {
                    datas.filter(item => item.isExclusive && !item.deleted && !item.hidden).map((item, index) => (
                        <ExclusiveCard key={index} data={item} />
                    ))
                }
            </div>
        </section>
    )
}

export default ExclusiveProducts;