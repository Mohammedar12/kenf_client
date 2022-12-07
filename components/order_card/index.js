import axios from "axios";
import { ServerURI } from "../../config";

const OrderCard = ({ data }) => {
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
                Order Details Number
                <span>#{data.order_id}</span>
            </div>
            <div className="order__details">
                <div className="order__info">
                    <div className="order__cost">Order cost<span className="cost">{data.totalPrice} SAR</span></div>
                    <div className="order__status">Order status <span className="status">{data.status}</span></div>
                </div>
                <div className="invoice">
                    <button onClick={generateInvoice}>Invoice</button>
                </div>
            </div>
        </div>
    )
}

export default OrderCard;