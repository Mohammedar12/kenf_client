import CategoryCard from '../../components/category_card';
import { useTranslation } from 'react-i18next';

const ShopByCategory = props => {

    const { t } = useTranslation();

    return (
        <section className="category_2-section pt-3 pb-2">
            <h3 className="section-title">{t('shop_by_category')}</h3>
            <div className="category_2 pt-2">
                <div className="container text-center">
                    <div className="rows row-1 pb-1">
                        <CategoryCard data={props.datas[1]} group_id={props.group_id} />
                        <CategoryCard data={props.datas[2]} group_id={props.group_id} />
                        <CategoryCard data={props.datas[4]} group_id={props.group_id} />
                        <CategoryCard data={props.datas[0]} group_id={props.group_id} />
                    </div>
                    <div className="rows row-2 pt-1">
                        <CategoryCard data={props.datas[6]} group_id={props.group_id} />
                        <CategoryCard data={props.datas[3]} group_id={props.group_id} />
                        <CategoryCard data={props.datas[5]} group_id={props.group_id} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopByCategory;