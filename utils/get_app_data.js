import axios from './auth_axios';
import { fetchCache } from './cache';

export const getAppData = async () =>{
    const data = await fetchCache('AppData',_fetchData, 1800);
    return data;
}

const _fetchData = async () => {
    let groups = [];
    let categories = [];
    try{
      groups = await axios.get('/settings/items_group?sort=createdAt',{
        headers: {
          token: process.env.AUTH_TOKEN
        }
      });
      groups = groups.data.data.docs;
      console.log( groups.data.data + "ds")
    }
    catch(e){console.log(e);}
  
    try{
      categories = await axios.get('/settings/items_category?sort=createdAt&isKenf=false',{
        headers: {
          token: process.env.AUTH_TOKEN
        }
      });
      categories = categories.data.data.docs;
    }
    catch(e){console.log(e);}
    return {
        groups,
        categories
    };
  }