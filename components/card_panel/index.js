import React from 'react';

const CardPanel = props => {
    const { cardType, register, cardInfo, setCardInfo } = props;

    return (
        <>
            {
                cardType == "credit" &&
                    <div className="inputs d-none show-this-flex" id="credit_inpits">
                        <input type="text" name="card" placeholder="card number" {...register('cardNumber')} value={cardInfo?.cardNumber} onChange={e => setCardInfo({...cardInfo, cardNumber: e.target.value})} required />
                        <div className="d-flex gap-2 box">
                            <input type="text" name="expireDate" placeholder="MM/YY" {...register('cardExpire')} value={cardInfo?.cardExpire} onChange={e => setCardInfo({...cardInfo, cardExpire: e.target.value})} required />
                            <input type="text" name="cvv" placeholder="CVV" {...register('cardCVV')} value={cardInfo?.cardCVV} onChange={e => setCardInfo({...cardInfo, cardCVV: e.target.value})} required />
                        </div>
                    </div>
            }
            {
                cardType == "mada" &&
                    <div className="inputs d-none show-this-flex" id="mada_inpits">
                        <input type="text" name="card" placeholder="card number" {...register('cardNumber')} value={cardInfo?.cardNumber} onChange={e => setCardInfo({...cardInfo, cardNumber: e.target.value})} required />
                        <div className="d-flex gap-2 box">
                            <input type="text" name="expireDate" placeholder="MM/YY" {...register('cardExpire')} value={cardInfo?.cardExpire} onChange={e => setCardInfo({...cardInfo, cardExpire: e.target.value})} required />
                            <input type="text" name="cvv" placeholder="CVV" {...register('cardCVV')} value={cardInfo?.cardCVV} onChange={e => setCardInfo({...cardInfo, cardCVV: e.target.value})} required />
                        </div>
                    </div>
            }
        </>
    )
}

export default CardPanel;