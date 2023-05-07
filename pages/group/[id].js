import Head from 'next/head'
import { getAppData } from '../../utils/get_app_data';
import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { imageURI, ServerURI } from '@/config';
import { useTranslation } from "next-i18next";
import Link from 'next/link';
import Banner from '@/components/Banner';
import PaginatedProducts from '@/components/PaginatedProducts';
import { useRouter } from 'next/router';
import { fetchCache } from '../../utils/cache';
import axios from '../../utils/noauth_axios';

export default function Group({ pageCategories, group }) {
  
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>{i18n.language === "en" ? 'Kenf '+group.name_en : 'Kenf '+group.name_ar}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/SVG/logo-3.svg" />
      </Head>
      <main>
        <Banner />
        <section className={styles.category_section}>
          <h2 className={styles.category_section_title}>{t('shop_by_category')}</h2>
          <div className={styles.categories}>
            {
              pageCategories.map((category,index)=> (
                <Link aria-label={i18n.language === "en" ? category.name_en : category.name_ar} href={"/category/"+category.id+'/'+id} key={"category_section_"+index} className={styles.category}>
                  <div className={styles.category_image_container}>
                    <Image sizes='@media (max-width: 500px) 150px,@media (max-width: 767px) 200px, 360px' quality={45} src={category.images && category.images.length > 0 ? imageURI + category.images[0].link : ''} fill className={styles.category_image} alt={i18n.language === "en" ? category.name_en : category.name_ar}/>
                  </div>
                  <h3 className={styles.category_name}>{i18n.language === "en" ? category.name_en : category.name_ar}</h3>
                </Link>
              ))
            }
          </div>
        </section>
        <PaginatedProducts groups={[id]}/>
      </main>
    </>
  )
}
export const getServerSideProps = async ({ req, res, locale, params }) =>{
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

  let group;
  try{
    group = await fetchCache('group_'+params.id,async()=>{
      let data = await axios.get('/settings/items_group/'+params.id,{
        headers: {
          token: process.env.AUTH_TOKEN
        }
      });
      return data.data.data;
    },3600);
    if(!group){
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

  let pageCategories = categories.filter((val,index)=>(index <  7));
  
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1800, stale-while-revalidate=1800'
  );
  return {
    props: {
      groups,
      categories,
      pageCategories,
      group,
      ...(await serverSideTranslations(locale, ['common'])),
    }
  };
}




