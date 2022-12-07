import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { Input, TextArea } from "../../components/text_field";
import { ServerURI } from '../../config';
import Images from "../../components/image_panel";

const initValue = {
    name: '',
    title: '',
    email: '',
    complaints: '',
    images: '',
};

const FAQList = props => {
    const { getAllComplaints } = props;
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [showComplaints, setShowComplaints] = useState(initValue);
    const [showAnsweredComplaints, setShowAnsweredComplaints] = useState(initValue);
    const [allComplaints, setAllComplaints] = useState(getAllComplaints);

    useEffect(() => {
    }, [allComplaints]);

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('files', data.files[0])
        formData.append('title', data.title)
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('complaints', data.complaints)
        
    axios.post(`${ServerURI}/settings/complaints`, formData)
        .then(res => {
            toast.success('Complaint has been sent', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
            });

            setAllComplaints([...allComplaints, {
                name: data.name,
                title: data.title,
                email: data.email,
                complaints: data.complaints,
                images: res.data.id
            }]);
            
            reset();
            
            document.querySelector("#image_panel img").src = "../images/upload_photo.png";
        })
        .catch(err => console.log(err));
    }

    // const onShowReview = item => {
    //     document.querySelector(".ticket-review .ticket-modal, .back-drop").style.display = 'block';
    //     scrollTo(top);

    //     setShowComplaints(item);
    // }

    const onShowAnswerdReview = item => {
        document.querySelector(".ticket-answered .ticket-modal, .back-drop").style.display = 'block';
        scrollTo(top);

        setShowAnsweredComplaints(item);
    }

    return (
        <div className="container d-flex w-100" dir="rtl">
            <div className="content_one w-100 ">
                <div className="content">
                    <div className="accordion" id="accordionFlushExample1">
                        <div className="accordion-item ">
                            <h2 className="accordion-header" id="flush-ticketOne">
                                <button className="accordion-button " type="button" data-bs-toggle="collapse"
                                    data-bs-target="#flush-collapseTicketOne" aria-expanded="false"
                                    aria-controls="flush-collapseTicketOne">
                                    New Tickit
                                </button>
                            </h2>
                            <div id="flush-collapseTicketOne" className="accordion-collapse collapse show"
                                aria-labelledby="flush-ticketOne" data-bs-parent="#accordionFlushExample1">
                                <div className="accordion-body">
                                    <form id='form_elem' className="Ticket_form" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="inputs" dir="rtl">
                                            <Input 
                                                type="text" 
                                                name="title"
                                                errors={errors} 
                                                register={register}
                                                placeholder="Ticket Title"
                                                validationSchema={{ 
                                                    required: "Title field is required",
                                                }}
                                            />
                                            <Input 
                                                type="text" 
                                                name="name"
                                                errors={errors} 
                                                register={register}
                                                placeholder="Your Name"
                                                validationSchema={{ 
                                                    required: "Name field is required",
                                                }}
                                            />
                                            <Input 
                                                type="email" 
                                                name="email"
                                                errors={errors} 
                                                register={register}
                                                placeholder="Email"
                                                validationSchema={{ 
                                                    required: "Email field is required",
                                                }}
                                            />
                                            <TextArea 
                                                type="text" 
                                                rows="10"
                                                name="complaints"
                                                errors={errors} 
                                                register={register}
                                                placeholder="The Complaints"
                                                validationSchema={{ 
                                                    required: "Complaints field is required",
                                                }}
                                            />
                                        </div>
                                        <div className="form-footer">
                                            <div className="upload">
                                                <input type="file" name="files" {...register('files')} id="file" />
                                                <label htmlFor="file" id="image_panel" className="upload_btn d-flex flex-column align-items-center gap-3">
                                                    <Images src="../images/upload_photo.png" alt="" width="80px" />
                                                    <span>Upload Photo For Problem</span>
                                                </label>
                                            </div>
                                            <div className="submit">
                                                <input type="submit" value="Send Ticket" />
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
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
                                    Tickets Under Review
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse"
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
                                                            <div className="inputs" dir="rtl">
                                                                <input type="text" placeholder="Your Name" disabled
                                                                    value={showComplaints?.name} />
                                                                <input type="email" placeholder="Email" disabled
                                                                    value={showComplaints?.email} />
                                                                <textarea name="" id="" rows="4"
                                                                    placeholder="The Complaint"
                                                                    defaultValue={showComplaints?.complaints}
                                                                    disabled />
                                                            </div>
                                                            <div className="uploaded-img text-center rounded-2">
                                                                <Images classnames="img-fluid rounded-2" src={showComplaints.images ? (ServerURI + showComplaints.images.link) : "https://developers.google.com/static/maps/documentation/maps-static/images/error-image-signature.png"} alt="" />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="modal-footer justify-content-center">
                                                        <button type="button" className="btn btn-dark ticket-modal-btn" data-bs-dismiss="modal" id="close-review">Close</button>
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
                                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseTwo">
                                    Tickets Answered
                                </button>
                            </h2>
                            <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse"
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
                                                        <p>We Have Answered You On Your Email</p>
                                                    </div>
                                                    <div className="modal-footer justify-content-center">
                                                        <button type="button" className="btn btn-dark ticket-modal-btn" data-bs-dismiss="modal" id="close-answered">Close</button>
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
            <ToastContainer />
        </div>
    )
}

export default FAQList;