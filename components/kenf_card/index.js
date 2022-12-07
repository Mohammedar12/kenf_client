import Link from "next/link";
import Images from "../image_panel";
import { ServerURI } from "../../config";

const KenfCard = (props) => {
  const { id, name_en, name_ar, images } = props.datas;

  return (
    <>
      <Link href={{ pathname: "/category", query: { category: id } }}>
        <div className="item">
          <Images src={ServerURI + images[0].link} alt="" />
          <a>
            <h5 className="item-title">{name_ar}</h5>
          </a>
        </div>
      </Link>
    </>
  );
};

export default KenfCard;
