window.onload = () => {
    var config = {
        sessionId: "", // Here you add the "SessionId" you receive from InitiateSession Endpoint.
        countryCode: "KWT", // Here, add your Country Code.
        currencyCode: "KWD", // Here, add your Currency Code.
        amount: "10", // Add the invoice amount.
        cardViewId: "card-element-apple",
        callback: payment,
        style:{
          frameHeight: 51,
          button: {
            height: "35px",
            text: "Pay with", // Accepted texts ["", "Buy with", "Pay with", "Check Out with", "Continue with", "Book with", "Donate with", "Subscribe with", "Reload with", "Add Money with", "Top Up with", "Order with", "Rent with", "Support with", "Contribute with", "Tip with", "Set Up"]
            borderRadius: "8px"
          }
        }
    };

    myFatoorahAP.init(config);

    function payment(response) {
        // Here you need to pass session id to you backend here 
        var sessionId = response.sessionId;
        var cardBrand = response.cardBrand;
    };
}