import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";

const ProductCard = props => {
    const { id, name_en, name_ar, extra_price, images } = props.data;

    return (
        <div className={`product ${props.isSlide ? 'item' : ''}`}>
            <Link href={{ pathname: '/products', query: { product: id } }}><a>
                <div className="img-box">
                    <Images src={ServerURI + images[0].link} alt="" />
                </div>
            </a></Link>
            <div className="product-footer" dir="rtl">
                <div className="info">
                    <h5 className="title">{name_en}</h5>
                    <span className="price">{extra_price} SAR</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;