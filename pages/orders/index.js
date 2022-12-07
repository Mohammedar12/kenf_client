import { ServerURI } from '../../config';
import OrderCard from '../../components/order_card';
import { useEffect, useState } from 'react';
import axios from 'axios';

const orders = [
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
    { detailNumber: '#1264', cost: '245 SAR', status: 'ready to shipping' },
];

const Orders = () => {
    const [orders, setOrders] = useState([]);

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
                <div className="page-title">My Orders</div>
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