import { useState, useEffect } from 'react';
import styles from '../styles/modal.module.css';

const Modal = (props) => {

    const [show, setShow] = useState(props.show);

    useEffect(() => {
        setShow(props.show);
    }, [props.show]);

    useEffect(() => {
        if(show){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'unset';
        }
    }, [show]);

    if(!show){
        return null;
    }

    return(
        <div className={styles.modalBg} onClick={(e)=>{
            if(props.cancelable){
                setShow(false);
                if(props.onModalClose){
                    props.onModalClose();
                }
            }
            e.stopPropagation();
        }}>
            <div onClick={(e)=>{if(props.onClick){props.onClick(e);}}} className={`${styles.modal} ${props.className}`}>
                {props.children}
            </div>
        </div>
    );
}
export default Modal;