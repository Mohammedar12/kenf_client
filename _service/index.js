export const BannerCarousel = () => {
  $(".banners-main").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    navSpeed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    dotsSpeed: 800,
    dragEndSpeed: 800,
    responsive: {
      0: {
        items: 1,
      },
    },
  });

  document.querySelector(
    ".banners-main .owl-prev"
  ).innerHTML = `<i class="fa-solid fa-angle-left fa-2x"></i>`;
  document.querySelector(
    ".banners-main .owl-next"
  ).innerHTML = `<i class="fa-solid fa-angle-right fa-2x"></i>`;

  $(".owl-nav .fa-2x").css("font-size", "1.4em !important");
};

export const ExclusiveCarousel = () => {
  $(".exclusive-carousel").owlCarousel({
    center: true,
    loop: true,
    margin: 10,
    autoplay: true,
    autoplaySpeed: 1000,
    dragEndSpeed: 800,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2,
      },
      700: {
        items: 3,
      },
      1000: {
        items: 3,
      },
    },
  });
};

export const ProductCarousel = () => {
  $(".suggested-products").owlCarousel({
    loop: true,
    margin: 10,
    autoplay: true,
    autoplaySpeed: 1000,
    dragEndSpeed: 700,
    nav: false,
    dots: false,
    responsive: {
      0: {
        items: 2,
      },
      600: {
        items: 2.5,
      },
      800: {
        items: 2.5,
      },
      1000: {
        items: 3,
      },
      1300: {
        items: 4,
      },
    },
  });
};
