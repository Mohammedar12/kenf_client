import Accordion from "../../components/accordion_item";
import { useTranslation } from "react-i18next";
import i18n from "../../config/i18n";

const faqs = [
    { title_en: 'Is it safe to shop online?', content_en: 'Answers #1', title_ar: 'هل التسوق عبر كنف آمن؟', content_ar: 'الإجابات # 1' },
    { title_en: 'Are the prices of Knaf products changing or fixed?', content_en: 'Answers #2', title_ar: 'هل اسعار منتجات كنف تتغير ام ثابتة؟', content_ar: 'الإجابات # 2' },
    { title_en: 'What are the payment methods accepted by Knaf?', content_en: 'Answers #3', title_ar: 'ماهي طرق الدفع التي تقبلها كنف؟', content_ar: 'الإجابات # 3' },
    { title_en: 'Can Knaf clients add a customized gift card?', content_en: 'Answers #4', title_ar: 'هل يمكن لي عملاء كنف اضافة كرت اهداء مخصص؟', content_ar: 'الإجابات # 4' },
    { title_en: 'What are the requirements for purchasing from the Knaf website?', content_en: 'Answers #5', title_ar: 'ماهي اللازمة للشراء من موقع كنف', content_ar: 'الإجابات # 5' },
    { title_en: 'Is the value paid directly from the credit card upon request?', content_en: 'Answers #6', title_ar: 'هل يتم دفع قيمة مباشرة من البطاقة الائتمانية عند الطلب؟', content_ar: 'الإجابات # 6' },
    { title_en: 'Can the address be modified after order confirmation?', content_en: 'Answers #7', title_ar: 'هل يمكن تعديل العنوان بعد تأكيد الطلب؟', content_ar: 'الإجابات # 7' },
    { title_en: 'What is the legal ruling on buying gold and jewelry via the Internet?', content_en: 'Answers #8', title_ar: 'ما هو الحكم الشرعي لشراء الذهب والمجهرات عن طريق الانترنت؟', content_ar: 'الإجابات # 8' },
    { title_en: 'How do I know my right size?', content_en: 'Answers #9', title_ar: 'كيف اعرف مقاسي المناسب؟', content_ar: 'الإجابات # 9' },
];

const FAQs = () => {

    const { t } = useTranslation();

    return (
        <section className="faqs">
            <header className="text-center mt-5 mb-5">
                <h3 className="mb-4">{t('frequently_asked_questions')}</h3>
                <p className="pe-4 ps-4">
                    {t('here_you_will_find_the_most_frequently_asked_questions')}
                </p>
            </header>
            <div className="container w-100" dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="content w-100 ">
                    <div className="accordion accordion-flush" id="accordionFlushExample3">
                        {
                            faqs.map((item, index) => (
                                <Accordion key={index} data={{index: index, title: ( i18n.language === 'en' ? item.title_en : item.title_ar ), content: ( i18n.language === 'en' ? item.content_en : item.content_ar )}} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </section>
    )
}

export default FAQs;