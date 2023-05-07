import { useEffect, useContext } from "react";
import Modal from "@/components/Modal";
import styles from '../styles/login_modal.module.css';
import Image from "next/image";
// import Logo from '../public/images/logo-3.svg';
import Logo from '../public/images/Screenshot 2022-11-06 193206.png';
import { useTranslation } from "next-i18next";
import {MdEmail} from 'react-icons/md';
import {BsFillPhoneFill} from 'react-icons/bs';
import { useState } from "react";
import Dropdown from "@/components/Dropdown";
import axios from '../utils/noauth_axios';
import { AuthContext } from '../context/AuthContext';
import { IoCloseOutline } from 'react-icons/io5';

const phoneCountries = [
    { text: '🇮🇩 Algeria +213', label: '🇮🇩', value: '+213' },
    { text: '🇧🇭 Bahrain +973', label: '🇧🇭', value: '+973' },
    { text: '🇪🇬 Egypt +20', label: '🇪🇬', value: '+20' },
    { text: '🇮🇳 India +91', label: '🇮🇳', value: '+91' },
    { text: '🇰🇼 Kuwait +965', label: '🇰🇼', value: '+965' },
    { text: '🇸🇦 Saudi Arabia +966', label: '🇸🇦', value: '+966' },
];

const LoginModal = (props) => {

    const { show } = props;
    const { t, i18n } = useTranslation();
    const [ loginType, setLoginType ] = useState();
    const [ selectedPhoneCountry,  setSelectedPhoneCountry] = useState('+966');
    const [ resendSeconds, setResendSeconds ] = useState();
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ emailVerificationCode, setEmailVerificationCode ] = useState('');
    const [ phoneVerificationCode, setPhoneVerificationCode ] = useState('');
    const [ error, setError ] = useState();
    const [ loading, setLoading ] = useState(false);
    const { isAuth, setIsAuth } = useContext(AuthContext);

    useEffect(() => {
        if(!props.show){
            setLoginType();
            setSelectedPhoneCountry("+966");
            setResendSeconds();
            setEmail('');
            setPhone('');
            setEmailVerificationCode('');
            setPhoneVerificationCode('');
            setError('');
            setLoading(false);
        }
    }, [props.show]);

    useEffect(() => {
        const interval = setInterval(() => {
          if (resendSeconds > 0) {
            setResendSeconds(resendSeconds - 1);
          }
    
          if (resendSeconds === 0) {
            clearInterval(interval);
          }
        }, 1000);
    
        return () => {
          clearInterval(interval);
        };
    }, [resendSeconds]);

    const handleLoginButton = async() =>{
        if(resendSeconds === undefined || resendSeconds === null){
            return onSendOtp();
        }
        let data = {};
        if(loginType === 'phone'){
            data = {
                type: 'phone',
                phone: selectedPhoneCountry + phone,
                otp: phoneVerificationCode,
            };
        }
        else{
            data = {
                type: 'email',
                email: email,
                otp: emailVerificationCode,
            };
        }
        setLoading(true);
        try{
            const response = await axios.post('/auth/signin/verifyOtp',data);
            let user = { ...response.data.data, sessionCreatedAt: new Date().getTime() };
            localStorage.setItem("user", JSON.stringify(user));
            setIsAuth(user);
            if(props.onModalClose){
                props.onModalClose();
            }
        }
        catch(e){
            if (e.response && e.response.data) {
                setError(e.response.data.message);
            } else if (e.request) {
                setError("No response from server");
            }
            else{
                setError(e.message);
            } 
        }
        setLoading(false);
    }

    const onSendOtp = async()=>{
        let url = '';
        let data = {};
        if(loginType === 'phone'){
            url = '/auth/mobile/sendOtp';
            data = {
                phone: selectedPhoneCountry + phone,
            };
        }
        else{
            url = '/auth/email/sendOtp';
            data = {
                email: email,
            };
        }
        setLoading(true);
        try{
            const response = await axios.post(url,data);
            setResendSeconds(30);
        }
        catch(e){
            if (e.response && e.response.data) {
                setError(e.response.data.message);
            } else if (e.request) {
                setError("No response from server");
            }
            else{
                setError(e.message);
            } 
        }
        setLoading(false);
    }

    return(
        // <Modal show={show} onModalClose={props.onModalClose} cancelable={props.cancelable} className={styles.container} onClick={(e)=>{e.stopPropagation()}}>
        //     <IoCloseOutline onClick={() => {props.onModalClose()}} size={20} style={{position: 'absolute',top: 10, right:20, cursor: 'pointer'}}/>
        //     <div className={styles.header}>
        //         <Image
        //             className={styles.logo}
        //             src={Logo}
        //             alt="Kenf logog"
        //             width={100}
        //         />
        //     </div>
        //     {
        //         !loginType ?
        //             <>
        //                 <span className={styles.login_choose_title}>
        //                     {t("choose_way_to_login")}
        //                 </span>
        //                 <div className={styles.choose_container}>
        //                     <button aria-label="select login type phone" onClick={(e)=>{setLoginType('phone');e.stopPropagation();}} className={styles.choose_button}>
        //                         <span>{t("phone")}</span>
        //                         <BsFillPhoneFill size={18}/>
        //                     </button>
        //                     <button aria-label="select login type email" onClick={(e)=>{setLoginType('email');e.stopPropagation();}} className={styles.choose_button}>
        //                         <span>{t("email")}</span>
        //                         <MdEmail size={18}/>
        //                     </button>
        //                 </div>
        //             </>
        //         :
        //         <></>
        //     }
        //     {
        //         loginType === 'phone' ?
        //             <form onSubmit={(e)=>{e.preventDefault();handleLoginButton();}} className={styles.form_container} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        //                 <div className={styles.input_control}>
        //                     <label className={styles.input_label}>{t("phone")} *</label>
        //                     <div className={styles.input_container}>
        //                         <Dropdown buttonClassName={styles.dropdownButton} options={phoneCountries} selected={selectedPhoneCountry} onSelectionChange={(val)=>{setSelectedPhoneCountry(val);}}/>
        //                         <spa className={styles.country_code}>{selectedPhoneCountry}</spa>
        //                         <input value={phone} onChange={(e)=>{setPhone(e.target.value)}} className={styles.input} type="number"/>
        //                     </div>
        //                 </div>
        //                 {
        //                     resendSeconds !== undefined && resendSeconds !== null ?
        //                         <div className={styles.input_control}>
        //                             <label className={styles.input_label}>{t("verification_code")} *</label>
        //                             <div className={styles.input_container}>
        //                                 <input value={phoneVerificationCode} onChange={(e)=>{setPhoneVerificationCode(e.target.value)}} className={styles.input} type="text" placeholder={t("enter_verification_code")}/>
        //                             </div>
        //                         </div>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     error ? 
        //                     <p className={styles.error}>{error}</p>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     resendSeconds && resendSeconds !== 0 ?
        //                         <p>
        //                             Resend in {" "} {new Date(resendSeconds * 1000).toISOString().substring(14, 19)}
        //                         </p>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     resendSeconds === 0 && !loading ?
        //                         <button onClick={()=>{onSendOtp()}} className={styles.actionButton}>
        //                             {t("resend")}
        //                         </button>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     loading ?
        //                         <div className="spinner"></div>
        //                     :
        //                         <button onClick={()=>{handleLoginButton()}} className={styles.actionButton}>
        //                             {t("go")}
        //                         </button>
        //                 }
        //             </form>
        //         :
        //         <></>
        //     }
        //     {
        //         loginType === 'email' ?
        //             <form onSubmit={(e)=>{e.preventDefault();handleLoginButton();}} className={styles.form_container} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
        //                 <div className={styles.input_control}>
        //                     <label className={styles.input_label}>{t("email")} *</label>
        //                     <div className={styles.input_container}>
        //                         <MdEmail className={styles.email_icon}/>
        //                         <input value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder={t('email')} className={styles.input} type="email"/>
        //                     </div>
        //                 </div>
        //                 {
        //                     resendSeconds !== undefined && resendSeconds !== null ?
        //                         <div className={styles.input_control}>
        //                             <label className={styles.input_label}>{t("verification_code")} *</label>
        //                             <div className={styles.input_container}>
        //                                 <input value={emailVerificationCode} onChange={(e)=>{setEmailVerificationCode(e.target.value)}} className={styles.input} type="text" placeholder={t("enter_verification_code")}/>
        //                             </div>
        //                         </div>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     error ? 
        //                     <p className={styles.error}>{error}</p>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     resendSeconds && resendSeconds !== 0 ?
        //                         <p>
        //                             Resend in {" "} {new Date(resendSeconds * 1000).toISOString().substring(14, 19)}
        //                         </p>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     resendSeconds === 0 && !loading ?
        //                         <button onClick={()=>{onSendOtp()}} className={styles.actionButton}>
        //                             {t("resend")}
        //                         </button>
        //                     :
        //                     <></>
        //                 }
        //                 {
        //                     loading ? 
        //                         <div className="spinner"></div>
        //                     :
        //                         <button onClick={()=>{handleLoginButton()}} className={styles.actionButton}>
        //                             {t("go")}
        //                         </button>
        //                 }
        //             </form>
        //         :
        //         <></>
        //     }
        // </Modal>
        <Modal show={show} onModalClose={props.onModalClose} cancelable={props.cancelable} className={styles.container}  onClick={(e)=>{e.stopPropagation()}}>
        <div className={styles.imgContainer}>
          <img src="https://i.pinimg.com/564x/15/13/a6/1513a6b3f053b6f1f70337ddc14974f4.jpg" />
       </div>
       <div className={styles.loginContainer}>
          <IoCloseOutline onClick={() => {props.onModalClose()}} size={20} style={{position: 'absolute',top: 10, right:20, cursor: 'pointer'}}/>
             <div className={styles.header}>
            

              <Image
                  className={styles.logo}
                  src={Logo}
                  alt="Kenf logog"
                  width={90}
              />
               <h6>مرحبا بكم في كِنف</h6>
          </div>
          {
              !loginType ?
                  <>
                      <span className={styles.login_choose_title}>
                          {t("choose_way_to_login")}
                      </span>
                      <div className={styles.choose_container}>
                          <button aria-label="select login type phone" onClick={(e)=>{setLoginType('phone');e.stopPropagation();}} className={styles.choose_button}>
                              <span>{t("phone")}</span>
                              <BsFillPhoneFill size={18}/>
                          </button>
                          <button aria-label="select login type email" onClick={(e)=>{setLoginType('email');e.stopPropagation();}} className={styles.choose_button}>
                              <span>{t("email")}</span>
                              <MdEmail size={18}/>
                          </button>
                      </div>
                  </>
              :
              <></>
          }
          {
              loginType === 'phone' ?
                  <div className={styles.form_container}>
                      <div className={styles.input_control}>
                          <label className={styles.input_label}  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t("phone")} *</label>
                          <div className={styles.input_container}>
                              <Dropdown buttonClassName={styles.dropdownButton} options={phoneCountries} selected={selectedPhoneCountry} onSelectionChange={(val)=>{setSelectedPhoneCountry(val);}}/>
                              <spa className={styles.country_code}>{selectedPhoneCountry}</spa>
                              <input value={phone} onChange={(e)=>{setPhone(e.target.value)}} onKeyDown={(e) => {e.key === "Enter" && handleLoginButton() }} className={styles.input} type="number"/>
                          </div>
                      </div>
                      {
                          resendSeconds !== undefined && resendSeconds !== null ?
                              <div className={styles.input_control}>
                                  <label className={styles.input_label}>{t("verification_code")} *</label>
                                  <div className={styles.input_container}>
                                    <input value={phoneVerificationCode} onChange={(e)=>{setPhoneVerificationCode(e.target.value)}} onInput={(e) => { e.target.value.length === 4 && handleLoginButton()}} className={styles.input} type="text" placeholder={t("enter_verification_code")}/>
                                  </div>
                              </div>
                          :
                          <></>
                      }
                      {
                          error ? 
                          <p className={styles.error}>{error}</p>
                          :
                          <></>
                      }
                      {
                          resendSeconds && resendSeconds !== 0 ?
                              <p>
                                  Resend in {" "} {new Date(resendSeconds * 1000).toISOString().substring(14, 19)}
                              </p>
                          :
                          <></>
                      }
                      {
                          resendSeconds === 0 && !loading ?
                              <button onClick={()=>{onSendOtp()}} className={styles.actionButton}>
                                  {t("resend")}
                              </button>
                          :
                          <></>
                      }
                      {
                          loading ?
                              <div className="spinner"></div>
                          :
                              <button onClick={()=>{handleLoginButton()}} className={styles.actionButton}>
                                  {t("go")}
                              </button>
                      }
                  </div>
              :
              <></>
          }
          {
              loginType === 'email' ?
                  <div className={styles.form_container}>
                      <div className={styles.input_control}>
                          <label className={styles.input_label}  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>{t("email")} *</label>
                          <div className={styles.input_container}>
                              <MdEmail className={styles.email_icon}/>
                              <input value={email} onChange={(e)=>{setEmail(e.target.value)}} onKeyDown={(e) => {e.key === "Enter" && handleLoginButton() }} placeholder={t('email')} className={styles.input} type="email"/>
                          </div>
                      </div>
                      {
                          resendSeconds !== undefined && resendSeconds !== null ?
                              <div className={styles.input_control}>
                                  <label className={styles.input_label}>{t("verification_code")} *</label>
                                  <div className={styles.input_container}>
                                      <input value={emailVerificationCode} onChange={(e)=>{setEmailVerificationCode(e.target.value)}} onInput={(e) => { e.target.value.length === 4 && handleLoginButton()}} className={styles.input} type="text" placeholder={t("enter_verification_code")}/>
                                  </div>
                              </div>
                          :
                          <></>
                      }
                      {
                          error ? 
                          <p className={styles.error}>{error}</p>
                          :
                          <></>
                      }
                      {
                          resendSeconds && resendSeconds !== 0 ?
                              <p>
                                  Resend in {" "} {new Date(resendSeconds * 1000).toISOString().substring(14, 19)}
                              </p>
                          :
                          <></>
                      }
                      {
                          resendSeconds === 0 && !loading ?
                              <button onClick={()=>{onSendOtp()}} className={styles.actionButton}>
                                  {t("resend")}
                              </button>
                          :
                          <></>
                      }
                      {
                          loading ? 
                              <div className="spinner"></div>
                          :
                              <button onClick={()=>{handleLoginButton()}} className={styles.actionButton}>
                                  {t("go")}
                              </button>
                      }
                  </div>
              :
              <></>
          }
       </div>
      
      </Modal>
    );
}
export default LoginModal;
