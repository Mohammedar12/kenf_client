import React, { useState, useEffect } from "react";
import axios from '../../utils/auth_axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddressPanel from "@/components/AddressPanel";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { setCookie } from 'cookies-next';

const Profile = (props) => {
    const { profile } = props;
    const { register, handleSubmit, setValue, setError, clearErrors ,formState: { errors } } = useForm();
    const [isChecked, setIsChecked] = useState(true);
    const [loading, setLoading] = useState(false);
    const { t, i18n } = useTranslation();

    const checkedBox = () => {
        setIsChecked(!isChecked);
    }

    useEffect(()=>{
        setValue('name', profile.name)
        setValue('email', profile.email)
        setValue('phone', profile.phone)
        setValue('address.fullname', profile.address?.fullname)
        setValue('address.phone', profile.address?.phone)
        setValue('address.email', profile.address?.email)
        setValue('address.country', profile.address?.country)
        setValue('address.city', profile.address?.city)
        setValue('address.zipCode', profile.address?.zipCode)
        setValue('address.street', profile.address?.street)
        setValue('billingAddress.fullname', profile.billingAddress?.fullname)
        setValue('billingAddress.phone', profile.billingAddress?.phone)
        setValue('billingAddress.email', profile.billingAddress?.email)
        setValue('billingAddress.country', profile.billingAddress?.country)
        setValue('billingAddress.city', profile.billingAddress?.city)
        setValue('billingAddress.zipCode', profile.billingAddress?.zipCode)
        setValue('billingAddress.street', profile.billingAddress?.street)
        if(
            profile.address?.fullname === profile.billingAddress?.fullname &&
            profile.address?.phone === profile.billingAddress?.phone &&
            profile.address?.email === profile.billingAddress?.email &&
            profile.address?.country === profile.billingAddress?.country &&
            profile.address?.city === profile.billingAddress?.city &&
            profile.address?.zipCode === profile.billingAddress?.zipCode &&
            profile.address?.street === profile.billingAddress?.street
        ){
            setIsChecked(true);
        }
        else{
            setIsChecked(false);
        }
    },[]);

    const onSubmit = data => {
        setLoading(true);
        let body= {
            name: data.name,
            ...(profile.loginType !== 'email' && {email: data.emai}),
            ...(profile.loginType !== 'phone' && {phone: data.phone}),
        };
        body.address = {
            fullname: data.address.fullname,
            phone: data.address.phone,
            email: data.address.email,
            country: data.address.country,
            city: data.address.city,
            zipCode: data.address.zipCode,
            street: data.address.street
        };
        if (isChecked) {
            body.billingAddress = {
                fullname: data.address.fullname,
                phone: data.address.phone,
                email: data.address.email,
                country: data.address.country,
                city: data.address.city,
                zipCode: data.address.zipCode,
                street: data.address.street
            }
        }
        else{
            body.billingAddress = {
                fullname: data.billingAddress.fullname,
                phone: data.billingAddress.phone,
                email: data.billingAddress.email,
                country: data.billingAddress.country,
                city: data.billingAddress.city,
                zipCode: data.billingAddress.zipCode,
                street: data.billingAddress.street
            }
        }

        axios.put(`/user/profile`, body)
            .then(res => {
                toast.success(t('message.profile_saved'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                setLoading(false);
            })
            .catch(err => {
                if(err.response?.data){
                    if(!err.response.data.errors){
                        toast.error(err.response.data.message, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                        });
                    }
                    else{
                        //set errors
                        for (let errorKey in err.response.data.errors) {
                            setError(errorKey,{
                                message: err.response.data.errors[errorKey].message,
                                type: 'custom'
                            },{ shouldFocus: true });
                        }
                            
                    }
                }
                else {
                    toast.error(err.message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
                setLoading(false);
            });
    }

    return (
        <section className="profile">
            <div className="page-title">{t('my_profile')}</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="container" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="content_one">
                        <div className="personal-info">
                            <div className="title">{t('personal_info')}</div>
                            <div className="box">
                                <div className="field">
                                    <input type="text" {...register("name")} />
                                    <label htmlFor="">{t('full_name')}</label>
                                    {errors['name'] && <p className="form_error">{errors['name'].message}</p>}
                                </div>
                                <div className="field">
                                    <input type="text" {...register("phone")} disabled={profile.loginType === 'phone' ? true : false} />
                                    <label htmlFor="">{t('phone')}</label>
                                    {errors['phone'] && <p className="form_error">{errors['phone'].message}</p>}
                                </div>
                            </div>
                            <div className="box">
                                <div className="field">
                                    <input type="email" {...register("email")} disabled={profile.loginType === 'email' ? true : false} />
                                    <label htmlFor="">{t('email')}</label>
                                    {errors['email'] && <p className="form_error">{errors['email'].message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content_two">
                        <div className="address">
                            <div className="new-address" style={{overflow: "hidden"}}>
                                <div className="header">
                                    <label htmlFor="">{t('add_address')}</label>
                                </div>
                                <div className="address-info" dir="auto">
                                    <AddressPanel type="address" register={register} isChecked={isChecked} errors={errors} clearErrors={clearErrors}/>
                                    <div className="check d-flex gap-1">
                                        <input type="checkbox" id="checkbox" onChange={checkedBox} checked={isChecked} />
                                        <label htmlFor="checkbox">{t('payment_and_shipping_address_are_the_same')}</label>
                                    </div>
                                </div>
                                {
                                    !isChecked &&
                                        <div className="billing-address">
                                            <div className="header">
                                                <label htmlFor="">{t('billing_address')}</label>
                                            </div>
                                            <div className="address-info" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                                                <AddressPanel type="billingAddress" register={register} isChecked={isChecked} errors={errors} clearErrors={clearErrors}/>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    loading ?
                    <div className="spinner" style={{ marginLeft: 'auto', marginRight: 'auto' }}></div>
                    :
                    <button type="submit" className="save-data">{t('save')}</button>
                }
            </form>
            <ToastContainer />
        </section>
    )
}

export default Profile;

export async function getServerSideProps({ req, locale, res }) {
    let groups = [];
    let categories = [];
    try{
      const appData = await getAppData();
      groups = appData.groups;
      categories = appData.categories;
    }
    catch(e){}
    let user = {};
    try{
        user = await axios.get('/user/profile',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : '',
                token: process.env.AUTH_TOKEN
            }
        });
        user = user.data.data;
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
        profile: user,
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }