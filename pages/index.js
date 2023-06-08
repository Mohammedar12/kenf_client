import Head from 'next/head'

import ProductGroupImages from '@/components/ProductGroupImages';
import { getAppData } from '../utils/get_app_data';
import styles from '../styles/Home.module.css';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { imageURI, ServerURI } from '@/config';
import { useTranslation } from "next-i18next";
import Link from 'next/link';
import Banner from '@/components/Banner';
import ExclusiveProducts from '@/containers/ExclusiveProducts';
import axios from '../utils/noauth_axios';
import { useEffect } from 'react';


export default function Home({ groups, pageCategories, collections, exclusive_products }) {
  
  const { t, i18n } = useTranslation();

  useEffect( () => {
    console.log(groups , "home");
  } , [])

  return (
    <>
      <Head>
        <title>Kenf</title>
        <meta name="description" content="Kenf" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/SVG/logo-3.svg" />
      </Head>
      <main>
        <Banner />
        <ProductGroupImages product_groups={groups}/>
        <ExclusiveProducts exclusive_products={exclusive_products}/>
        <section className={styles.banner_section}>
          <div className={styles.banner}  style={{ position: "relative" }}>
            <Image fill quality={60} className={styles.banner_image} src="/images/bann4.jpg" alt="" sizes='100vw'/>
          </div>
        </section>

        <section className={styles.category_section}>
          <h2 className={styles.category_section_title}>{t('shop_by_category')}</h2>
          <div className={styles.categories}>
            {
              pageCategories.map((category,index)=> (
                <Link aria-label={i18n.language === "en" ? category.name_en : category.name_ar} href={"/category/"+category.id} key={"category_section_"+index} className={styles.category}>
                  <div className={styles.category_image_container}>
                    <Image sizes='@media (max-width: 500px) 250px,@media (max-width: 767px) 400px, 620px' quality={45} src={category.images && category.images.length > 0 ? imageURI + category.images[0].link : ''} fill className={styles.category_image} alt={i18n.language === "en" ? category.name_en : category.name_ar}/>
                  </div>
                  <h3 className={styles.category_name}>{i18n.language === "en" ? category.name_en : category.name_ar}</h3>
                </Link>
              ))
            }
          </div>
        </section>
        <section className={styles.collection_section}>
          <h2 className={styles.collection_section_title}>{t('kenfs_collection')}</h2>
          <div className={styles.collections}>
            {
              collections.map((collection,index)=> (
                <Link aria-label={i18n.language === "en" ? collection.name_en : collection.name_ar} href={"/category/"+collection.id} key={"collection_section_"+index} className={styles.collection}>
                  <div className={styles.collection_image_container}>
                    <Image sizes='@media (max-width: 767px) 65vw, 600px' quality={50} src={collection.images && collection.images.length > 0 ? imageURI + collection.images[0].link : ''} fill className={styles.collection_image} alt={i18n.language === "en" ? collection.name_en : collection.name_ar}/>
                  </div>
                  <h3 className={styles.collection_name}>{i18n.language === "en" ? collection.name_en : collection.name_ar}</h3>
                </Link>
              ))
            }
          </div>
        </section>
      </main>
    </>
  )
}

export const getStaticProps = async ({ locale }) =>{
  let groups = [];
  let categories = [];
  let collections = [];
  let exclusive_products = [];
  
  try{
    const appData = await getAppData();
    groups = appData.groups;
    categories = appData.categories;
  }
  catch(e){console.log(e);}

  try{
    exclusive_products = await axios.get('/product/?sort=-createdAt&isExclusive=true&limit=10',{
      headers: {
        token: process.env.AUTH_TOKEN
      }
    });
    exclusive_products = exclusive_products.data.data.docs;
  }
  catch(e){console.log(e);}

  let pageCategories = categories.filter((val,index)=>(index <  7));

  try{
    collections = await axios.get('/settings/items_category?sort=createdAt&isKenf=true&limit=10',{
      headers: {
        token: process.env.AUTH_TOKEN
      }
    });
    collections = collections.data.data.docs;
  }
  catch(e){console.log(e);}

  return {
    props: {
      groups,
      categories,
      pageCategories,
      collections,
      exclusive_products,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 1800
  };
}




