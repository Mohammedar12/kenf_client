import React from 'react';
import { useTranslation } from "next-i18next";

const CardPanel = props => {
    const { cardType, register, cardInfo, setCardInfo } = props;
    const { t } = useTranslation();

    return (
        <>
            {
                cardType == "credit" &&
                    <div className="inputs d-none show-this-flex" id="credit_inpits">
                        <input type="text" name="card" placeholder={t('card_number')} {...register('cardNumber')} value={cardInfo?.cardNumber} onChange={e => setCardInfo({...cardInfo, cardNumber: e.target.value})} required />
                        <div className="d-flex gap-2 box">
                            <input type="text" name="expireDate" placeholder={t('mm/yy')} {...register('cardExpire')} value={cardInfo?.cardExpire} onChange={e => setCardInfo({...cardInfo, cardExpire: e.target.value})} required />
                            <input type="text" name="cvv" placeholder={t('cvv')} {...register('cardCVV')} value={cardInfo?.cardCVV} onChange={e => setCardInfo({...cardInfo, cardCVV: e.target.value})} required />
                        </div>
                    </div>
            }
            {
                cardType == "mada" &&
                    <div className="inputs d-none show-this-flex" id="mada_inpits">
                        <input type="text" name="card" placeholder={t('card_number')} {...register('cardNumber')} value={cardInfo?.cardNumber} onChange={e => setCardInfo({...cardInfo, cardNumber: e.target.value})} required />
                        <div className="d-flex gap-2 box">
                            <input type="text" name="expireDate" placeholder={t('mm/yy')} {...register('cardExpire')} value={cardInfo?.cardExpire} onChange={e => setCardInfo({...cardInfo, cardExpire: e.target.value})} required />
                            <input type="text" name="cvv" placeholder={t('cvv')} {...register('cardCVV')} value={cardInfo?.cardCVV} onChange={e => setCardInfo({...cardInfo, cardCVV: e.target.value})} required />
                        </div>
                    </div>
            }
        </>
    )
}

export default CardPanel;