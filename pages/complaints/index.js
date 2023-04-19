import React, { useState, useEffect } from "react";
import axios from '../../utils/auth_axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { setCookie } from 'cookies-next';

const Complaints = (props) => {

    const { complaints } = props;
    const { t } = useTranslation();
    
    return (
        <>
            <section className="complaints">
                <header className="text-center mt-5 mb-5">
                    <h3 className="mb-4">{t('make_a_complaint')}</h3>
                    <p className="pe-4 ps-4">{t('complaint_description')}</p>
                </header>
                {/* <FAQList getAllComplaints={getAllComplaints} /> */}
            </section>
            <div className="back-drop"></div>
        </>
    )
}

export default Complaints;

export async function getServerSideProps({ req, locale, res }) {
    // let complaints = {};
    // try{
    //     user = await axios.get('/user/profile',{
    //         withCredentials: true,
    //         headers: {
    //             Cookie: req.headers?.cookie ? req.headers.cookie : '',
    //             token: process.env.AUTH_TOKEN
    //         }
    //     });
    //     user = user.data.data;
    // }
    // catch(e){
    //     if(e.response?.status == 401){
    //         setCookie('login', 'true', { req, res, maxAge: 10 });
    //         return {
    //             redirect: {
    //                 destination: '/',
    //                 permanent: false,
    //             }
    //         }
    //     }
    // }
    let groups = [];
    let categories = [];
    try{
    const appData = await getAppData();
    groups = appData.groups;
    categories = appData.categories;
    }
    catch(e){}
    
    return {
      props: {
        groups,
        categories,
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }