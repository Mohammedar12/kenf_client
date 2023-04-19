import React, { useState, useEffect } from "react";
import axios from '../../utils/auth_axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { setCookie } from 'cookies-next';
import { Input, TextArea } from "../../components/Input";
import Image from "next/image";
import UploadPhoto from "../../public/images/upload_photo.png";

const initValue = {
    name: '',
    title: '',
    email: '',
    complaints: '',
    images: '',
};

const Complaints = (props) => {

    const { complaints } = props;
    const { t, i18n } = useTranslation();

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showComplaints, setShowComplaints] = useState(initValue);
    const [showAnsweredComplaints, setShowAnsweredComplaints] = useState(initValue);
    const [allComplaints, setAllComplaints] = useState([]);

    const [ newTicketVisible, showNewTicket ] = useState(true);
    const [ ticketUnderReviewVisible, showTicketUnderReview ] = useState(false);
    const [ answeredTicketVisible, showAnsweredTicket ] = useState(false);

    const onSubmit = async (data) => {
    }
    
    return (
        <>
            <section className="complaints">
                <header className="text-center mt-5 mb-5">
                    <h3 className="mb-4">{t('make_a_complaint')}</h3>
                    <p className="pe-4 ps-4">{t('complaint_description')}</p>
                </header>
                {/* <FAQList getAllComplaints={getAllComplaints} /> */}
                <div className="container d-flex w-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="content_one w-100 ">
                        <div className="content">
                            <div className="accordion" id="accordionFlushExample1">
                                <div className="accordion-item ">
                                    <h2 className="accordion-header" id="flush-ticketOne">
                                        <button className={`accordion-button ${newTicketVisible ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#flush-collapseTicketOne" aria-expanded="false"
                                            aria-controls="flush-collapseTicketOne" onClick={()=>{showNewTicket(!newTicketVisible)}}>
                                            {t('new_ticket')}
                                        </button>
                                    </h2>
                                    <div id="flush-collapseTicketOne" className={`accordion-collapse collapse ${newTicketVisible ? 'show' : ''}`}
                                        aria-labelledby="flush-ticketOne" data-bs-parent="#accordionFlushExample1">
                                        <div className="accordion-body">
                                            <form id='form_elem' className="Ticket_form" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="inputs" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                                                    <Input 
                                                        type="text" 
                                                        name="title"
                                                        errors={errors} 
                                                        register={register}
                                                        placeholder={t('ticket_title')}
                                                        validationSchema={{ 
                                                            required: t('error.title.required'),
                                                        }}
                                                    />
                                                    <Input 
                                                        type="text" 
                                                        name="name"
                                                        errors={errors} 
                                                        register={register}
                                                        placeholder={t('your_name')}
                                                        validationSchema={{ 
                                                            required: t('error.name.required'),
                                                        }}
                                                    />
                                                    <Input 
                                                        type="email" 
                                                        name="email"
                                                        errors={errors} 
                                                        register={register}
                                                        placeholder={t('email')}
                                                        validationSchema={{ 
                                                            required: t('error.email.required'),
                                                        }}
                                                    />
                                                    <TextArea 
                                                        type="text" 
                                                        rows="10"
                                                        name="complaints"
                                                        errors={errors} 
                                                        register={register}
                                                        placeholder={t('complaint')}
                                                        validationSchema={{ 
                                                            required: t('error.complaint.required'),
                                                        }}
                                                    />
                                                </div>
                                                <div className="form-footer">
                                                    <div className="upload">
                                                        <input type="file" name="files" {...register('files')} id="file" />
                                                        <label htmlFor="file" id="image_panel" className="upload_btn d-flex flex-column align-items-center gap-3">
                                                            <Image src={UploadPhoto} alt="..." width={80} />
                                                            <span>{t('upload_photo_for_problem')}</span>
                                                        </label>
                                                    </div>
                                                    <div className="submit">
                                                        <input type="submit" value={t('send_ticket')} />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="content_two w-100">
                        <div className="content">
                            <div className="accordion" id="accordionFlushExample2">
                                <div className="accordion-item ">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                                        <button className={`accordion-button ${ ticketUnderReviewVisible ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseOne" onClick={()=>{showTicketUnderReview(!ticketUnderReviewVisible)}}>
                                            {t('tickets_under_review')}
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseOne" className={`accordion-collapse collapse ${ticketUnderReviewVisible ? 'show' : ''}`}
                                        aria-labelledby="panelsStayOpen-headingOne">
                                        <div className="accordion-body ">
                                            <ul className="tickets-list">
                                                {
                                                    allComplaints?.filter((item) => !item.deleted && !item.answer).map((item, index) => (
                                                        <li key={index} className="ticket" id="review" onClick={() => setShowComplaints(item)} data-bs-toggle="modal" data-bs-target="#ticket-modal">{item.title}</li>
                                                    ))
                                                }
                                            </ul>
                                            <div className="ticket-review">
                                                <div className="modal fade" id="ticket-modal" tabIndex="-1" aria-labelledby="ticket-modal" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered m-auto ticket-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="ticket-modal-title">{showComplaints.title}</h5>
                                                            </div>
                                                            <div className="modal-body">
                                                                <form action="" className="Ticket_form ">
                                                                    <div className="inputs" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                                                                        <input type="text" placeholder={t('your_name')} disabled
                                                                            value={showComplaints?.name} />
                                                                        <input type="email" placeholder={t('email')} disabled
                                                                            value={showComplaints?.email} />
                                                                        <textarea name="" id="" rows="4"
                                                                            placeholder={t('complaint')}
                                                                            defaultValue={showComplaints?.complaints}
                                                                            disabled />
                                                                    </div>
                                                                    <div className="uploaded-img text-center rounded-2">
                                                                        <img classnames="img-fluid rounded-2" src={showComplaints.images ? (ServerURI + showComplaints.images.link) : "https://developers.google.com/static/maps/documentation/maps-static/images/error-image-signature.png"} alt="" />
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div className="modal-footer justify-content-center">
                                                                <button type="button" className="btn btn-dark ticket-modal-btn" data-bs-dismiss="modal" id="close-review">{t('close')}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                                        <button className={`accordion-button ${ answeredTicketVisible ? '' : 'collapsed'}`} type="button" data-bs-toggle="collapse"
                                            data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                            aria-controls="panelsStayOpen-collapseTwo" onClick={()=>{showAnsweredTicket(!answeredTicketVisible)}}>
                                            {t('tickets_answered')}
                                        </button>
                                    </h2>
                                    <div id="panelsStayOpen-collapseTwo" className={`accordion-collapse collapse ${answeredTicketVisible ? 'show' : ''}`}
                                        aria-labelledby="panelsStayOpen-headingTwo">
                                        <div className="accordion-body">
                                            <ul className="tickets-list">
                                                {
                                                    allComplaints?.filter((item) => !item.deleted && item.answer).map((item, index) => (
                                                        <li key={index} className="ticket answered" id="answered" onClick={() => setShowAnsweredComplaints(item)} data-bs-toggle="modal" data-bs-target="#ticket-answer-modal">{item.title}</li>
                                                    ))
                                                }
                                            </ul>
                                            <div className="ticket-answered">
                                                <div className="modal fade" id="ticket-answer-modal" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="ticket-answer-modal" aria-hidden="true">
                                                    <div className="modal-dialog ticket-dialog modal-dialog-centered m-auto">
                                                        <div className="modal-content">
                                                            <div className="modal-header justify-content-center">
                                                                <h5 className="ticket-modal-title ">{showAnsweredComplaints.title}</h5>
                                                            </div>
                                                            <div className="modal-body text-center">
                                                                <p>{t('we_have_answered_you_on_your_email')}</p>
                                                            </div>
                                                            <div className="modal-footer justify-content-center">
                                                                <button type="button" className="btn btn-dark ticket-modal-btn" data-bs-dismiss="modal" id="close-answered">{t('close')}</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className="back-drop"></div>
            <ToastContainer />
        </>
    )
}

export default Complaints;

export async function getServerSideProps({ req, locale, res }) {
    // let complaints = {};
    // try{
    //     user = await axios.get('/user/profile',{
    //         withCredentials: true,
    //         headers: {
    //             Cookie: req.headers?.cookie ? req.headers.cookie : '',
    //             token: process.env.AUTH_TOKEN
    //         }
    //     });
    //     user = user.data.data;
    // }
    // catch(e){
    //     if(e.response?.status == 401){
    //         setCookie('login', 'true', { req, res, maxAge: 10 });
    //         return {
    //             redirect: {
    //                 destination: '/',
    //                 permanent: false,
    //             }
    //         }
    //     }
    // }
    let groups = [];
    let categories = [];
    try{
    const appData = await getAppData();
    groups = appData.groups;
    categories = appData.categories;
    }
    catch(e){}
    
    return {
      props: {
        groups,
        categories,
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }