import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import axios from '../../utils/auth_axios';
import FavoriteCard from '@/components/FavoriteCard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useSWRInfinite from 'swr/infinite';
import { useState } from 'react';
import { setCookie } from 'cookies-next';

const fetcher = async(url)=>{
    return (await axios.get(url)).data.data;
}

export default function Favorite({ favorites }){

    const [actionLoading, setActionLoading] = useState(false);

    const {
        data,
        size,
        setSize,
        isLoading,
        mutate,
      } = useSWRInfinite( (index) => `user/favorite/?limit=${20}&page=${ index + 1 }` , fetcher, { fallbackData: favorites, revalidateOnFocus: false  });
 

    const { t, i18n } = useTranslation();

    const favoriteProducts = data ? [].concat(...(data.map((val)=>val.docs))) : [];
    const isReachingEnd = data && data.length != 0 ? data[data.length-1].hasNextPage === false : true;

    const removedFromFavorite = (id) => {
        mutate((data)=>( data.map((val)=> {
                return {
                    ...val,
                    docs: val?.docs?.filter((val2)=> (val2.product.id !== id)) 
                };
            })
        ), false);
    };

    const addedToCart = (id) => {
        toast.success('Favorite product has been added on cart', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
        });
    };

    const deleteAll = async() =>{
        try{
            const res = await axios.delete('/user/favorite/all');
            mutate([],true);
        }
        catch(e){
            if(e.response?.data?.message){
                displayErrorMessage(e.response.data.message)
            }
            else{
                displayErrorMessage(e.message);
            }
        }
    };

    const addAllToCart = async() =>{
        try{
            const res = await axios.post('/user/cart/import_from_favorites',{});
            toast.success('All products are added to cart', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
        catch(e){
            if(e.response?.data?.message){
                displayErrorMessage(e.response.data.message)
            }
            else{
                displayErrorMessage(e.message);
            }
        }
    };
    
    const displayErrorMessage = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
        });
    }

    return (
        <>
            <section className="favorite" dir="auto">
                <div className="page-title">{t('favorite')}</div>
                <div className="container">
                    {
                        favoriteProducts.length > 0 && !actionLoading &&
                            <div className="fav-btns">
                                <button className="add-all-to-bag" onClick={()=>{addAllToCart()}}>{t('add_all_to_bag')}</button>
                                <button className="del-all" onClick={()=>{deleteAll()}}>{t('delete_all')}</button>
                            </div>
                    }
                    {
                        actionLoading &&
                            <div className="fav-btns">
                                <div className="spinner" style={{ marginLeft: 'auto', marginRight: 'auto' }}></div>
                            </div>
                    }
                    {
                        favoriteProducts.length > 0 ?
                            <div className="fav-products">
                                {
                                    favoriteProducts.map((item, index) => (
                                        <FavoriteCard key={"product_"+item.product.id} data={item}  addedToCart={addedToCart} deleteFromFavorite={removedFromFavorite} displayErrorMessage={displayErrorMessage}/>
                                    ))
                                }
                            </div> :
                            <></>
                    }
                    {
                       (!favoriteProducts || favoriteProducts.length == 0) && !isLoading ?
                        <div className="d-flex justify-content-center">{t('message.there_are_no_favorite_products')}</div>
                        :
                        <></>
                    }
                    {
                        isLoading && <div className='spinner' style={{ marginLeft: 'auto' , marginRight: 'auto'}}></div>
                    }
                    {
                        !isLoading && !isReachingEnd ? <button onClick={()=>{setSize(size+1)}} className="load_more_btn">Load more</button> : <></>
                    }
                </div>
            </section>
            <ToastContainer />
        </>
    );
}

export async function getServerSideProps({ req, locale, res }) {
    let groups = [];
    let categories = [];
    try{
      const appData = await getAppData();
      groups = appData.groups;
      categories = appData.categories;
    }
    catch(e){}
    let favoriteProducts = [];
    try{
        favoriteProducts = await axios.get('/user/favorite',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        });
        favoriteProducts = favoriteProducts.data.data;
      }
      catch(e){
        if(e.response?.status == 401){
            setCookie('login', 'true', { req, res, maxAge: 10 });
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }
      }
    
    return {
      props: {
        groups,
        categories,
        favorites: [favoriteProducts],
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }