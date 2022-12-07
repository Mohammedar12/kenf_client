import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../../components/auth_context";
import { ProductCarousel } from "../../_service";
import ProductCard from "../../components/product_card";
import Images from "../../components/image_panel";
import { ServerURI } from "../../config";

const Products = props => {
    const router = useRouter();
    const { getAllProducts, getAllSizes } = props;
    const { isAuth } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [profile, setProfile] = useState();
    const [currentProduct, setCurrentProduct] = useState(getAllProducts.filter(item => item.id == router.query.product)[0]);
    const [selectedImage, setSelectedImage] = useState(currentProduct.images[0].id);

    useEffect(() => {
        ProductCarousel();
    }, [])

    useEffect(() => {
        axios.post(`${ServerURI}/product/visit`, { id: router.query.product, visit: getAllProducts.filter(item => item.id == router.query.product)[0].visited });

        if (isAuth) {
            axios.get(`${ServerURI}/settings/favorite?token=${sessionStorage.getItem("token")}`)
                .then(res => {
                    setCart(res.data.cart)
                })
                .catch(err => console.log(err));

            onSetProfile();
        }
        
        setCurrentProduct(getAllProducts.filter(item => item.id == router.query.product)[0]);
    }, [router.query, isAuth]);

    const onSetFavorite = () => {
        axios.post(`${ServerURI}/settings/favorite`, { product: router.query.product, user: sessionStorage.getItem("token") })
            .then(res => onSetProfile())
            .catch(err => console.log(err));
    }

    const onSetProfile = () => {
        axios.post(`${ServerURI}/getProfile`, { token: sessionStorage.getItem('token') })
            .then(res => {console.log(res.data); setProfile(res.data)})
            .catch(err => console.log(err));
    }

    const onAddCart = () => {
        if (isAuth) {
            var postData = {
                token: sessionStorage.getItem("token"),
                product: [...cart.filter(item => item.id != router.query.product).map(item => item.id), router.query.product]
            }
    
            axios.post(`${ServerURI}/settings/cart`, postData)
                .then(res => {
                    router.push('/shopping');
                })
                .catch(err => console.log(err));
        } else {
            axios.post(`${ServerURI}/settings/encodeCart`, { addedCart: getAllProducts.filter(item => item.id == router.query.product), savedCart: sessionStorage.getItem('cart') })
                .then(res => {
                    sessionStorage.setItem('cart', res.data);
                    router.push('/shopping')
                })
                .catch(err => console.log(err));
        }
    }

    return (
        <>
            <section className="product-section " >
                <div className="container">
                    <div className="product-imgs">
                        <div className="imgs">
                            {
                                currentProduct.images?.map((item, index) => (
                                    <a key={index} style={{cursor: "pointer"}} onClick={() => setSelectedImage(item.id)}>
                                        <Images src={ServerURI + '/getfile?id=' + item.id} alt="" />
                                    </a>
                                ))
                            }
                        </div>
                        <div className="main-img">
                            {
                                isAuth && currentProduct.quantity > 0 &&
                                <div className={"add-favorite " + (profile?.favorite.filter(item => item == router.query.product).length != 0 && "hover-icon")} onClick={onSetFavorite}>
                                    <div className="icon" style={{display: 'flex', cursor: 'pointer'}}>
                                        <i className="fa-solid fa-heart"></i>
                                    </div>
                                </div>
                            }
                            <div className="img-container">
                                <Images src={ServerURI + '/getfile?id=' + selectedImage} alt="" />
                            </div>
                            <div className="favorite-icon"></div>
                        </div>
                    </div>
                    <div className="product-details">
                        <div className="title">
                            <div className="box-title">
                                <h5>{currentProduct.name_en}</h5>
                            </div>
                        </div>
                        {
                            currentProduct.ringSize != 0 &&
                                <div className="sizes flex-column">
                                    <div className="size-title">Size :</div>
                                    <div className="box">
                                        <div className="size-nums btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
                                            <div className="btn-group" role="group" aria-label="First group">
                                                {
                                                    getAllSizes.map((item, index) => (
                                                        <button type="button" key={index} className="btn btn-primary" style={{background: item.id == currentProduct.ringSize ? '#1f4369' : '#ebc58d', color: item.id == currentProduct.ringSize ? '#ebc58d' : '#1f4369'}}>{console.log(item.id, currentProduct.ringSize)}{item.name_en}</button>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                        <div className="size-guide"><a href="">Size guide</a></div>
                                    </div>
                                </div>
                        }
                        <div className="price fw-bold">
                            <div className="price-title">Price :</div>
                            <div className="the-price">SAR {currentProduct.extra_price}</div>
                        </div>
                        <div className="desc accordion" id="accordionExample">
                            <div className="accordion-item">
                                <h2 className="accordion-header " id="headingThree">
                                    <button className="accordion-button collapsed text-end pe-0 d-flex" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false"
                                        aria-controls="collapseThree">
                                        Description
                                    </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse text-end"
                                    aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                    <div className="item the-desc pt-2">
                                        {currentProduct.description_en}
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header " id="headingTwo">
                                    <button className="accordion-button collapsed text-end pe-0 d-flex" type="button"
                                        data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false"
                                        aria-controls="collapseTwo">
                                        Specifications
                                    </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse text-end" aria-labelledby="headingTwo"
                                    data-bs-parent="#accordionExample">
                                    <div className="item the-features pt-2">
                                        <div className="feature">
                                            <div className="karats">karat : <span className="num pe-2">{currentProduct.purity_id[0].name_en}</span></div>
                                        </div>
                                        <div className="feature pt-2">
                                            <div className="weights">weight : <span className="num pe-2 ">{currentProduct.weight}g</span></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="shearing">
                            <span className="shearing-title">Share the product with your loved one</span>
                            <ul className="media d-flex gap-2 align-items-center">
                                <li><i className="fa-brands fa-whatsapp fa-1x"></i></li>
                                <li><i className="fa-brands fa-instagram fa-1x"></i></li>
                                <li><i className="fa-regular fa-share-from-square fa-1x"></i></li>
                            </ul>
                        </div>
                        <div className="btns">
                            <button className="add-bag" onClick={onAddCart} disabled={currentProduct.quantity > 0 ? false : true}> Add To Bag<i className="fa-solid fa-bag-shopping fa-1x pe-3 "></i></button>
                            {
                                isAuth && currentProduct.quantity > 0 ?
                                    <Link href={{ pathname: '/checkout', query: { product: router.query.product, cart: false } }}><button className="buy-now">Buy Now</button></Link> :
                                    (
                                        currentProduct.quantity > 0 ?
                                            <button className="buy-now" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Buy Now</button> :
                                            <button className="buy-now" disabled>Buy Now</button>
                                    )
                            }
                        </div>
                    </div>
                </div>
            </section>

            <section className="suggested-products owl-carousel owl-theme pt-2 pb-2">
                {
                    getAllProducts.filter(item => !item.deleted && !item.hidden)
                        .filter(item => item.group_id.id == currentProduct.group_id.id)
                        .filter(item => item.category_id.id == currentProduct.category_id.id)
                        .filter(item => item.id != currentProduct.id)
                        .map((item, index) => (
                            <ProductCard key={index} data={item} isSlide={true} />
                        ))
                }
            </section>
            <section className="suggested-products owl-carousel owl-theme pt-2 pb-2">
                {
                    getAllProducts.filter(item => !item.deleted && !item.hidden)
                        .filter(item => item.group_id.id != currentProduct.group_id.id)
                        .filter(item => item.category_id.id == currentProduct.category_id.id)
                        .map((item, index) => (
                            <ProductCard key={index} data={item} isSlide={true} />
                        ))
                }
            </section>
        </>
    )
}

export async function getServerSideProps() {
    const getAllProducts = await fetch(`${ServerURI}/product`);
    const allProducts = await getAllProducts.json();

    const getAllSizes = await fetch(`${ServerURI}/settings/items_size`);
    const allSizes = await getAllSizes.json();

    return {
        props: {
            getAllProducts: allProducts,
            getAllSizes: allSizes
        }
    }
}

export default Products;