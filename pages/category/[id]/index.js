import Head from 'next/head'
import { getAppData } from '../../../utils/get_app_data';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import Banner from '@/components/Banner';
import PaginatedProducts from '@/components/PaginatedProducts';
import { useRouter } from 'next/router';
import { fetchCache } from '../../../utils/cache';
import axios from '../../../utils/noauth_axios';
import Filters from '@/components/Filters';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { imageURI } from '../../../config';

export default function Category({ category, groups, purities }) {
  
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [colors, setColors] = useState([]);
  const [purity, setPurity] = useState([]);
  const [filterGroups, setFilterGroups] = useState([]);
  const [sortType, setSortType] = useState();
  const [filterType, setFilterType] = useState([
    { name: "metal", filter: [] },
    { name: "purity", filter: [] },
    { name: "color", filter: [] }
  ]);

  return (
    <>
      <Head>
        <title>{i18n.language === 'ar' ? 'Kenf '+category?.name_ar : 'Kenf '+category?.name_en}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/SVG/logo-3.svg" />
      </Head>
      <main>
        <Banner />
        {category.heroProduct !== undefined ? (
            <section className="special_product">
            <h3 className="section-title"> {t("special_product")} </h3>
            <div className="container">
                <div className="special_product_card">
                <div className="img"  style={{ position: "relative" }}>
                    <Image
                    priority="true"
                    className="next_image"
                    fill
                    src={
                        (
                          category.heroProduct?.mainImage?.link ?  
                            (imageURI +category.heroProduct?.mainImage?.link)
                            :
                            category.heroProduct?.images && category.heroProduct?.images.length > 0 ? (imageURI + category.heroProduct?.images[0].link) : ''
                        )
                    }
                    alt="..."
                    />
                </div>
                <div className="product_info">
                    <Link href={'/product/' + category.heroProduct.id }>
                        <div className="title">{category.heroProduct?.name_ar}</div>
                    </Link>
                    <div className="description">
                    {i18n.language === "en"
                        ? category.heroProduct.description_en
                        : category.heroProduct.description_ar}
                    </div>
                    <div className="btns">
                        { true ? (
                            <>
                                <button className="buy-now" onClick={()=>{}}>
                                    {t("buy_now")}
                                    </button>
                                <button
                                    className="add-bag"
                                    onClick={() => {
                                      //onAddCart();
                                    }}>
                                    {t("add_to_bag")}
                                </button>
                            </>
                        )
                        :
                        <></>
                        }
                    </div>
                </div>
                </div>
            </div>
            </section>
        ) : null}
        <Filters groups={groups} purities={purities} filterType={filterType} setFilterType={(filters)=>{
          filters.forEach(filter => {
            if(filter.name === 'metal')
              setFilterGroups(filter.filter);
            if(filter.name === 'purity')
              setPurity(filter.filter);
            if(filter.name === 'color')
              setColors(filter.filter);
            setFilterType(filters);
          });
        }} setSortType={(sort)=>{
          setSortType(sort);
        }}/>
        <PaginatedProducts sortType={sortType} cat_id={category.isKenf === true ? undefined : category.id} collection_id={category.isKenf === true ? category.id : undefined} groups={filterGroups} purities={purity} colors={colors}/>
      </main>
    </>
  )
}
export const getServerSideProps = async ({ locale, params, res }) =>{
  let groups = [];
  let categories = [];
  if(!params?.id || params.id == ''){
    return {
      notFound: true
    }
  }
  try{
    const appData = await getAppData();
    groups = appData.groups;
    categories = appData.categories;
  }
  catch(e){console.log(e);}

  let purities = [];
  try{
    purities = await fetchCache('purities',async()=>{
      let purityResponse = await axios.get('/settings/purity?page=1&limit=10',{
        headers: {
          token: process.env.AUTH_TOKEN
        }
      });
      return purityResponse.data.data.docs;
    },3600);
  }
  catch(e){ console.log(e); }

  let category;
  try{
    category = await fetchCache('category_'+params.id,async()=>{
      let data = await axios.get('/settings/items_category/'+params.id,{
        headers: {
          token: process.env.AUTH_TOKEN
        }
      });
      return data.data.data;
    },3600);
    if(!category){
      return {
        notFound: true
      }
    }
  }
  catch(e){
    return {
      notFound: true
    }
  }

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=1800'
  );

  return {
    props: {
      groups,
      categories,
      category,
      purities,
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
}




