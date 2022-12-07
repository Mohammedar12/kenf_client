import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";

const CategoryCard = props => {
    const { id, name_en, name_ar, images } = props.data;

    return (
        <>
            <Link href={{ pathname: "/category", query: { category: id } }}><a className="cate">
                <Images src={ServerURI + images[0].link} alt="img" />
                <h6 className="cate-title">{name_en}</h6>
            </a></Link>
        </>
    )
}

export default CategoryCard;