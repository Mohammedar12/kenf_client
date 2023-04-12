import { AuthContext } from "@/context/AuthContext";
import { useContext, useEffect, useState } from "react";
import {MdFavoriteBorder, MdFavorite} from "react-icons/md";
import axios from '../utils/auth_axios';

export default function FavoriteButton({ liked, productId, className = '' }){
    
    const {isAuth} = useContext(AuthContext);

    const [isLiked, setIsLiked] = useState(liked);
    const [loading, setIsLoading] = useState(false);
    const [_productId, setProductId] = useState();

    useEffect(()=>{
        setProductId(productId);
        setIsLiked(liked);
    },[liked, productId]);

    const onLickClick = async () => {
        setIsLoading(true);
        try{
            let likeRes;
            if(isLiked !== true)
                likeRes = await axios.post('/user/favorite',{ productId: _productId });
            else
                likeRes = await axios.delete('/user/favorite/'+_productId);
            setIsLiked(!isLiked);
        }
        catch(e){}
        setIsLoading(false);
    };
    
    if(!isAuth){
        return <></>
    }

    if(loading){
        return <div className={className}><div className="spinner"></div></div>
    }

    return(
        <div className={className}>
            <button onClick={onLickClick} style={{ backgroundColor: 'transparent', border: 0 }}>
                {
                    isLiked === true ? 
                    <MdFavorite size={22} />
                    :
                    <MdFavoriteBorder size={22} />
                }
            </button>
        </div>
    );
}