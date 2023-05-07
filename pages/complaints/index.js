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
import useSWRInfinite from 'swr/infinite';
import { imageURI } from "@/config";
import Modal from "@/components/Modal";

const initValue = {
    name: '',
    title: '',
    email: '',
    complaints: '',
    images: '',
};

const fetcher = async(url)=>{
    return (await axios.get(url)).data.data;
}

const Complaints = (props) => {

    const { t, i18n } = useTranslation();

    const { register, handleSubmit, setValue, setError, clearErrors, reset, formState: { errors } } = useForm();

    const [ selectedComplain, setSelectedComplain ] = useState();

    const [ newTicketVisible, showNewTicket ] = useState(true);
    const [ ticketUnderReviewVisible, showTicketUnderReview ] = useState(false);
    const [ answeredTicketVisible, showAnsweredTicket ] = useState(false);

    const [ createTicketLoading, setCreateTicketLoading ] = useState(false);

    const {
        data: answeredComplaintsData,
        size: answeredComplaintsSize,
        setSize: answeredComplaintsSetSize,
        isLoading: answeredComplaintsLoading,
        mutate: answeredComplaintsMutate,
    } = useSWRInfinite( (index) => `settings/complaints/?answered=true&limit=${5}&page=${ index + 1 }&sort=-updatedAt` , fetcher, { fallbackData: props.unansweredComplaints, revalidateOnFocus: false  });

    const {
        data: unansweredComplaintsData,
        size: unansweredComplaintsSize,
        setSize: unansweredComplaintsSetSize,
        isLoading: unansweredComplaintsLoading,
        mutate: unansweredComplaintsMutate,
    } = useSWRInfinite( (index) => `settings/complaints/?answered=false&limit=${5}&page=${ index + 1 }` , fetcher, { fallbackData: props.answeredComplaints, revalidateOnFocus: false  });


    const unansweredComplaints = unansweredComplaintsData ? [].concat(...(unansweredComplaintsData.map((val)=>val.docs ? val.docs: []))) : [];
    const isUnAnsweredComplaintsReachingEnd = unansweredComplaintsData && unansweredComplaintsData.length != 0 ? unansweredComplaintsData[unansweredComplaintsData.length-1].hasNextPage === false : true;
    
    const answeredComplaints = answeredComplaintsData ? [].concat(...(answeredComplaintsData.map((val)=>val.docs ? val.docs : []))) : [];
    const isAnsweredComplaintReachingEnd = answeredComplaintsData && answeredComplaintsData.length != 0 ? answeredComplaintsData[answeredComplaintsData.length-1].hasNextPage === false : true;

    const onSubmit = async (data) => {
        setCreateTicketLoading(true);
        const formData = new FormData();
        if(data.files && data.files.length > 0 ){
            formData.append('files', data.files[0]);
        }
        formData.append('title', data.title)
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('complaints', data.complaints)
        
        axios.post('settings/complaints', formData,{
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            .then(res => {
                toast.success('Complaint has been sent', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                });
                // setAllComplaints([...allComplaints, {
                //     name: data.name,
                //     title: data.title,
                //     email: data.email,
                //     complaints: data.complaints,
                //     images: res.data.id
                // }]);
                reset();
                document.querySelector("#image_panel img").src = "../images/upload_photo.png";
                setCreateTicketLoading(false);
            })
            .catch(err => {
                if(err.response?.data){
                    if(!err.response.data.errors){
                        toast.error(err.response.data.message, {
                            position: "top-right",
                            autoClose: 3000,
                            hideProgressBar: true,
                        });
                    }
                    else{
                        //set errors
                        for (let errorKey in err.response.data.errors) {
                            setError(errorKey,{
                                message: err.response.data.errors[errorKey].message,
                                type: 'custom'
                            },{ shouldFocus: true });
                        }
                    }
                }
                else {
                    toast.error(err.message, {
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                    });
                }
                setCreateTicketLoading(false);
            });
    }
    
    return (
        <>
            <section className="complaints">
                <header className="text-center mt-5 mb-5">
                    <h3 className="mb-4">{t('make_a_complaint')}</h3>
                    <p className="pe-4 ps-4">{t('complaint_description')}</p>
                </header>
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
                                                        {
                                                            createTicketLoading ?
                                                            <div className="spinner"></div>
                                                            :
                                                            <input type="submit" value={t('send_ticket')} />
                                                        }
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
                                                    unansweredComplaints?.map((item, index) => (
                                                        <li key={index} className="ticket" id="review" onClick={() => setSelectedComplain(item)} data-bs-toggle="modal" data-bs-target="#ticket-modal">{item.title}</li>
                                                    ))
                                                }
                                            </ul>
                                            {
                                                unansweredComplaintsLoading && <div className='spinner' style={{ marginLeft: 'auto' , marginRight: 'auto'}}></div>
                                            }
                                            {
                                                !unansweredComplaintsLoading && !isUnAnsweredComplaintsReachingEnd ? <button onClick={()=>{unansweredComplaintsSetSize(unansweredComplaintsSize+1)}} className="load_more_btn">Load more</button> : <></>
                                            }
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
                                                    answeredComplaints?.map((item, index) => (
                                                        <li key={index} className="ticket answered" id="answered" onClick={() => setSelectedComplain(item)} data-bs-toggle="modal" data-bs-target="#ticket-answer-modal">{item.title}</li>
                                                    ))
                                                }
                                            </ul>
                                            {
                                                answeredComplaintsLoading && <div className='spinner' style={{ marginLeft: 'auto' , marginRight: 'auto'}}></div>
                                            }
                                            {
                                                !answeredComplaintsLoading && !isAnsweredComplaintReachingEnd ? <button onClick={()=>{answeredComplaintsSetSize(answeredComplaintsSize+1)}} className="load_more_btn">Load more</button> : <></>
                                            }
                                            {/* <div className="ticket-answered">
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
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Modal show={selectedComplain ? true : false} className="">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="ticket-modal-title">{selectedComplain?.title}</h5>
                    </div>
                    {
                        selectedComplain?.answer ?
                        <div className="modal-body text-center">
                            <p>{t('we_have_answered_you_on_your_email')}</p>
                        </div>
                        :
                        <div className="modal-body">
                            <form action="" className="Ticket_form ">
                                <div className="inputs" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <input type="text" placeholder={t('your_name')} disabled
                                        value={selectedComplain?.name} />
                                    <input type="email" placeholder={t('email')} disabled
                                        value={selectedComplain?.email} />
                                    <textarea name="" id="" rows="4"
                                        placeholder={t('complaint')}
                                        defaultValue={selectedComplain?.complaints}
                                        disabled />
                                </div>
                                <div className="uploaded-img text-center rounded-2">
                                    <img classnames="img-fluid rounded-2" style={{ width: '100%', margin: 10 }} src={selectedComplain?.images ? (imageURI + selectedComplain.images[0]) : ""} alt="..." />
                                </div>
                            </form>
                        </div>
                    }
                    <div className="modal-footer justify-content-center">
                        <button type="button" className="btn btn-dark ticket-modal-btn" data-bs-dismiss="modal" id="close-review" onClick={()=>{setSelectedComplain()}}>{t('close')}</button>
                    </div>
                </div>
            </Modal>
            <div className="back-drop"></div>
            <ToastContainer />
        </>
    )
}

export default Complaints;

export async function getServerSideProps({ req, locale, res }) {
    let unansweredComplaints = [];
    let answeredComplaints = [];
    try{
        unansweredComplaints = await axios.get('settings/complaints/?answered=false&limit=5&page=1',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : ''
            }
        });
        unansweredComplaints = unansweredComplaints.data.data.docs;
        answeredComplaints = await axios.get('settings/complaints/?answered=true&limit=5&page=1&sort=-updatedAt',{
            withCredentials: true,
            headers: {
                Cookie: req.headers?.cookie ? req.headers.cookie : ''
            }
        });
        answeredComplaints = answeredComplaints.data.data.docs;
    }
    catch(e){
        if(e.response?.status == 401){
            setCookie('login', 'true', { req, res, maxAge: 10 });
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }
    }
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
        unansweredComplaints: [unansweredComplaints],
        answeredComplaints: [answeredComplaints],
        ...(await serverSideTranslations(locale, ['common'])),
      }, 
    }
  }