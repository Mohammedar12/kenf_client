import { useState, useRef, useEffect } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from "next-i18next";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Affiliate (props) {

    const { t, i18n } = useTranslation();
    let Name = useRef();
    let Email = useRef();
    let Age = useRef();
    let Contact_Number = useRef();
    let Country = useRef();
    let City = useRef();
    let Media = useRef();
    let ShearingWays = useRef();
    let gender = useRef();
    let checkedbox = useRef();

    const [isForm, setForm] = useState(false);

    useEffect(() => {
      const keyDownHandler = (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          Submit();
        }
      };
  
      document.addEventListener("keydown", keyDownHandler);
  
      return () => {
        document.removeEventListener("keydown", keyDownHandler);
      };
    }, []);

    function Submit(e) {
      if (
        Name.current.value === "" ||
        Email.current.value === "" ||
        gender.current.value === "" ||
        Age.current.value === "" ||
        Contact_Number.current.value === "" ||
        Country.current.value === "" ||
        City.current.value === "" ||
        Media.current.value === "" ||
        ShearingWays.current.value === ""
      ){
        toast.error("Fill all the details in form.",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
        return;
      }
      const reqBody = {
        name: Name.current.value,
        email: Email.current.value,
        gender: gender.current.value,
        contact_number: Contact_Number.current.value,
        age: Age.current.value,
        country: Country.current.value,
        city: City.current.value,
        media: Media.current.value,
        shearing_ways: ShearingWays.current.value
      };
      fetch(
        "/front_api/affiliate",
        {
          method: "POST",
          body: JSON.stringify(reqBody),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if(data.status !== 200){
            toast.error(data.message,{
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: true,
            });
            return;
          }
          toast.success(data.message,{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
          });
        }).catch((e)=>{
          toast.error(e.message,{
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
          });
        });
      document.querySelector("form").reset();
    }

    return (
      <>
        <div className="form">
          {isForm ? (
            <form>
      
              <label>
                الجنس
                <div className="d-flex ">
                  <label className="gender">
                    <input
                      ref={gender}
                      name="Gender"
                      value="male"
                      type="radio"
                      required
                    />
                    <div className="radio"></div>
                    ذكر
                  </label>
                  <label className="gender">
                    <input
                      ref={gender}
                      name="Gender"
                      value="female"
                      type="radio"
                      required
                    />
                    <div className="radio"></div>
                    انثى
                  </label>
                </div>
                {/* <span></span> */}
              </label>
              <label>
                الاسم الكامل
                <input ref={Name} name="Name" type="text" required />
                <span></span>
              </label>
              <label>
                الايميل
                <input ref={Email} name="Email" type="email" required />
                <span></span>
              </label>
              <label>
                رقم التواصل
                <input
                  ref={Contact_Number}
                  name="Contact_Number"
                  type="text"
                  required
                />
                <span></span>
              </label>
              <label>
                العمر
                <input ref={Age} name="Age" type="text" required />
                <span></span>
              </label>
              <label>
                البلد
                <input ref={Country} name="Country" type="text" required />
                <span></span>
              </label>
              <label>
                المدينة
                <input ref={City} name="City" type="text" required />
                <span></span>
              </label>
              <label>
                ما هي المنصات التي ستقوم بالنشر من خلالها ؟
                <input ref={Media} name="Media" type="text" required />
                <span></span>
              </label>
              <label>
                نرجوا التوضيح عن الطرق التي ستقوم بالنشر من خلالها
                <input
                  ref={ShearingWays}
                  name="ShearingWays"
                  type="text"
                  required
                />
                <span></span>
              </label>
              <button
                type="button"
                onClick={(e) => {
                  Submit(e);
                  // restInputs();
                }}
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="terms" dir="rtl">
              <h3 className="title">الشروط والاحكام</h3>
              <div className="content">
                <p>
                  الدول المستهدفة لإعلانات كنف، هي: المملكة العربية السعودية
                </p>
                <p>
                  {" "}
                  الحد الأعلى للميزانية اليومية: 100 دولار للعرض الإعلاني الواحد
                  خلال اليوم الواحد ووفقا للاتفاق مع مدير حسابك في كنف (ملاحظة:
                  لن يتم دفع أي مبلغ أعلى من المبلغ اليومي المحدد).
                </p>

                <ul>
                  <p>
                    غير مسموح به: (لن يتم دفع أي مبلغ مترتب من الإعلان بالطرق
                    التالية):
                  </p>
                  <li>
                    {" "}
                    التسويق باستخدام كلمة العلامة التجارية الخاصة بكنف على محركات
                    البحث من خلال الاعلانات المدفوعه أو على إعلانات قنوات التواصل
                    الاجتماعي المدفوعة{" "}
                  </li>
                  <li>الفتحات الاجبارية بكل انواعها</li>
                  <li>
                    التسويق بــــ رسائل اعلانية مضللة أو خاطئة أو التسويق عبر
                    ترويج كود خصم الريفيرال
                  </li>
                  <li>
                    {" "}
                    الإعلان باستخدام شعارات أو صور او تصاميم ليست لكنف او قد تسيء
                    للعلامة التجارية الخاصة{" "}
                  </li>
                </ul>
                <p>
                  التتبع والدفعات: يتم اعتماد النتائج والارقام الموجودة بنظام كنف
                  للتتبع، وسيتم احتساب العمولات بناءاً على العائد المؤكد من عمليات
                  التسويق، وفي حال وجود اختلافات كبيرة، يحق للمسوق طلب التقارير
                  التي استخدمت في احتساب العائد
                </p>
                <p>
                  {" "}
                  الدفعات: يتم تحويل الدفعات شهرياً بعد مرور 30 يوماً من تاريخ
                  انتهاء الشهر.
                </p>
                <p>
                  {" "}
                  الإشعارات: على جميع الأطراف إيقاف الحملات أو إلغاء التعاون بشرط
                  إشعار الفريق الأخر قبل 24 ساعة فقط.
                </p>
                <p>
                  {" "}
                  التسويق والتعاون مع المؤثّرين ومشاهير الخليج: <br />
                  من غير المسموح للمسوقين التعاون مع مشاهير قنوات التواصل
                  الاجتماعي للتسويق لكنف، إلا إذا كنت أنت من المؤثّرين وتستخدم
                  حساباتك الخاصة للتسويق، يمكنك متابعة حملاتك التسويقية كما هو
                  معتاد.
                </p>
              </div>
              <div className="question pt-2">
                <label>
                  <input ref={checkedbox} type="checkbox" className="ms-2" />
                  أوافق على الشروط والأحكام المذكورة أعلاه
                </label>
                <button
                  onClick={() => {
                    if(!checkedbox.current.checked){
                      toast.error("يجب الموافقة على الروط والأحكام اولاََ",{
                        position: "top-right",
                        autoClose: 3000,
                        hideProgressBar: true,
                      });
                      return;
                    }
                    setForm(true);
                  }}
                >
                  التالي
                </button>
              </div>
            </div>
          )}
        </div>
        <ToastContainer />
      </>
    )
}

export async function getServerSideProps({ req, locale, params }) {
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
  