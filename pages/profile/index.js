import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { ServerURI } from '../../config';
import Images from "../../components/image_panel";
import CardPanel from "../../components/card_panel";
import AddressPanel from "../../components/address_panel";

const Profile = () => {
    const { register, handleSubmit, setValue } = useForm();
    const [isChecked, setIsChecked] = useState(true);
    const [cardType, setCardType] = useState(null);
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        cardExpire: '',
        cardCVV: ''
    });

    axios.post(`${ServerURI}/getProfile`, { token: sessionStorage.getItem('token') })
        .then(res => {
            setValue('name', res.data.name)
            setValue('email', res.data.email)
            setValue('phone', res.data.phone)
            setValue('addressName', res.data.address.fullname)
            setValue('addressPhone', res.data.address.phone)
            setValue('addressEmail', res.data.address.email)
            setValue('addressCountry', res.data.address.country)
            setValue('addressCity', res.data.address.city)
            setValue('addressZipCode', res.data.address.zipCode)
            setValue('addressStreet', res.data.address.street)
            setValue('billingAddressName', res.data.billingAddress.fullname)
            setValue('billingAddressPhone', res.data.billingAddress.phone)
            setValue('billingAddressEmail', res.data.billingAddress.email)
            setValue('billingAddressCountry', res.data.billingAddress.country)
            setValue('billingAddressCity', res.data.billingAddress.city)
            setValue('billingAddressZipCode', res.data.billingAddress.zipCode)
            setValue('billingAddressStreet', res.data.billingAddress.street)
            setValue('cardNumber', res.data.cardNumber)
            setValue('cardExpire', res.data.cardExpire)
            setValue('cardCVV', res.data.cardCVV)

            setCardInfo({
                cardNumber: res.data.cardNumber,
                cardExpire: res.data.cardExpire,
                cardCVV: res.data.cardCVV
            })
        })
        .catch(err => console.log(err));

    const checkedBox = () => {
        setIsChecked(!isChecked);
    }

    const onSubmit = data => {
        var billingAddress= {};

        if (isChecked) {
            billingAddress = {
                billingAddressName: data.addressName,
                billingAddressPhone: data.addressPhone,
                billingAddressEmail: data.addressEmail,
                billingAddressCountry: data.addressCountry,
                billingAddressCity: data.addressCity,
                billingAddressZipCode: data.addressZipCode,
                billingAddressStreet: data.addressStreet,
            }
        }

        axios.post(`${ServerURI}/profile`, isChecked ? {token: sessionStorage.getItem('token'), ...data, ...billingAddress, cardType: cardType} : {token: sessionStorage.getItem('token'), ...data, cardType: cardType})
            .then(res => {
                if (res.data.nModified == 1)
                    toast.success('Profile is saved', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                else
                    toast.error('Profile is unsaved', {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
            })
            .catch(err => console.log(err));
    }

    return (
        <section className="profile">
            <div className="page-title">My Profile</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="container" dir="rtl">
                    <div className="content_one">
                        <div className="personal-info">
                            <div className="title">Personal Info</div>
                            <div className="box">
                                <div className="field">
                                    <input type="text" {...register("name")} required />
                                    <label htmlFor="">Full Name</label>
                                </div>
                                <div className="field">
                                    <input type="text" {...register("phone")} required />
                                    <label htmlFor="">Phone number</label>
                                </div>

                            </div>
                            <div className="box">
                                <div className="field">
                                    <input type="email" {...register("email")} required />
                                    <label htmlFor="">Email</label>
                                </div>
                            </div>
                        </div>
                        <div className="billing-info">
                            <div className="payments" dir="auto">
                                <div className="title">Payment Method</div>
                                <div className="payment_methods d-flex">
                                    <div className="method credit-card" id="credit-card">
                                        <button type="button" id="credit_btn" onClick={() => setCardType('credit')}>
                                            <Images src="../images/294654_visa_icon.png" alt="" width="35px" />
                                            <Images src="../images/MasterCard_early_1990s_logo.svg" alt="" width="35px" />
                                        </button>
                                    </div>
                                    <div className="method mada-card" id="mada-card">
                                        <button type="button" id="mada_btn" onClick={() => setCardType('mada')}>
                                            <svg xmlns="http://www.w3.org/2000/svg"
                                            xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px"
                                            y="0px" width="40px" viewBox="0 0 796.2 265.5"
                                            style={{enableBackground: "new 0 0 796.2 265.5"}} xmlSpace="preserve">
                                                <rect y="153.1" className="st0" width="336.8" height="112.2" />
                                                <rect className="st1" width="336.8" height="112.3" />
                                                <path className="st2" d="M673.6,242.5l-1.5,0.3c-5.2,1-7.1,1.4-10.9,1.4c-8.8,0-19.2-4.5-19.2-25.7c0-10.9,1.8-25.4,18.2-25.4h0.1   c2.8,0.2,6,0.5,12,2.3l1.3,0.4L673.6,242.5L673.6,242.5z M676.3,136.8l-2.7,0.5v39.2l-2.4-0.7l-0.7-0.2c-2.7-0.8-8.9-2.6-14.9-2.6   c-32.8,0-39.7,24.8-39.7,45.6c0,28.5,16,44.9,43.9,44.9c11.8,0,20.5-1.2,29.3-4.1c8.1-2.6,11-6.3,11-14.2V132.7   C692.3,134.1,684.2,135.5,676.3,136.8" />
                                                <path className="st2" d="M771.1,243.2l-1.4,0.4l-5,1.3c-4.7,1.2-8.9,1.9-12.1,1.9c-7.7,0-12.3-3.8-12.3-10.3c0-4.2,1.9-11.3,14.5-11.3   h16.3V243.2z M759.6,172.5c-10.1,0-20.5,1.8-33.4,5.8l-8.4,2.5l2.8,19l8.2-2.7c8.6-2.8,19.3-4.6,27.3-4.6c3.6,0,14.6,0,14.6,11.9   v5.2h-15.3c-27.9,0-40.8,8.9-40.8,28c0,16.3,11.9,26.1,31.9,26.1c6.2,0,14.8-1.2,22.2-3l0.4-0.1l0.4,0.1l2.5,0.4   c7.8,1.4,15.9,2.8,23.8,4.3V203C795.8,182.8,783.6,172.5,759.6,172.5" />
                                                <path className="st2" d="M576.8,243.2l-1.4,0.4l-5,1.3c-4.7,1.2-8.8,1.9-12.1,1.9c-7.7,0-12.3-3.8-12.3-10.3c0-4.2,1.9-11.3,14.4-11.3   h16.3L576.8,243.2L576.8,243.2z M565.4,172.5c-10.2,0-20.5,1.8-33.4,5.8l-8.4,2.5l2.8,19l8.2-2.7c8.6-2.8,19.3-4.6,27.3-4.6   c3.6,0,14.6,0,14.6,11.9v5.2h-15.3c-27.9,0-40.9,8.9-40.9,28c0,16.3,11.9,26.1,32,26.1c6.2,0,14.8-1.2,22.2-3l0.4-0.1l0.4,0.1   l2.4,0.4c7.9,1.4,15.9,2.8,23.8,4.4v-62.4C601.6,182.7,589.4,172.5,565.4,172.5" />
                                                <path className="st2" d="M471.5,172.7c-12.7,0-23.2,4.2-27.1,6l-1,0.5l-0.9-0.7c-5.4-3.9-13.3-5.9-24.3-5.9c-9.7,0-18.8,1.4-28.7,4.3   c-8.5,2.6-11.8,6.7-11.8,14.4v71.3h26.6v-65.9l1.3-0.4c5.4-1.8,8.6-2.1,11.7-2.1c7.7,0,11.6,4.1,11.6,12.1v56.4h26.2v-57.5   c0-3.4-0.7-5.4-0.8-5.8l-0.9-1.7l1.8-0.8c4-1.8,8.4-2.7,13-2.7c5.3,0,11.6,2.1,11.6,12.1v56.4h26.1v-59   C505.9,182.8,494.7,172.7,471.5,172.7" />
                                                <path className="st2" d="M751.5,73.2c-3.9,0-10.4-0.4-15.5-1.4l-1.5-0.3V33c0-3.2-0.6-5.2-0.7-5.5l-0.8-1.6l1.7-0.7   c0.4-0.2,0.8-0.3,1.3-0.5l0.3-0.2c0.6-0.2,1.2-0.4,1.8-0.6c0.3-0.1,0.5-0.2,0.7-0.2c5.9-1.6,11.3-1.4,13.7-1.6h0.1   c16.3,0,18.2,14.5,18.2,25.4C770.7,68.7,760.2,73.2,751.5,73.2 M751.4,0c-0.2,0-0.5,0-0.7,0c-15.3,0-31,4.2-36.6,12.4   c-3,4-4.7,9-4.8,14.9l0,0V67c0,3.4-0.7,4.7-0.8,5l-0.9,1.7h-48.3V46.1h-0.1C658.6,17,641.4,1,616.5,1h-2.9h-21.4   c-1,7.1-1.8,12.1-2.8,19.2h24.2c12.7,0,19.4,10.8,19.4,27.4v27.8l-1.7-0.9c-0.3-0.1-2.4-0.8-5.7-0.8h-41.8   c-0.8,5.3-1.8,12.2-2.9,19.1h128.5c4.4-0.9,9.5-1.7,13.9-2.4c6.5,3.2,18.6,4.9,26.9,4.9c27.9,0,46-18.7,46-47.5   C796.1,19.3,778.6,0.6,751.4,0" />
                                                <path className="st2" d="M526.1,104.5h1.2c27.9,0,40.9-9.2,40.9-31.9c0-16.3-11.9-29.3-31.9-29.3h-25.7c-7.7,0-12.3-4.4-12.3-11.8   c0-5,1.9-11.2,14.5-11.2H569c1.2-7.3,1.8-11.9,2.9-19.2h-58.4c-27.2,0-40.9,11.4-40.9,30.4c0,18.8,11.9,28.6,31.9,28.6h25.7   c7.7,0,12.3,6.1,12.3,12.5c0,4.2-1.9,12.9-14.4,12.9h-4.3l-82.3-0.2l0,0h-15c-12.7,0-21.6-7.2-21.6-23.9V49.9   c0-17.4,6.9-28.2,21.6-28.2h24.4c1.1-7.4,1.8-12.1,2.8-19.1h-30.4h-2.9c-24.9,0-42.1,16.7-42.7,45.8l0,0v1.1v11.9   c0.6,29.1,17.8,43,42.7,43h2.9h21.4l44.6,0.1l0,0h26.6L526.1,104.5L526.1,104.5z" />
                                            </svg></button>
                                    </div>
                                </div>
                                {
                                    cardType &&
                                        <div className="cards_inputs show">
                                            <CardPanel cardType={cardType} register={register} cardInfo={cardInfo} setCardInfo={setCardInfo} />
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="content_two">
                        <div className="address">
                            <div className="new-address" style={{overflow: "hidden"}}>
                                <div className="header">
                                    <label htmlFor="">Add Address</label>
                                </div>
                                <div className="address-info" dir="auto">
                                    <AddressPanel type="address" register={register} isChecked={isChecked} />
                                    <div className="check d-flex gap-1">
                                        <input type="checkbox" id="checkbox" onChange={checkedBox} checked={isChecked} />
                                        <label htmlFor="checkbox">Payment and shipping address are the same</label>
                                    </div>
                                </div>
                                {
                                    !isChecked &&
                                        <div className="billing-address">
                                            <div className="header">
                                                <label htmlFor="">Billing Address</label>
                                            </div>
                                            <div className="address-info" dir="rtl">
                                                <AddressPanel type="billingAddress" register={register} isChecked={isChecked} />
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <button type="submit" className="save-data">Save</button>
            </form>
            <ToastContainer />
        </section>
    )
}

export default Profile;