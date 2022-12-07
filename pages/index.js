import React from 'react';
import Script from 'next/script';
import Head from 'next/head';
import Images from '../components/image_panel';
import { ServerURI } from '../config';

import Banner from '../components/banner_panel';
import CategoryImgPanel from '../containers/categoryImgPanel';
import ExclusiveProducts from '../containers/exclusiveProducts';
import ShopByCategory from '../containers/shopByCategory';
import KenfCategory from '../containers/KenfCategory';

const Home = props => {
    const { getAllProducts, getAllGroups, getAllCategories } = props;
    
    return (
        <>
            <Banner />

            <CategoryImgPanel datas={getAllGroups} />

            <ExclusiveProducts datas={getAllProducts} />

            <section className="small-banner pt-3 pb-2">
                <div className="container-fluid p-0">
                    <div className="banner">
                        <Images classnames="banners-descktop pe-md-5 ps-md-5 pe-sm-1 ps-sm-1 " src="images/small-banner.png" alt="" />
                        <Images classnames="banners-mobail " src="images/small-banner-mob.png" alt="" />
                    </div>
                </div>
            </section>

            <ShopByCategory datas={getAllCategories} />

            <KenfCategory datas={getAllCategories} />
        </>
    )
}

export async function getServerSideProps() {
    const getAllProducts = await fetch(`${ServerURI}/product`);
    const allProducts = await getAllProducts.json();

    const getAllGroups = await fetch(`${ServerURI}/settings/items_group`);
    const allGroups = await getAllGroups.json();

    const getAllCategories = await fetch(`${ServerURI}/settings/items_category`);
    const allCategories = await getAllCategories.json();
    
    return {
        props: {
            getAllProducts: allProducts,
            getAllGroups: allGroups,
            getAllCategories: allCategories,
        }
    }
}

export default Home;