import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import { ToastContainer, toast } from "react-toastify";
import Images from "../../components/image_panel";
import { AuthContext } from "../../components/auth_context";
import "react-phone-input-2/lib/style.css";

import Topbar from "../../components/topbar_panel";
import Mobile from "../../components/mobile_panel";

import { Modal, Button } from "react-bootstrap";

import { ServerURI } from "../../config";
import { useTranslation } from "react-i18next";

const initEmailVal = {
  email: "",
  emailConfirmCode: "",
};

const initPhoneVal = {
  phone: "",
  phoneConfirmCode: "",
};

const Header = () => {
  const [email, setEmail] = useState(initEmailVal);
  const [phone, setPhone] = useState(initPhoneVal);
  const [verifyCode, setVerifyCode] = useState("0000");

  const [allGroups, setAllGroups] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [resetSeconds, setResetSeconds] = useState(0);

  const [type, setType] = useState(null);
  const { isAuth, setIsAuth } = useContext(AuthContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { t } = useTranslation();

  useEffect(() => {
    // GET Product
    axios
      .get(`${ServerURI}/product`)
      .then((res) => setAllProducts(res.data))
      .catch((err) => console.log(err));

    // GET Group
    axios
      .get(`${ServerURI}/settings/items_group`)
      .then((res) => setAllGroups(res.data))
      .catch((err) => console.log(err));

    // GET Category
    axios
      .get(`${ServerURI}/settings/items_category`)
      .then((res) => setAllCategories(res.data))
      .catch((err) => console.log(err));

    if (isAuth) {
      axios
        .get(
          `${ServerURI}/settings/favorite?token=${sessionStorage.getItem(
            "token"
          )}`
        )
        .then((res) => {
          if (res.data.cart) {
            setCartCount(res.data.cart.length);
          }
        })
        .catch((err) => console.log(err));
    } else {
      if (sessionStorage.getItem("cart")) {
        axios
          .post(`${ServerURI}/settings/decodeCart`, {
            token: sessionStorage.getItem("cart"),
          })
          .then((res) => {
            setCartCount(res.data.length);
          })
          .catch((err) => console.log(err));
      }
    }
  }, []);

  const onSignIn = (data) => {
    axios
      .post(`${ServerURI}/register`, data)
      .then((res) => {
        sessionStorage.setItem("token", res.data);
      })
      .catch((err) => console.log(err));

    setShow(false);
    setIsAuth(true);
    onInitialModal();
  };

  const onInitialModal = () => {
    setType(null);
    setVerifyCode("0000");
    setEmail(initEmailVal);
    setPhone(initPhoneVal);
  };

  const showEmailCode = () => {
    if (verifyCode === "0000") {
      axios
        .post(`${ServerURI}/emailverify`, { email: email.email })
        .then((res) => {
          if (res.data.status == "200") {
            setResetSeconds(15);
            setVerifyCode(res.data.code);
          }
        });
    } else {
      if (verifyCode == email.emailConfirmCode) {
        onSignIn({ email: email.email });
      } else {
        onInitialModal();

        toast.error(t("message.confirmcode_is_wrong"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (resetSeconds > 0) {
        setResetSeconds(resetSeconds - 1);
      }

      if (resetSeconds === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [resetSeconds]);

  const resendEmailCode = () => {
    axios
      .post(`${ServerURI}/emailverify`, { email: email.email })
      .then((res) => {
        if (res.data.status == "200") {
          setResetSeconds(15);
          setVerifyCode(res.data.code);
        }
      });
  };

  const showPhoneCode = () => {
    if (verifyCode === "0000") {
      axios
        .post(`${ServerURI}/phoneverify`, { phone: phone.phone })
        .then((res) => {
          let ac = new AbortController();
          setTimeout(() => {
            ac.abort();
          }, 10 * 60 * 1000);
          navigator.credentials
            .get({
              otp: { transport: ["sms"] },
              signal: ac.signal,
            })
            .then((otp) => {
              console.log("your otp code is", otp.code);
              setPhone({ ...phone, phoneConfirmCode: otp.code });
            })
            .catch((err) => {
              console.log(err);
            });
          setResetSeconds(15);
          setVerifyCode(res.data.code);
        });
    } else {
      if (verifyCode == phone.phoneConfirmCode) {
        onSignIn({ phone: phone.phone });
      } else {
        onInitialModal();

        toast.error(t("message.confirmcode_is_wrong"), {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };

  const resendPhoneCode = () => {
    axios
      .post(`${ServerURI}/phoneverify`, { phone: phone.phone })
      .then((res) => {
        setResetSeconds(15);
        setVerifyCode(res.data.code);
      });
  };

  return (
    <>
      <nav className="nav">
        <Topbar products={allProducts} handleShow={handleShow} />
        <Mobile groups={allGroups} categories={allCategories} />
      </nav>

      <Modal
        className="login-modal"
        show={show}
        onHide={handleClose}
        onExit={onInitialModal}
        centered
      >
        <Modal.Header className="border-0">
          <Modal.Title className="align-items-start border-0 pb-0">
            <Images
              classnames="m-3"
              src="images/logo-3.svg"
              alt=""
              width="100px"
            />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {type == null && (
            <span className="login-title text-center d-block">
              {t("choose_way_to_login")}
            </span>
          )}
          {type == "email" && (
            <>
              <form className="field-email show-this-block d-none">
                <div className="email-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                  <label htmlFor="email">* {t("email")}</label>
                  <input
                    dir="rtl"
                    className="w-100 ps-5 pe-2 p-1 mt-1 rounded-1"
                    type={t("email")}
                    id="email"
                    placeholder="Email"
                    style={{ border: "1px solid #ccc" }}
                    value={email.email}
                    onChange={(e) =>
                      setEmail({ ...email, email: e.target.value })
                    }
                    required
                  />
                  <i
                    className="fa-solid fa-envelope p-1 position-absolute"
                    style={{ top: 33.3, left: 20 }}
                  ></i>
                </div>

                <div
                  className={
                    "verification-email d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative " +
                    (verifyCode == "0000" ? "d-none" : "show-this-flex")
                  }
                >
                  <label htmlFor="email">* {t("verification_code")}</label>
                  <input
                    dir="rtl"
                    className="w-100 ps-5 pe-2 p-1 mt-1"
                    type="text"
                    id="email"
                    name="code"
                    placeholder={t("enter_verification_code")}
                    maxLength="4"
                    style={{ border: "1px solid #ccc" }}
                    value={email.emailConfirmCode}
                    onChange={(e) =>
                      setEmail({
                        ...email,
                        emailConfirmCode: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div
                  className={
                    "pe-4 ps-4 m-2 " +
                    (verifyCode == "0000" ? "d-none" : "show-this-flex")
                  }
                  dir="rtl"
                >
                  {resetSeconds == 0 ? (
                    <input
                      type="button"
                      className="btn w-100 shadow-none text-light mt-2"
                      style={{ backgroundColor: "var(--main-color)" }}
                      value={t("resend")}
                      onClick={resendEmailCode}
                    />
                  ) : (
                    <p>
                      Resend in{" "}
                      {new Date(resetSeconds * 1000)
                        .toISOString()
                        .substring(14, 19)}
                    </p>
                  )}
                </div>
                <div className="submit w-100  text-center pe-4 ps-4">
                  <input
                    type="button"
                    className="btn w-100 shadow-none text-light mt-2"
                    style={{ backgroundColor: "var(--main-color)" }}
                    value={t("go")}
                    onClick={showEmailCode}
                  />
                </div>
              </form>
            </>
          )}

          {type == "phone" && (
            <>
              <form className="field-phone show-this-block d-none">
                <div className="phone-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                  <label htmlFor="">* {t("phone")}</label>
                  <PhoneInput
                    width="100%"
                    className="mt-1"
                    country={"sa"}
                    value={phone.phone}
                    onChange={(e) => setPhone({ ...phone, phone: e })}
                    onlyCountries={["sa", "eg", "dz", "bh", "kw", "in"]}
                  />
                </div>
                <div
                  className={
                    "verification-phone d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative " +
                    (verifyCode == "0000" ? "d-none" : "show-this-flex")
                  }
                >
                  <label htmlFor="phone">* {t("verification_code")}</label>
                  <input
                    dir="rtl"
                    className="w-100 ps-5 pe-2 p-1 mt-1"
                    type="text"
                    id="phone"
                    name="code"
                    placeholder={t("enter_verification_code")}
                    maxLength="4"
                    style={{ border: "1px solid #ccc" }}
                    value={phone.phoneConfirmCode}
                    onChange={(e) =>
                      setPhone({ ...phone, phoneConfirmCode: e.target.value })
                    }
                    required
                  />
                  {/* { phone.phoneConfirmCode != verifyCode && phone.phoneConfirmCode.length == 4 && <p className='form_error'>Confirm code is wrong</p> } */}
                </div>
                <div
                  className={
                    "pe-4 ps-4 m-2 " +
                    (verifyCode == "0000" ? "d-none" : "show-this-flex")
                  }
                  dir="rtl"
                >
                  {resetSeconds == 0 ? (
                    <input
                      type="button"
                      className="btn w-100 shadow-none text-light mt-2"
                      style={{ backgroundColor: "var(--main-color)" }}
                      value={t("resend")}
                      onClick={resendPhoneCode}
                    />
                  ) : (
                    <p>
                      Resend in{" "}
                      {new Date(resetSeconds * 1000)
                        .toISOString()
                        .substring(14, 19)}
                    </p>
                  )}
                </div>

                <div className="submit w-100  text-center pe-4 ps-4">
                  <input
                    type="button"
                    className="btn  w-100 shadow-none text-light mt-2"
                    style={{ backgroundColor: "var(--main-color)" }}
                    value={t("go")}
                    onClick={showPhoneCode}
                    required
                  />
                </div>
              </form>
            </>
          )}
        </Modal.Body>
        {type == null && (
          <Modal.Footer className="justify-content-center">
            <button
              type="button"
              className="btn email login-modal-btn"
              onClick={() => setType("email")}
            >
              {t("email")} <i className="fa-solid fa-envelope p-1"></i>
            </button>
            <button
              type="button"
              className="btn phone login-modal-btn"
              onClick={() => setType("phone")}
            >
              {t("phone")} <i className=" fa-solid fa-mobile p-1"></i>
            </button>
          </Modal.Footer>
        )}
      </Modal>

      <div className="login-modal modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header align-items-start border-0 pb-0">
              <h5
                className="modal-titled d-flex flex-column  align-items-center text-center w-100"
                id="staticBackdropLabel"
              >
                <Images
                  classnames="m-3"
                  src="images/logo-3.svg"
                  alt=""
                  width="100px"
                />
              </h5>
            </div>
            <div className="modal-body border-0 p-0 pb-3">
              {type == null && (
                <span className="login-title text-center d-block">
                  {t("choose_way_to_login")}
                </span>
              )}
              {type == "email" && (
                <>
                  <form className="field-email show-this-block d-none">
                    <div className="email-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                      <label htmlFor="email">* {t("email")}</label>
                      <input
                        dir="rtl"
                        className="w-100 ps-5 pe-2 p-1 mt-1 rounded-1"
                        type={t("email")}
                        id="email"
                        placeholder="Email"
                        style={{ border: "1px solid #ccc" }}
                        value={email.email}
                        onChange={(e) =>
                          setEmail({ ...email, email: e.target.value })
                        }
                        required
                      />
                      <i
                        className="fa-solid fa-envelope p-1 position-absolute"
                        style={{ top: 33.3, left: 20 }}
                      ></i>
                    </div>

                    <div
                      className={
                        "verification-email d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative " +
                        (verifyCode == "0000" ? "d-none" : "show-this-flex")
                      }
                    >
                      <label htmlFor="email">* {t("verification_code")}</label>
                      <input
                        dir="rtl"
                        className="w-100 ps-5 pe-2 p-1 mt-1"
                        type="text"
                        id="email"
                        name="code"
                        placeholder={t("enter_verification_code")}
                        maxLength="4"
                        style={{ border: "1px solid #ccc" }}
                        value={email.emailConfirmCode}
                        onChange={(e) =>
                          setEmail({
                            ...email,
                            emailConfirmCode: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="submit w-100  text-center pe-4 ps-4">
                      <input
                        type="button"
                        className="btn w-100 shadow-none text-light mt-2"
                        style={{ backgroundColor: "var(--main-color)" }}
                        value={t("go")}
                        onClick={showEmailCode}
                      />
                    </div>
                  </form>
                </>
              )}

              {type == "phone" && (
                <>
                  <form className="field-phone show-this-block d-none">
                    <div className="phone-input d-flex flex-column align-items-end pe-3 ps-3  m-2 position-relative">
                      <label htmlFor="">* {t("phone")}</label>
                      <PhoneInput
                        width="100%"
                        className="mt-1"
                        country={"sa"}
                        value={phone.phone}
                        onChange={(e) => setPhone({ ...phone, phone: e })}
                        onlyCountries={["sa", "eg", "dz", "bh", "kw"]}
                      />
                    </div>

                    {verifyCode != "0000" && (
                      <div className="verification-phone d-flex flex-column align-items-end pe-3 ps-3 m-2 position-relative d-none show-this-flex">
                        <label htmlFor="phone">
                          * {t("verification_code")}
                        </label>
                        <input
                          dir="rtl"
                          className="w-100 ps-5 pe-2 p-1 mt-1"
                          type="text"
                          id="phone"
                          name="code"
                          placeholder={t("enter_verification_code")}
                          maxLength="4"
                          style={{ border: "1px solid #ccc" }}
                          value={phone.phoneConfirmCode}
                          onChange={(e) =>
                            setPhone({
                              ...phone,
                              phoneConfirmCode: e.target.value,
                            })
                          }
                          required
                        />
                        {/* { phone.phoneConfirmCode != verifyCode && phone.phoneConfirmCode.length == 4 && <p className='form_error'>Confirm code is wrong</p> } */}
                      </div>
                    )}

                    <div className="submit w-100  text-center pe-4 ps-4">
                      <input
                        type="button"
                        className="btn  w-100 shadow-none text-light mt-2"
                        style={{ backgroundColor: "var(--main-color)" }}
                        value={t("go")}
                        onClick={showPhoneCode}
                        required
                      />
                    </div>
                  </form>
                </>
              )}
            </div>
            {type == null && (
              <div className="modal-footer justify-content-center ">
                <button
                  type="button"
                  className="btn email login-modal-btn"
                  onClick={() => setType("email")}
                >
                  {t("email")} <i className="fa-solid fa-envelope p-1"></i>
                </button>
                <button
                  type="button"
                  className="btn phone login-modal-btn"
                  onClick={() => setType("phone")}
                >
                  {t("phone")} <i className=" fa-solid fa-mobile p-1"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Header;
