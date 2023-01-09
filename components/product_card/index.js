import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";
import i18n from "../../config/i18n";
import { useTranslation } from "react-i18next";

const ProductCard = props => {
    const { id, name_en, name_ar, extra_price, images } = props.data;
    const { t } = useTranslation();

    return (
        <div className={`product ${props.isSlide ? 'item' : ''}`}>
            <Link href={{ pathname: '/products', query: { product: id } }}><a>
                <div className="img-box">
                    <Images src={ServerURI + images[0].link} alt="" />
                </div>
            </a></Link>
            <div className="product-footer" dir="rtl">
                <div className="info">
                    <h5 className="title">{i18n.language === 'en' ? name_en : name_ar}</h5>
                    <span className="price">{extra_price} {t('sar')}</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;