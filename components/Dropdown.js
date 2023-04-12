import { useState } from 'react';
import styles from '../styles/dropdown.module.css';
import { MdArrowDropDown } from 'react-icons/md';

const Dropdown = (props) => {

    const options = props.options;
    const onSelectionChange = props.onSelectionChange;
    const selected = props.selected;

    const [ dropdownVisible, showDropdown ] = useState(false);

    let selectedOption = {};
    if(options){
        for(let i=0;i<options.length;i++){
            if(options[i].value === selected){
                selectedOption = options[i];
            }
        }
    }

    return (
        <div className={styles.dropdown_wrapper}>
            <button onBlur={(e)=>{ setTimeout(()=>{showDropdown(false);},150); }} onClick={(e)=>{
                showDropdown(!dropdownVisible);
            }} className={`${styles.dropdown_button} ${props.buttonClassName}`}>{selectedOption.label}<MdArrowDropDown /></button>
            {
                dropdownVisible ? 
                    <ul className={styles.dropdown_list}>
                        {
                            options && options.map((option,index)=>{
                                return (
                                    <li className={`${styles.option} ${selected === option.value ? styles.option_selected : ''}`} key={'dropdown_option_'+index} onClick={(e)=>{
                                        if(onSelectionChange){
                                            onSelectionChange(option.value);
                                        }
                                    }}>{option.text}</li>
                                )
                            })
                        }
                    </ul>
                :
                <></>
            }
        </div>
    )
};
export default Dropdown;