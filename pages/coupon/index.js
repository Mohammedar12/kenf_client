import axios from 'axios';
import React, {useState} from 'react';
import Images from '../../components/image_panel';
import Spinner from '../../components/spinner';
import { ToastContainer, toast } from 'react-toastify';
import { ServerURI } from '../../config';

const Coupon = () => {

    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState();

    const [couponCode, setCouponCode] = useState("");
    const [password, setPassword] = useState("");

    const getStats = () =>{
        if(couponCode.trim().length == 0 || password.trim().length == 0){
            toast.error("Please enter coupon code and password", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });
            return;
        }
        setLoading(true);
        axios.post(`${ServerURI}/market/coupon/stats`, { coupon: couponCode, password })
            .then(res => {
                setStats(res.data);
                setLoading(false);
            })
            .catch(err =>{
               if(err.response && err.response.data && err.response.data.message){
                toast.error(err.response.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
               } 
               else{
                toast.error(err.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
               }
               setLoading(false);
            });
    };
    
    if(loading){
        return (<Spinner />);
    }

    if(!stats){
        return (
            <>
                <div className="coupon">
                    <div className="wrapper">

                        <div className="container">
                            <div className="header"> 
                                Coupon Stats
                            </div>
                            <div className="content d-flex gap-3 flex-column align-items-center p-5">
                                <div className='d-flex flex-column'>
                                    <label htmlFor='coupon'>Coupon code</label>
                                    <input id="coupon" name='coupon' value={couponCode} onChange={(e)=>{setCouponCode(e.target.value);}}/>
                                </div>
                                <div className='d-flex flex-column'>
                                    <label htmlFor='password'>Password</label>
                                    <input id="password" name='password' type="password" value={password} onChange={(e)=>{setPassword(e.target.value);}}/>
                                </div>
                                <button className='px-5 py-1 mt-3' onClick={()=>{getStats();}}>GET STATS</button>
                            </div>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </>
        );
    }

    return (
        <div className="coupon">
            <div className="wrapper">

                <div className="container">
                    <div className="logo">
                        <Images src="images/Screenshot 2022-11-06 193206.png" alt="" width="200px" />
                    </div>
                    <div className="header"> 
                        Coupon Status For &nbsp;<q>{stats.userName}</q> 
                    </div>
                    <div className="content d-flex gap-4 flex-column align-items-center ">
                        <div className="boxes">
                        <div className="box d-flex flex-column">
                            <div className="title">Number Of Usage</div>
                            <div className="amount">{stats.count}</div>
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="box d-flex flex-column">
                            <div className="title">Profit</div>
                            <div className="amount">{stats.profit} SAR</div>
                            <i className="fa-solid fa-money-bill "></i>
                        </div> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Coupon;