import Link from "next/link";
import Images from "../../components/image_panel";
import { ServerURI } from "../../config";
import i18n from "../../config/i18n";

const CategoryImgPanel = props => {
    const { datas } = props;

    return (
        <section className="group-section pt-3 pb-3">
            <div className="group_2 d-flex justify-content-center flex-wrap gap-4">
                {
                    datas.map((item, index) => (
                        <Link key={index} href={{ pathname: '/group', query: { group: item.id } }}><a className="col-md-3 col-sm-1  d-block">
                            <h4>{i18n.language === 'en' ? item.name_en : item.name_ar}</h4>
                            <Images classnames="" src={ServerURI + item.images[0].link} alt="" />
                        </a></Link>
                    ))
                }
            </div>
        </section>
    )
}

export default CategoryImgPanel;