import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Banner from "../../components/banner_panel";
import Filter from "../../components/filter_panel";
import ProductCard from "../../components/product_card";
import { ServerURI } from "../../config";

const Category = props => {
    const router = useRouter();
    const { getAllProducts, getAllPurities, getAllGroups } = props;
    const [allProducts, setAllProducts] = useState(getAllProducts);
    const [sortType, setSortType] = useState(0);
    const [filterType, setFilterType] = useState([
        { name: 'metal', filter: [] },
        { name: 'purity', filter: [] },
        { name: 'color', filter: [] },
    ]);

    useEffect(() => {
        if (router.query.category) {
            if (router.query.group) 
                setAllProducts(elements => [...elements.filter(item => item.group_id.id == router.query.group && (item.category_id.id == router.query.category || item.kenf_id == router.query.category))])
            else
                setAllProducts(elements => [...elements.filter(item => item.category_id.id == router.query.category || item.kenf_id == router.query.category)])
        } else {
            setAllProducts(elements => [...elements.filter(item => item.group_id.id == router.query.group)])
        }
    }, [router.query]);

    useEffect(() => {
        if (sortType == 1) {
            setAllProducts(elements => [...elements.sort((a, b) => a.extra_price > b.extra_price ? 1 : -1)]);
        }
        else if (sortType == 2) {
            setAllProducts(elements => [...elements.sort((a, b) => a.extra_price < b.extra_price ? 1 : -1)]);
        }
        else if (sortType == 3) {
            setAllProducts(elements => [...elements.sort((a, b) => a.visited < b.visited ? 1 : -1)]);
        }
        else if (sortType == 4) {
    
        }
    }, [sortType]);

    return (
        <>
            <Banner />

            <Filter purities={getAllPurities} groups={getAllGroups} setSortType={setSortType} filterType={filterType} setFilterType={setFilterType} />

            {
                allProducts?.filter(item => !item.deleted && !item.hidden && (filterType[0].filter.length ? filterType[0].filter.includes(item.group_id.id) : true) && (filterType[1].filter.length ? filterType[1].filter.includes(item.purity_id[0].id) : true) && (filterType[2].filter.length ? filterType[2].filter.includes(item.color) : true)).length ? 
                    <div className="products pt-3 pb-3">
                        <div className="container">
                            {
                                allProducts?.filter(item => !item.deleted && !item.hidden)
                                    .filter(item => filterType[0].filter.length ? filterType[0].filter.includes(item.group_id.id) : true)
                                    .filter(item => filterType[1].filter.length ? filterType[1].filter.includes(item.purity_id[0].id) : true)
                                    .filter(item => filterType[2].filter.length ? filterType[2].filter.includes(item.color) : true)
                                    .map((item, index) => (
                                        <ProductCard key={index} data={item} isSlide={false} />
                                ))
                            }
                        </div>
                    </div> :
                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Sorry, There is no product :(</div>
            }
        </>
    )
}

export async function getServerSideProps() {
    // GET Product
    const getAllProducts = await fetch(`${ServerURI}/product`);
    const allProducts = await getAllProducts.json();

    // GET Purity
    const getAllPurities = await fetch(`${ServerURI}/settings/purity`);
    const allPurities = await getAllPurities.json();

    // GET group
    const getAllGroups = await fetch(`${ServerURI}/settings/items_group`);
    const allGroups = await getAllGroups.json();

    return {
        props: {
            getAllProducts: allProducts,
            getAllPurities: allPurities,
            getAllGroups: allGroups
        }
    }
}

export default Category;