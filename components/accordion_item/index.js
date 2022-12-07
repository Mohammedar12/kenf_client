const Accordion = props => {
    const { index, title, content } = props.data;

    return (
        <div className="accordion-item">
            <h2 className="accordion-header" id={`flush-faq-${index}`}>
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target={`#flush-collapseFaq-${index}`} aria-expanded="false"
                    aria-controls={`flush-collapseFaq-${index}`}>
                    {title}
                </button>
            </h2>
            <div id={`flush-collapseFaq-${index}`} className="accordion-collapse collapse"
                aria-labelledby={`flush-faq-${index}`} data-bs-parent="#accordionFlushExample3">
                <div className="accordion-body">
                    {content}
                </div>
            </div>
        </div>
    )
}

export default Accordion;