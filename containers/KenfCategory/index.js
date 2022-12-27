import KenfCard from "../../components/kenf_card";
import { useTranslation } from "react-i18next";

const KenfCategory = props => {
    const { datas } = props;
    const { t } = useTranslation();

    return (
        <>
            <section className="kenf-collection-section pt-3 pb-3">
                <h3 className="section-title">{t('kenfs_collection')}</h3>
                <div className="kenf-collection pt-2">
                    <div className="container scroll-bar-center">
                        <div className="items d-flex justify-content-center text-center">
                            {
                                datas.filter(item => item.isKenf)
                                    .map((item, index) => (
                                        <KenfCard key={index} datas={item} />
                                    ))
                            }
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default KenfCategory;