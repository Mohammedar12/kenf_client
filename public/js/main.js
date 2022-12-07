// transBg this to close menu and search bar

let transBg = document.createElement("div");
transBg.className = "trans-bg";
transBg.innerHTML = "";
document.body.appendChild(transBg);
transBg.style.display = "none";
// search box

let searchBox = document.querySelector(".search-box");
let searchInput = document.querySelector(".search");

if (transBg) {
  transBg.addEventListener("click", (e) => {
    if (document.querySelector(".menu-mob"))
      document.querySelector(".menu-mob").classList.remove("menu-mob-show");

    searchInput.style.display = 'none';
    transBg.style.display = "none";
  });
}


// if (searchBox) {
//   document.querySelector(".search").addEventListener("click", (e) => {
//     searchInput.classList.add("focused");
//     transBg.style.display = "block";
//   });
// }

// country codes

// var input = document.querySelector("#phone");
// window.intlTelInput(input, {
//   initialCountry: "auto",
//   geoIpLookup: function (callback) {
//     $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
//       var countryCode = resp && resp.country ? resp.country : "us";
//       callback(countryCode);
//     });
//   },
//   utilsScript: "../../build/js/utils.js", // just for formatting/placeholders etc
// });

// centering the kenf collection

// window.addEventListener("load", () => {
//   let scrollElement = document.querySelector(".scroll-bar-center");
//   scrollElement.scrollLeft =
//     (scrollElement.scrollWidth - scrollElement.clientWidth) / 2;
// });

// change input upload photo to the uploaded photo

let inputUpload = document.querySelector(".Ticket_form .upload #file");
let labelPhoto = document.querySelector(".Ticket_form .upload img");
let spanlInput = document.querySelector(".Ticket_form .upload span");

if (inputUpload) {
  inputUpload.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result;
        labelPhoto.src = result;
      });
      reader.readAsDataURL(file);
    }
    spanlInput.textContent = "change image";
  });
}

// review tickets

// let review = document.querySelectorAll("#review");
// let ticketReview = document.querySelector(".ticket-review .ticket-modal");
// let backDrop = document.querySelector(".back-drop");
// let closeReview = document.querySelector(".ticket-review #close-review");

// review.addEventListener("click", () => {
//   ticketReview.style.display = "block";
// });

// review.forEach((ticket) => {
//   ticket.addEventListener("click", () => {
//     ticketReview.style.display = "block";
//     backDrop.style.display = "block";
//     scrollTo(top);
//   });
// });

// if (backDrop) {
//   backDrop.addEventListener("click", () => {
//     ticketReview.style.display = "none";
//     backDrop.style.display = "none";
//   });
// }

// if (closeReview) {
//   closeReview.addEventListener("click", () => {
//     ticketReview.style.display = "none";
//     backDrop.style.display = "none";
//   });
// }

// let answered = document.querySelectorAll("#answered");
// let ticketAnswered = document.querySelector(".ticket-answered .ticket-modal");
// let closeAnswered = document.querySelector(".ticket-answered #close-answered");

// answered.forEach((ticket) => {
//   ticket.addEventListener("click", () => {
//     ticketAnswered.style.display = "block";
//     backDrop.style.display = "block";
//     scrollTo(top);
//   });
// });

// if (backDrop) {
//   backDrop.addEventListener("click", () => {
//     ticketAnswered.style.display = "none";
//     backDrop.style.display = "none";
//   });
// }

// if (closeAnswered) {
//   closeAnswered.addEventListener("click", () => {
//     ticketAnswered.style.display = "none";
//     backDrop.style.display = "none";
//   });
// }