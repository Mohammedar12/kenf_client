import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProductCard from "../../components/product_card";
import { ServerURI } from "../../config";

const Search = props => {
    const router = useRouter();
    const { getAllProducts } = props;
    const [allProducts, setAllProducts] = useState(getAllProducts);

    useEffect(() => {
        setAllProducts([...getAllProducts.filter(item => item.id == router.query.keyword)]);
    }, [router.query]);

    return (
        <>
            {
                allProducts.length ?
                    <div className="products pt-3 pb-3">
                        <div className="container">
                            {
                                allProducts?.filter(item => !item.deleted && !item.hidden)
                                    .map((item, index) => (
                                    <ProductCard key={index} data={item} isSlide={false} />
                                ))
                            }
                        </div>
                    </div> :
                    <div style={{height: 100, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Sorry, There is no result for your search :(</div>
            }
        </>
    )
}

export async function getServerSideProps() {
    const getAllProducts = await fetch(`${ServerURI}/product`);
    const allProducts = await getAllProducts.json();

    return {
        props: {
            getAllProducts: allProducts,
        }
    }
}

export default Search;