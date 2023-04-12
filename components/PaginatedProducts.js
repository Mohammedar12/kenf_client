import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/paginated_products.module.css';
import { useTranslation } from "next-i18next";
import { imageURI, ServerURI } from "../config";
import { useEffect, useState } from 'react';
import useSWRInfinite from 'swr/infinite';
import axios from '../utils/noauth_axios';
import ProductCard from './ProductCard';

const fetcher = async(url)=>{
    return (await axios.get(url)).data.data;
}

const PAGE_SIZE = 20;

const getQueryStringOfArray = (arr,key)=>{
    let query = '';
    for(let i=0;i<arr.length;i++){
        query += '&'+key+'[]='+arr[i];
    }
    return query;
}

const PaginatedProducts = (props) => {   
    const [groups, setGroups] = useState(props.groups);
    const [category, setCategory] = useState(props.cat_id);
    const [colors, setColors] = useState(props.colors);
    const [purities, setPurities] = useState(props.purities);
    const [collection, setCollection] = useState(props.collection_id);
    const [sortType, setSortType] = useState(props.sortType);

    const {
        data,
        mutate,
        size,
        setSize,
        isValidating,
        isLoading
      } = useSWRInfinite(
        (index) =>
          `product/?limit=${PAGE_SIZE}&page=${
            index + 1
          }${sortType && sortType != '' ?'&sort='+sortType : ''}${groups && groups.length != 0 ? getQueryStringOfArray(groups,'group') : ''}${category && category != '' ? '&category='+category : ''}${collection && collection != '' ? '&kenf_collection='+collection : ''}${colors && colors.length != 0 ? getQueryStringOfArray(colors,'color') : ''}${purities && purities.length != 0 ? getQueryStringOfArray(purities,'purity') : ''}`,
        fetcher,{
            revalidateOnFocus: false,
        }
      );

    const products = data ? [].concat(...(data.map((val)=>val.docs))) : [];
    const isReachingEnd = data && data.length != 0 ? data[data.length-1].hasNextPage === false : true;

    useEffect(()=>{
        setGroups(props.groups);
    },[props.groups]);

    useEffect(()=>{
        setCategory(props.cat_id);
    },[props.cat_id]);

    useEffect(()=>{
        setColors(props.colors);
    },[props.colors]);

    useEffect(()=>{
        setPurities(props.purities);
    },[props.purities]);

    useEffect(()=>{
        setCollection(props.collection_id);
    },[props.collection_id]);

    useEffect(()=>{
        setSortType(props.sortType);
    },[props.sortType]);

    return (
        <section className={styles.section}>
            <div className={styles.container}>
                { 
                    products.map((product,index)=>(
                        <div key={"products_"+product.id}>
                            <ProductCard product={product}/>
                        </div>
                    ))
                }
            </div>
            {
                isLoading && <div className='spinner'></div>
            }
            {
                !isLoading && !isReachingEnd ? <button onClick={()=>{setSize(size+1)}} className="load_more_btn">Load more</button> : <></>
            }
        </section>
    );
}

export default PaginatedProducts;