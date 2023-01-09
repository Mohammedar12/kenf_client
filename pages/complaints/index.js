import React from 'react';
import FAQList from '../../containers/faqLists';
import { ServerURI } from "../../config";
import { useTranslation } from 'react-i18next';

const Complaints = props => {
    const { getAllComplaints } = props;
    const { t } = useTranslation();
    
    return (
        <>
            <section className="complaints">
                <header className="text-center mt-5 mb-5">
                    <h3 className="mb-4">{t('make_a_complaint')}</h3>
                    <p className="pe-4 ps-4">{t('complaint_description')}</p>
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