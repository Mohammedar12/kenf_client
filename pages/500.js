import { getAppData } from '../utils/get_app_data';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Custom404() {
    return(
        <div style={{ width: '100%', minHeight: '30vh', display: 'flex', justifyContent: 'center' ,alignItems: 'center' }}>
             <h1>500 - Internal server error</h1>
        </div>
    )
}

export const getStaticProps = async ({ locale }) =>{
    let groups = [];
    let categories = [];
    
    try{
      const appData = await getAppData();
      groups = appData.groups;
      categories = appData.categories;
    }
    catch(e){console.log(e);}
  
    return {
      props: {
        groups,
        categories,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 1800
    }
}