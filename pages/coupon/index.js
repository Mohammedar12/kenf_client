import React from 'react';
import Images from '../../components/image_panel';

const Coupon = () => {
    return (
        <div className="coupon">
            <div className="wrapper">

                <div className="container">
                    <div className="logo">
                        <Images src="images/Screenshot 2022-11-06 193206.png" alt="" width="200px" />
                    </div>
                    <div className="header"> 
                        Coupon Status For <q>Aleksander</q> 
                    </div>
                    <div className="content d-flex gap-4 flex-column align-items-center ">
                        <div className="boxes">
                        <div className="box d-flex flex-column">
                            <div className="title">Number Of Usage</div>
                            <div className="amount">19</div>
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <div className="box d-flex flex-column">
                            <div className="title">Profit</div>
                            <div className="amount">2214 SAR</div>
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