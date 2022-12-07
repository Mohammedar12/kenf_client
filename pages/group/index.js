import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Banner from "../../components/banner_panel";
import ShopByCategory from "../../containers/shopByCategory";
import ProductCard from "../../components/product_card";
import { ServerURI } from "../../config";

const Group = props => {
    const router = useRouter();
    const { getAllProducts, getAllCategories } = props;
    const [allProducts, setAllProducts] = useState(getAllProducts);
    
    useEffect(() => {
        setAllProducts(elements => [...elements.filter(item => item.group_id.id == router.query.group)])
    }, [router.query]);

    return (
        <>
            <Banner />

            <ShopByCategory datas={getAllCategories} />

            {
                allProducts.filter(item => !item.deleted && !item.hidden).length ?
                    <div className="products pt-3 pb-3">
                        <div className="container">
                            {
                                allProducts.filter(item => !item.deleted && !item.hidden).map((item, index) => (
                                    <ProductCard key={index} data={item} isSlide={false} />
                                ))
                            }
                        </div>
                    </div> :
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Sorry, There is no product :(</div>
            }
        </>
    )
}

export async function getServerSideProps() {
    const getAllProducts = await fetch(`${ServerURI}/product`);
    const allProducts = await getAllProducts.json();

    const getAllCategories = await fetch(`${ServerURI}/settings/items_category`);
    const allCategories = await getAllCategories.json();

    return {
        props: {
            getAllProducts: allProducts,
            getAllCategories: allCategories
        }
    }
}

export default Group;