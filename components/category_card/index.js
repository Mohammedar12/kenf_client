import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";
import i18n from "../../config/i18n";

const CategoryCard = props => {
    const { id, name_en, name_ar, images } = props.data;

    return (
        <>
            <Link href={{ pathname: "/category", query: { category: id, ...(props?.group_id &&{group: props.group_id}) }}}><a className="cate">
                <Images src={ServerURI + images[0].link} alt="img" />
                <h6 className="cate-title">{i18n.language === 'en' ? name_en : name_ar}</h6>
            </a></Link>
        </>
    )
}

export default CategoryCard;