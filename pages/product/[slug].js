import { useEffect, useState, useContext } from "react";
import Head from "next/head";
import styles from "../../styles/product.module.css";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { imageURI } from "../../config";
import { useTranslation } from "next-i18next";
import { getAppData } from "../../utils/get_app_data";
import Link from "next/link";
import axios from "../../utils/noauth_axios";
import { MdWhatsapp } from "react-icons/md";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useKeenSlider } from "keen-slider/react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import ProductCard from "@/components/ProductCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const BuyButton = dynamic(() => import("@/components/BuyButton"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
const FavoriteButton = dynamic(() => import("@/components/FavoriteButton"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Product(props) {
  const { t, i18n } = useTranslation();

  const { product } = props;

  console.log(product);

  const [selectedImage, setSelectedImage] = useState(props.mainImageLink);
  const [isOpen, setIsOpen] = useState(false);
  const [accordionInfoExpanded, setAccordionInfoExpanded] = useState();
  const router = useRouter();

  const [scrollTop, setScrollTop] = useState(0);
  const [viewerSliderLoaded, setViewerSliderLoaded] = useState(false);

  const [loadingAddToCart, setLoadingAddToCart] = useState(false);

  const suggested1SliderOptions = {
    loop: true,
    slides: {
      perView: 4,
      spacing: 30,
      number:
        product.similarProducts?.length > 0
          ? product.similarProducts[0].length
          : 0,
    },
    breakpoints: {
      "(max-width: 750px)": {
        mode: "snap",
        loop: true,
        slides: {
          perView: 2,
          spacing: 30,
          number:
            product.similarProducts?.length > 0
              ? product.similarProducts[0].length
              : 0,
        },
      },
    },
    renderMode: "performance",
    defaultAnimation: { duration: 500, easing: (t) => t },
  };
  const [suggested1SliderRef, suggested1InstanceRef] = useKeenSlider(
    suggested1SliderOptions,
    [
      (slider) => {
        let timeout;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  const suggested2SliderOptions = {
    loop: true,
    slides: {
      perView: 4,
      spacing: 30,
      number:
        product.similarProducts?.length > 1
          ? product.similarProducts[1].length
          : 0,
    },
    breakpoints: {
      "(max-width: 750px)": {
        mode: "snap",
        loop: true,
        slides: {
          perView: 2,
          spacing: 30,
          number:
            product.similarProducts?.length > 1
              ? product.similarProducts[1].length
              : 0,
        },
      },
    },
    renderMode: "performance",
    defaultAnimation: { duration: 500, easing: (t) => t },
  };
  const [suggested2SliderRef, suggested2InstanceRef] = useKeenSlider(
    suggested2SliderOptions,
    [
      (slider) => {
        let timeout;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            slider.next();
          }, 2000);
        }
        slider.on("created", () => {
          nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
      },
    ]
  );

  useEffect(() => {
    const handleScroll = (event) => {
      setScrollTop(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    setTimeout(() => {
      suggested1InstanceRef.current?.update(suggested1SliderOptions);
      suggested2InstanceRef.current?.update(suggested2SliderOptions);
    }, 200);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [product]);

  useEffect(() => {
    setSelectedImage(props.mainImageLink);
  }, [props.mainImageLink]);

  const [viewImagesSliderRef, instanceRef] = useKeenSlider(
    {
      created() {
        setViewerSliderLoaded(true);
      },
      loop: true,
      slides: {
        origin: "center",
        perView: 1,
        number: product?.images.length,
      },
    },
    [
      // add plugins here
    ]
  );

  const ViewImage = (props) => {
    return (
      <div
        className="viewImageModal"
        style={{ display: props.isOpen ? "" : "none" }}
        onClick={() => setIsOpen(false)}
      >
        <div
          ref={viewImagesSliderRef}
          className={`keen-slider ${styles.product_viewer_slider}`}
        >
          {product.images?.map((item, index) => (
            <div
              className={`keen-slider__slide ${styles.product_viewer_img_container}`}
              key={index}
            >
              <Image
                src={imageURI + item.link}
                quality={60}
                sizes="100vw"
                fill
                className={styles.product_viewer_img}
                alt=""
              />
            </div>
          ))}
        </div>
        {viewerSliderLoaded && instanceRef.current && (
          <>
            <AiOutlineLeft
              size={20}
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.previous()
              }
              style={{ position: "absolute", top: "50%", left: 20 }}
            />

            <AiOutlineRight
              onClick={(e) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              size={20}
              style={{ position: "absolute", top: "50%", right: 20 }}
            />
          </>
        )}
      </div>
    );
  };

  const onAddToCart = async () => {
    try {
      setLoadingAddToCart(true);
      const addToCartResponse = await axios.post("/user/cart", {
        products: [{ id: product.id, quantity: 1 }],
      });
      router.push("/shopping");
      setLoadingAddToCart(false);
    } catch (err) {
      if (err.response?.data) {
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error(err.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
      setLoadingAddToCart(false);
    }
  };

  return (
    <>
      <Head>
        <title>{product.meta?.title}</title>
        <meta name="description" content={product.meta?.description} />
        <meta name="keywords" content={product.meta?.keywords?.join(" , ")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="/images/SVG/logo-3.svg" />
      </Head>
      <main>
        <ViewImage isOpen={isOpen} />
        <section
          className="product-section"
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          <div className="container">
            <div className="product-imgs">
              <div className="imgs">
                {product.images?.map((item, index) => (
                  <a
                    key={index}
                    style={{ cursor: "pointer", position: "relative" }}
                    onClick={() => setSelectedImage(item.link)}
                  >
                    <Image
                      priority="true"
                      className="next_image"
                      fill
                      quality={30}
                      src={imageURI + "" + item.link}
                      alt={
                        i18n.language === "en"
                          ? product.name_en
                          : product.name_ar
                      }
                      sizes="100px"
                    />
                  </a>
                ))}
              </div>
              <div className="main-img">
                <FavoriteButton
                  className="add-favorite"
                  productId={product.id}
                  liked={product.isFavorite}
                />
                <div
                  className="img-container"
                  onClick={() => setIsOpen(true)}
                  style={{ position: "relative", cursor: "pointer" }}
                >
                  <Image
                    priority="true"
                    className="next_image"
                    fill
                    quality={60}
                    src={
                      selectedImage && selectedImage != ""
                        ? imageURI + "" + selectedImage
                        : ""
                    }
                    alt="product main image"
                    sizes="@media(max-width: 650px) 100vw, 65vw"
                  />
                </div>
                <div className="favorite-icon"></div>
              </div>
            </div>
            <div className="product-details">
              <div className="title">
                <div className="box-title">
                  <h5>
                    {i18n.language === "en" ? product.name_en : product.name_ar}
                  </h5>
                </div>
              </div>
              <div className="price fw-bold">
                <div className="price-title">{t("price")} :</div>
                <div className="the-price" dir="auto">
                  {product.extra_price} {t("sar")}{" "}
                </div>
              </div>
              {product.brand ? (
                <div className="brand d-flex justify-content-between align-items-center w-100 fw-bold">
                  <div>Brand :</div>
                  <div>
                    <span className="num pe-2">
                      {i18n.language === "en"
                        ? product?.brand?.name_en
                        : product?.brand?.name_ar}
                    </span>
                    <Image
                      src={imageURI + product?.brand?.images[0]?.link}
                      priority="true"
                      className="next_image"
                      width={40}
                      height={40}
                      quality={100}
                      alt="aa"
                    />
                  </div>
                </div>
              ) : ''}
              <div className="desc accordion accordionInfoExpanded">
                <div className="accordion-item">
                  <button
                    className={styles.info_expandable_btn}
                    onClick={() => {
                      setAccordionInfoExpanded(
                        accordionInfoExpanded !== 0 ? 0 : undefined
                      );
                    }}
                  >
                    {t("description")}
                  </button>
                  <div
                    className={
                      "text-end accordion_custom_exandable" +
                      (accordionInfoExpanded === 0
                        ? " accordion_custom_exanded"
                        : "") +
                      " " +
                      styles.info_accordion_item
                    }
                  >
                    <div className="item the-desc pt-2">
                      {i18n.language === "en"
                        ? product.description_en
                        : product.description_ar}
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <button
                    className={styles.info_expandable_btn}
                    onClick={() => {
                      setAccordionInfoExpanded(
                        accordionInfoExpanded !== 1 ? 1 : undefined
                      );
                    }}
                  >
                    {t("specifications")}
                  </button>
                  <div
                    className={
                      "text-end accordion_custom_exandable" +
                      (accordionInfoExpanded === 1
                        ? " accordion_custom_exanded"
                        : "") +
                      " " +
                      styles.info_accordion_item
                    }
                  >
                    <div className="item the-features pt-2">
                      <div className="feature">
                        <div className="karats">
                          {t("karat")} :{" "}
                          <span className="num pe-2">
                            {i18n.language === "en"
                              ? product.purity[0].name_en
                              : product.purity[0].name_ar}
                          </span>
                        </div>
                      </div>
                      <div className="feature pt-2">
                        <div className="weights">
                          {t("weight")} :{" "}
                          <span className="num pe-2 ">
                            {product.weight}
                            {t("gram_unit")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="accordion-item">
                  <button
                    className={styles.info_expandable_btn}
                    onClick={() => {
                      setAccordionInfoExpanded(
                        accordionInfoExpanded !== 2 ? 2 : undefined
                      );
                    }}
                  >
                    Brand
                  </button>
                  <div
                    className={
                      "text-end accordion_custom_exandable" +
                      (accordionInfoExpanded === 2
                        ? " accordion_custom_exanded"
                        : "") +
                      " " +
                      styles.info_accordion_item
                    }
                  >
                    <div className="item the-features pt-2">
                      <div className="feature">
                        <div className="karats">
                          <span className="num pe-2">
                            {i18n.language === "en"
                              ? product.brand.name_en
                              : product.brand.name_ar}
                          </span>
                          <Image
                            src={imageURI + product?.brand?.images[0].link}
                            priority="true"
                            className="next_image"
                            width={50}
                            height={50}
                            quality={100}
                            sizes="40px"
                            alt="aa"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="shearing">
                <span className="shearing-title">
                  {t("share_the_product_with_your_loved_one")}
                </span>
                <Link
                  target="_blank"
                  href={
                    "https://wa.me/?text=" +
                    encodeURIComponent(props.host + router.asPath)
                  }
                >
                  <MdWhatsapp size={21} />
                </Link>
              </div>
              <BuyButton
                onyDesktop={true}
                outofStock={product.outofStock}
                loading={loadingAddToCart}
                onAddToCart={() => {
                  onAddToCart();
                }}
                products={JSON.stringify([product.id])}
                isCart={false}
              />
            </div>
            {scrollTop < 900 && (
              <BuyButton
                onlyMobile={true}
                outofStock={product.outofStock}
                loading={loadingAddToCart}
                onAddToCart={() => {
                  onAddToCart();
                }}
                products={JSON.stringify([product.id])}
                isCart={false}
              />
            )}
          </div>
        </section>
        <div className="section-title my-3">{t("suggested_products")}</div>
        {product.similarProducts?.length > 0 &&
        product.similarProducts[0].length > 0 ? (
          <div
            ref={suggested1SliderRef}
            className={`${styles.product_slider} keen-slider`}
          >
            {product.similarProducts[0].map((suggestedProduct) => (
              <div
                className="keen-slider__slide"
                key={"sug_product_" + suggestedProduct.id}
              >
                <ProductCard product={suggestedProduct} />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        {product.similarProducts?.length > 1 &&
        product.similarProducts[1].length > 0 ? (
          <div
            ref={suggested2SliderRef}
            className={`${styles.product_slider} keen-slider`}
          >
            {product.similarProducts[1].map((suggestedProduct) => (
              <div
                className="keen-slider__slide"
                key={"sug_product_" + suggestedProduct.id}
              >
                <ProductCard product={suggestedProduct} />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        <ToastContainer />
      </main>
    </>
  );
}

export async function getServerSideProps({ req, locale, params }) {
  let groups = [];
  let categories = [];

  try {
    const appData = await getAppData();
    groups = appData.groups;
    categories = appData.categories;
  } catch (e) {}
  let product = {};
  try {
    product = await axios.get(`product/${encodeURIComponent(params.slug)}`, {
      withCredentials: true,
      headers: {
        Cookie: req.headers?.cookie ? req.headers.cookie : "",
        token: process.env.AUTH_TOKEN,
      },
    });
    product = product?.data?.data;
  } catch (e) {
    return {
      notFound: true,
    };
  }
  let mainImageLink = "";
  if (product.mainImage?.link && product.mainImage.link) {
    mainImageLink = product.mainImage.link;
  } else if (product?.images && product.images.length > 0) {
    mainImageLink = product.images[0].link;
  }
  const host = "https://" + req.headers.host;
  return {
    props: {
      groups,
      categories,
      product,
      host,
      mainImageLink,
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
