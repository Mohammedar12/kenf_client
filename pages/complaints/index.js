import React from 'react';
import FAQList from '../../containers/faqLists';
import { ServerURI } from "../../config";

const Complaints = props => {
    const { getAllComplaints } = props;
    
    return (
        <>
            <section className="complaints">
                <header className="text-center mt-5 mb-5">
                    <h3 className="mb-4">Make A Complaint</h3>
                    <p className="pe-4 ps-4">ستتم معالجة الشكوى خلال 48 ساعة وسيتم التواصل معكم عبر الايميل او رقم الجوال في حال
                        معالجتها </p>
                </header>
                    
                <FAQList getAllComplaints={getAllComplaints} />
            </section>
            <div className="back-drop"></div>
        </>
    )
}

export async function getServerSideProps() {
    const getAllComplaints = await fetch(`${ServerURI}/settings/complaints`);
    const allComplaints = await getAllComplaints.json();

    return {
        props: {
            getAllComplaints: allComplaints
        }
    }
}

export default Complaints;