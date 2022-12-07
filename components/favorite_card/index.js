import Link from "next/link";
import axios from "axios";
import Images from "../image_panel";
import { ServerURI } from "../../config";

const FavoriteCard = props => {
    const { favorite, setFavorite, cart, setCart, toast } = props;
    const { id, name_en, name_ar, extra_price, images } = props.data;

    const onAddFavorite = () => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: [...cart.filter(item => item.id != id).map(item => item.id), id]
        }

        axios.post(`${ServerURI}/settings/cart`, postData)
            .then(res => {
                toast.success('Favorite product has been added on cart', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            })
            .catch(err => console.log(err));
    }

    const onDelFavorite = () => {
        var postData = {
            token: sessionStorage.getItem("token"),
            product: favorite.filter(item => item.id != id).map(item => item.id)
        }

        axios.post(`${ServerURI}/settings/delFavorite`, postData)
            .then(res => {
                setFavorite(favorite.filter(item => item.id != id));
            })
            .catch(err => console.log(err));
    }

    return (
        <>
            <div className="fav-product">
                <Link href={{ pathname: '/products', query: { product: id } }}><a>
                    <div className="img-box">
                        <Images src={ServerURI + '/getfile?id=' + images[0]} alt="" />
                    </div>
                </a></Link>
                <div className="product-footer" dir="auto">
                    <div className="info">
                        <h5 className="title">{name_en}</h5>
                        <span className="price">{extra_price} SAR</span>
                    </div>
                    <div className="btns">
                        <button className="del" onClick={onDelFavorite}><i className="fa-solid fa-trash"></i></button>
                        <button className="add-bag" onClick={onAddFavorite}>Add To Bag</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FavoriteCard;