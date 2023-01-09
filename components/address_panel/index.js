import React from 'react';
import { useTranslation } from 'react-i18next';

const AddressPanel = props => {
    const { type, isChecked, register } = props;
    const { t } = useTranslation();

    return (
        <>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}Name`)} required={!isChecked} />
                    <label htmlFor="">{t('full_name')}</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}Phone`)} required={!isChecked} />
                    <label htmlFor="">{t('phone')}</label>
                </div>

            </div>
            <div className="box">
                <div className="field">
                    <input type="email" {...register(`${type}Email`)} required={!isChecked} />
                    <label htmlFor="">{t('email')}</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}Country`)} required={!isChecked} />
                    <label htmlFor="">{t('country')}</label>
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}City`)} required={!isChecked} />
                    <label htmlFor="">{t('city')}</label>
                </div>
                <div className="field">
                    <input type="text" {...register(`${type}ZipCode`)} required={!isChecked} />
                    <label htmlFor="">{t('zip_code')}</label>
                </div>
            </div>
            <div className="box">
                <div className="field">
                    <input type="text" {...register(`${type}Street`)} required={!isChecked} />
                    <label htmlFor="">{t('street')}</label>
                </div>
            </div>
        </>
    )
}

export default AddressPanel;