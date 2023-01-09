import axios from "axios";
import { ServerURI } from "../../config";
import { useTranslation } from "react-i18next";

const OrderCard = ({ data }) => {

    const { t } = useTranslation();

    const generateInvoice = () => {
        axios.post(`${ServerURI}/order/invoice`, data)
            .then(res => {
                if (res.data.IsSuccess) {
                    window.open(res.data.Data.InvoiceURL);
                }
            })
            .catch(err => console.log(err));
    }
    
    return (
        <div className="order" dir="auto">
            <div className="order__number">
                {t('order_details_number')}
                <span>#{data.order_id}</span>
            </div>
            <div className="order__details">
                <div className="order__info">
                    <div className="order__cost">{t('order_cost')}<span className="cost">{data.totalPrice} SAR</span></div>
                    <div className="order__status">{t('order_status')} <span className="status">{data.status}</span></div>
                </div>
                <div className="invoice">
                    <button onClick={generateInvoice}>{t('invoice')}</button>
                </div>
            </div>
        </div>
    )
}

export default OrderCard;