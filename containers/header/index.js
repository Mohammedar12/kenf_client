import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import { ToastContainer, toast } from 'react-toastify';
import Images from '../../components/image_panel';
import { AuthContext } from '../../components/auth_context';
import 'react-phone-input-2/lib/style.css';

import Topbar from "../../components/topbar_panel";
import Mobile from "../../components/mobile_panel";

import { ServerURI } from "../../config";

const initEmailVal = {
    email: '',
    emailConfirmCode: ''
}

const initPhoneVal = {
    phone: '',
    phoneConfirmCode: ''
}

const Header = () => {
    const [email, setEmail] = useState(initEmailVal);
    const [phone, setPhone] = useState(initPhoneVal);
    const [verifyCode, setVerifyCode] = useState('0000');

    const [allGroups, setAllGroups] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [allCategories, setAllCategories] = useState([]);

    const [type, setType] = useState(null);
    const { isAuth, setIsAuth } = useContext(AuthContext);

    useEffect(() => {
        // GET Product
        axios.get(`${ServerURI}/product`)
            .then(res => setAllProducts(res.data))
            .catch(err => console.log(err));

        // GET Group
        axios.get(`${ServerURI}/settings/items_group`)
            .then(res => setAllGroups(res.data))
            .catch(err => console.log(err));

        // GET Category
        axios.get(`${ServerURI}/settings/items_category`)
            .then(res => setAllCategories(res.data))
            .catch(err => console.log(err));
    }, []);

    const onSignIn = data => {
        axios.post(`${ServerURI}/register`, data)
            .then(res => {
                sessionStorage.setItem("token", res.data);
            })
            .catch(err => console.log(err));

        $("#staticBackdrop").modal('hide');
        setIsAuth(true);
        onInitialModal();
    }

    const onInitialModal = () => {
        setType(null);
        setVerifyCode("0000");
        setEmail(initEmailVal);
        setPhone(initPhoneVal);
    }
      
    const showEmailCode = () => {
        if (verifyCode === '0000') {
            axios.post(`${ServerURI}/emailverify`, { email: email.email }).then(res => {
                if (res.data.status == '200') {
                    setVerifyCode(res.data.code); 
                }
            });
        } else {
            if (verifyCode == email.emailConfirmCode) {
                onSignIn({email: email.email});
            } else {
                onInitialModal();

                toast.error('Confirmcode is wrong', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
    }
      
    const showPhoneCode = () => {
        if (verifyCode === '0000') {
            axios.post(`${ServerURI}/phoneverify`, { phone: phone.phone }).then(res => {
                setVerifyCode(res.data.code); 
            });
        } else {
            if (verifyCode == phone.phoneConfirmCode) {
                onSignIn({phone: phone.phone});
            } else {
                onInitialModal();

                toast.error('Confirmcode is wrong', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
            }
        }
    }

    $("#staticBackdrop").on("hidden.bs.modal", function (e) {
        onInitialModal();
    });
    
    return (
        <>
            <nav className="nav">
                <Topbar products={allProducts} />
                <Mobile groups={allGroups} categories={allCategories} />
            </nav>

            <div className="login-modal modal fade" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header align-items-start border-0 pb-0">
                            <h5 className="modal-titled d-flex flex-column  align-items-center text-center w-100" id="staticBackdropLabel">
                                <Images classnames="m-3" src="images/logo-3.svg" alt="" width="100px" />
                            </h5>
                        </div>
                        <div className="modal-body border-0 p-0 pb-3">
                            {
                                type == null &&
                                    <span className="login-title text-center d-block">Choese Way To login</span>
                            }
                            {
                                type == "email" &&
                                    <>
                                        <form className="field-email show-this-block d-none">
                                            <div
                                                className="email-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                                                <label htmlFor="email">* Email</label>
                                                <input dir="rtl" className="w-100 ps-5 pe-2 p-1 mt-1 rounded-1" type="email" id="email" placeholder="Email" style={{border: "1px solid #ccc"}} value={email.email} onChange={e => setEmail({...email, email: e.target.value})} required />
                                                <i className="fa-solid fa-envelope p-1 position-absolute" style={{top: 33.3, left: 20}}></i>
                                            </div>

                                            <div className={"verification-email d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative " + (verifyCode == "0000" ? "d-none" : "show-this-flex")}>
                                                <label htmlFor="email">* Verification code</label>
                                                <input dir="rtl" className="w-100 ps-5 pe-2 p-1 mt-1" type="text" id="email" name="code" placeholder="Enter verification code" maxLength="4" style={{border: "1px solid #ccc"}} value={email.emailConfirmCode} onChange={e => setEmail({...email, emailConfirmCode: e.target.value})} required />
                                            </div>

                                            <div className="submit w-100  text-center pe-4 ps-4">
                                                <input type="button" className="btn w-100 shadow-none text-light mt-2" style={{backgroundColor: "var(--main-color)"}} value="Go" onClick={showEmailCode} />
                                            </div>
                                        </form>
                                    </>
                            }

                            {
                                type == "phone" &&
                                    <>
                                        <form className="field-phone show-this-block d-none">

                                            <div
                                                className="phone-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                                                <label htmlFor="">* phone</label>
                                                <PhoneInput width="100%" className="mt-1" country={'sa'} value={phone.phone} onChange={e => setPhone({...phone, phone: e})} onlyCountries={['sa', 'eg', 'dz', 'bh', 'kw']} />
                                            </div>

                                            {
                                                verifyCode != "0000" &&
                                                    <div className="verification-phone d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative d-none show-this-flex">
                                                        <label htmlFor="phone">* Verification code</label>
                                                        <input dir="rtl" className="w-100 ps-5 pe-2 p-1 mt-1" type="text" id="phone" name="code" placeholder="Enter verification code" maxLength="4" style={{border: "1px solid #ccc"}} value={phone.phoneConfirmCode} onChange={e => setPhone({...phone, phoneConfirmCode: e.target.value})} required />
                                                        {/* { phone.phoneConfirmCode != verifyCode && phone.phoneConfirmCode.length == 4 && <p className='form_error'>Confirm code is wrong</p> } */}
                                                    </div>
                                            }

                                            <div className="submit w-100  text-center pe-4 ps-4">
                                                <input type="button" className="btn  w-100 shadow-none text-light mt-2" style={{backgroundColor: "var(--main-color)"}} value="Go" onClick={showPhoneCode} required />
                                            </div>
                                        </form>
                                    </>
                            }
                        </div>
                        {
                            type == null &&
                                <div className="modal-footer justify-content-center ">
                                    <button type="button" className="btn email login-modal-btn" onClick={() => setType('email')}>
                                        Email <i className="fa-solid fa-envelope p-1"></i>
                                    </button>
                                    <button type="button" className="btn phone login-modal-btn" onClick={() => setType('phone')}>
                                        Phone <i className=" fa-solid fa-mobile p-1"></i>
                                    </button>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Header;