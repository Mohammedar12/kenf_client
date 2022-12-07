import CategoryCard from '../../components/category_card';

const ShopByCategory = props => {
    return (
        <section className="category_2-section pt-3 pb-2">
            <h3 className="section-title">Shop by category</h3>
            <div className="category_2 pt-2">
                <div className="container text-center">
                    <div className="rows row-1 pb-1">
                        <CategoryCard data={props.datas[1]} />
                        <CategoryCard data={props.datas[2]} />
                        <CategoryCard data={props.datas[4]} />
                        <CategoryCard data={props.datas[0]} />
                    </div>
                    <div className="rows row-2 pt-1">
                        <CategoryCard data={props.datas[6]} />
                        <CategoryCard data={props.datas[3]} />
                        <CategoryCard data={props.datas[5]} />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ShopByCategory;