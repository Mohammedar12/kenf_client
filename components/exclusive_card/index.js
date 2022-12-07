import React from "react";
import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";

const ExclusiveCard = props => {
    const { id, name_en, name_ar, extra_price, images } = props.data;

    return (
        <div className="item">
            <Link href={{ pathname: '/products', query: { product: id } }}><a className="slide">
                <div className="content">
                    <Images src={ServerURI + images[0].link} alt="img" />
                    <div className="info">
                        <h4 className="title-product">{name_en}</h4>
                        {/* <span className="price-product" dir="rtl">{extra_price} SAR</span> */}
                    </div>
                </div>
            </a></Link>
        </div>
    )
}

export default ExclusiveCard;