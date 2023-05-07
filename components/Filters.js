import { useState } from 'react';
import Image from "next/image";
import SortIcon from '../public/images/sort.svg';
import FilterIcon from '../public/images/filter.svg';
import { useTranslation } from "next-i18next";

const Filters = props => {
    const { setSortType, filterType, setFilterType, purities, groups } = props;
    const { t, i18n } = useTranslation();

    const [ filterExpandedIndex, setFilterExpandedIndex ] = useState();

    const onFilter = (type, val) => {
        let keyword = filterType;

        keyword.map(item => {
            if (item.name === type)
                item.filter = item.filter.includes(val) ? item.filter.filter(item => item !== val) : [...item.filter, val];
        });

        setFilterType([...keyword]);
    }

    return (
        <div className="sorting d-flex justify-content-center">
            <div className="box d-flex">
                <div className="sort">
                    <button>
                        <Image src={SortIcon} alt="" />
                        <span>{t('sort')}</span>
                    </button>
                    <ul className="list" dir={i18n.language == 'ar' ? 'rtl' : 'ltr'}>
                        <li><label htmlFor="1">{t('price_from_low_to_high')}</label><input type="radio" name="1" id="1" onClick={() => setSortType('extra_price')} /></li>
                        <li><label htmlFor="2">{t('price_from_high_to_low')}</label><input type="radio" name="1" id="2" onClick={() => setSortType('-extra_price')} /></li>
                        <li><label htmlFor="3">{t('most_viewed')}</label><input type="radio" name="1" id="3" onClick={() => setSortType('-visited')} /></li>
                        <li><label htmlFor="4">{t('best_seller')}</label><input type="radio" name="1" id="4" onClick={() => setSortType('-visited')} /></li>
                    </ul>
                </div>
                <div className="filter">
                    <button>
                        <Image
                         src={FilterIcon} alt="" />
                        <span>{t('filter')}</span>
                    </button>
                    <ul className="list">
                        <div dir={i18n.language == 'ar' ? 'rtl' : 'ltr'} className=" accordion accordion-flush" id="list">
                            <div className="accordion-item">
                                <h2 className=" text-center accordion-header" id="flush-metal">
                                    <button className=" accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseMetal" aria-expanded="false"
                                        aria-controls="flush-collapseMetal" onClick={()=>{setFilterExpandedIndex(filterExpandedIndex != 0 ? 0 : undefined);}}>
                                        {t('metal')}
                                    </button>
                                </h2>
                                <div id="flush-collapseMetal" className={filterExpandedIndex == 0 ? 'accordion-collapse collapse show' : "accordion-collapse collapse"}
                                    aria-labelledby="flush-metal" data-bs-parent="#list">
                                    <div className="check-list">
                                        {
                                            groups?.map((item, index) => (
                                                <div key={index} className="check-item">
                                                    <label htmlFor={"metal-" + item.name_en.toLowerCase()}>{i18n.language === 'en' ? item.name_en : item.name_ar}</label>
                                                    <input type="checkbox" name="" id={"metal-" + item.name_en.toLowerCase()} onClick={() => onFilter('metal', item.id)} defaultChecked={filterType.filter((val)=>(val.name === 'metal'))[0]?.filter.includes(item.id)}/>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className=" text-center accordion-header" id="flush-Purity">
                                    <button className=" accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapsePurity" aria-expanded="false"
                                        aria-controls="flush-collapsePurity" onClick={()=>{setFilterExpandedIndex(filterExpandedIndex != 1 ? 1 : undefined);}}>
                                        {t('purity')}
                                    </button>
                                </h2>
                                <div id="flush-collapsePurity" className={filterExpandedIndex == 1 ? 'accordion-collapse collapse show' : "accordion-collapse collapse"}
                                    aria-labelledby="flush-Purity" data-bs-parent="#list">
                                    <div className="check-list">
                                        {
                                            purities?.map((item, index) => (
                                                <div key={index} className="check-item">
                                                    <label htmlFor={"purity-" + item.name_en}>{i18n.language === 'en' ? item.name_en : item.name_ar}</label>
                                                    <input type="checkbox" name="" id={"purity-" + item.name_en} onClick={() => onFilter('purity', item.id)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className=" text-center accordion-header" id="flush-Color">
                                    <button className=" accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseColor" aria-expanded="false"
                                        aria-controls="flush-collapseColor" onClick={()=>{setFilterExpandedIndex(filterExpandedIndex != 2 ? 2 : undefined);}}>
                                        {t('metal_color')}
                                    </button>
                                </h2>
                                <div id="flush-collapseColor" className={filterExpandedIndex == 2 ? 'accordion-collapse collapse show' : "accordion-collapse collapse"}
                                    aria-labelledby="flush-Color" data-bs-parent="#list">
                                    <div className="check-list">
                                        <div className="check-item">
                                            <label htmlFor="yellow">{t('yellow')}</label>
                                            <input type="checkbox" name="" id="yellow" onClick={() => onFilter('color', 'Yellow')} />
                                        </div>
                                        <div className="check-item">
                                            <label htmlFor="white">{t('white')}</label>
                                            <input type="checkbox" name="" id="white" onClick={() => onFilter('color', 'White')} />
                                        </div>
                                        <div className="check-item">
                                            <label htmlFor="multi">{t('multi')}</label>
                                            <input type="checkbox" name="" id="multi" onClick={() => onFilter('color', 'Multi')} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Filters;