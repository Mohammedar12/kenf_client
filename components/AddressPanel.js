import React from 'react';
import { useTranslation } from "next-i18next";

const AddressPanel = props => {
    const { type, isChecked, register, errors, clearErrors } = props;
    const { t } = useTranslation();

    return (
        <>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}.fullname`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.fullname')
                    }}/>
                    <label htmlFor="">{t('full_name')}</label>
                    {errors[type]?.fullname && <p className="form_error">{errors[type].fullname.message}</p>}
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}.phone`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.phone')
                    }}/>
                    <label htmlFor="">{t('phone')}</label>
                    {errors[type]?.phone && <p className="form_error">{errors[type].phone.message}</p>}
                </div>

            </div>
            <div className="box">
                <div className="field">
                    <input type="email" {...register(`${type}.email`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.email')
                    }}/>
                    <label htmlFor="">{t('email')}</label>
                    {errors[type]?.email && <p className="form_error">{errors[type].email.message}</p>}
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}.country`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.country')
                    }}/>
                    <label htmlFor="">{t('country')}</label>
                    {errors[type]?.country && <p className="form_error">{errors[type].country.message}</p>}
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}.city`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.city')
                    }}/>
                    <label htmlFor="">{t('city')}</label>
                    {errors[type]?.city && <p className="form_error">{errors[type].city.message}</p>}
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}.zipCode`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.zipCode')
                    }}/>
                    <label htmlFor="">{t('zip_code')}</label>
                    {errors[type]?.zipCode && <p className="form_error">{errors[type].zipCode.message}</p>}
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}.street`)} required={!isChecked} onChange={(e)=>{
                        if(isChecked && type === 'address')
                            clearErrors('billingAddress.street')
                    }}/>
                    <label htmlFor="">{t('street')}</label>
                    {errors[type]?.street && <p className="form_error">{errors[type].street.message}</p>}
                </div>
            </div>
        </>
    )
}

export default AddressPanel;