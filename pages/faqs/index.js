import Accordion from "../../components/accordion_item";

const faqs = [
    { title: 'هل التسوق عبر كنف آمن؟', content: 'Answers #1' },
    { title: 'هل اسعار منتجات كنف تتغير ام ثابتة؟', content: 'Answers #2' },
    { title: 'ماهي طرق الدفع التي تقبلها كنف؟', content: 'Answers #3' },
    { title: 'هل يمكن لي عملاء كنف اضافة كرت اهداء مخصص؟', content: 'Answers #4' },
    { title: 'ماهي اللازمة للشراء من موقع كنف', content: 'Answers #5' },
    { title: 'هل يتم دفع قيمة مباشرة من البطاقة الائتمانية عند الطلب؟', content: 'Answers #6' },
    { title: 'هل يمكن تعديل العنوان بعد تأكيد الطلب؟', content: 'Answers #7' },
    { title: 'ما هو الحكم الشرعي لشراء الذهب والمجهرات عن طريق الانترنت؟', content: 'Answers #8' },
    { title: 'كيف اعرف مقاسي المناسب؟', content: 'Answers #9' },
]

const FAQs = () => {
    return (
        <section className="faqs">
            <header className="text-center mt-5 mb-5">
                <h3 className="mb-4">Frequently Asked Questions</h3>
                <p className="pe-4 ps-4">
                    هنا ستجد ابرز الاسئلة الشائعة
                </p>
            </header>
            <div className="container w-100" dir="rtl">
                <div className="content w-100 ">
                    <div className="accordion accordion-flush" id="accordionFlushExample3">
                        {
                            faqs.map((item, index) => (
                                <Accordion key={index} data={{...item, index: index}} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQs;