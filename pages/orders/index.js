import { ServerURI } from '../../config';
import OrderCard from '../../components/order_card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const orders = [
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        axios.post(`${ServerURI}/order/getOrders`, { token: sessionStorage.getItem("token") })
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => console.log(err));
    }, [])
    
    return (
        <>
            <section className="orders">
                <div className="page-title">{t('my_orders')}</div>
                <div className="container">
                    {
                        orders.map((item, index) => (
                            <OrderCard key={index} data={item} />
                        ))
                    }
                </div>
            </section>
        </>
    )
}

export default Orders;