import Images from "../image_panel";

const Filter = props => {
    const { setSortType, filterType, setFilterType, purities, groups } = props;

    const onFilter = (type, val) => {
        let keyword = filterType;

        keyword.map(item => {
            if (item.name === type)
                item.filter = item.filter.includes(val) ? item.filter.filter(item => item !== val) : [...item.filter, val];
        });

        setFilterType([...keyword]);
    }

    return (
        <div className="sorting d-flex justify-content-center" dir="rtl ">
            <div className="box d-flex">
                <div className="sort">
                    <button>
                        <Images src="images/sort.svg" alt="" />
                        <span>Sort</span>
                    </button>
                    <ul className="list">
                        <li><input type="radio" name="1" id="1" onClick={() => setSortType(1)} /><label htmlFor="1">Price from low to high</label></li>
                        <li><input type="radio" name="1" id="2" onClick={() => setSortType(2)} /><label htmlFor="2">Price from high to low</label></li>
                        <li><input type="radio" name="1" id="3" onClick={() => setSortType(3)} /><label htmlFor="3">Most viewed</label></li>
                        <li><input type="radio" name="1" id="4" onClick={() => setSortType(4)} /><label htmlFor="4">Best seller</label></li>
                    </ul>
                </div>
                <div className="filter">
                    <button>
                        <Images src="images/filter.svg" alt="" />
                        <span>Filter</span>
                    </button>
                    <ul className="list">
                        <div dir="rtl" className=" accordion accordion-flush" id="list">
                            <div className="accordion-item">
                                <h2 className=" text-center accordion-header" id="flush-metal">
                                    <button className=" accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#flush-collapseMetal" aria-expanded="false"
                                        aria-controls="flush-collapseMetal">
                                        Metal
                                    </button>
                                </h2>
                                <div id="flush-collapseMetal" className="accordion-collapse collapse"
                                    aria-labelledby="flush-metal" data-bs-parent="#list">
                                    <div className="check-list">
                                        {
                                            groups?.map((item, index) => (
                                                <div key={index} className="check-item">
                                                    <label htmlFor={"metal-" + item.name_en.toLowerCase()}>{item.name_en}</label>
                                                    <input type="checkbox" name="" id={"metal-" + item.name_en.toLowerCase()} onClick={() => onFilter('metal', item.id)} />
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
                                        aria-controls="flush-collapsePurity">
                                        Purity
                                    </button>
                                </h2>
                                <div id="flush-collapsePurity" className="accordion-collapse collapse"
                                    aria-labelledby="flush-Purity" data-bs-parent="#list">
                                    <div className="check-list">
                                        {
                                            purities?.map((item, index) => (
                                                <div key={index} className="check-item">
                                                    <label htmlFor={"purity-" + item.name_en}>{item.name_en}</label>
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
                                        aria-controls="flush-collapseColor">
                                        Metal Color
                                    </button>
                                </h2>
                                <div id="flush-collapseColor" className="accordion-collapse collapse"
                                    aria-labelledby="flush-Color" data-bs-parent="#list">
                                    <div className="check-list">
                                        <div className="check-item">
                                            <label htmlFor="yellow">Yellow</label>
                                            <input type="checkbox" name="" id="yellow" onClick={() => onFilter('color', 'Yellow')} />
                                        </div>
                                        <div className="check-item">
                                            <label htmlFor="white">White</label>
                                            <input type="checkbox" name="" id="white" onClick={() => onFilter('color', 'White')} />
                                        </div>
                                        <div className="check-item">
                                            <label htmlFor="multi">Multi</label>
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

export default Filter;