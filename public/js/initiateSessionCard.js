var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const res = JSON.parse(this.responseText);

            var config = {
                countryCode: res.Data.CountryCode, // Here, add your Country Code.
                sessionId: res.Data.SessionId, // Here you add the "SessionId" you receive from InitiateSession Endpoint.
                cardViewId: "card-element-credit",
                onCardBinChanged: handleBinChanges,
                // The following style is optional.
                style: {
                    hideCardIcons: false,
                    direction: "ltr",
                    cardHeight: 140,
                    input: {
                        color: "black",
                        fontSize: "13px",
                        fontFamily: "sans-serif",
                        inputHeight: "33px",
                        inputMargin: "0px",
                        borderColor: "c7c7c7",
                        borderWidth: "1px",
                        borderRadius: "8px",
                        boxShadow: "",
                        placeHolder: {
                            holderName: "Name On Card",
                            cardNumber: "Number",
                            expiryDate: "MM / YY",
                            securityCode: "CVV",
                        }
                    },
                    label: {
                        display: false,
                        color: "black",
                        fontSize: "13px",
                        fontWeight: "normal",
                        fontFamily: "sans-serif",
                        text: {
                            holderName: "Card Holder Name",
                            cardNumber: "Card Number",
                            expiryDate: "Expiry Date",
                            securityCode: "Security Code",
                        },
                    },
                    error: {
                        borderColor: "red",
                        borderRadius: "8px",
                        boxShadow: "0px",
                    },
                },
            };

            myFatoorah.init(config);
        }
    };
    xhttp.open("GET", `http://104.248.239.195/api/order/initiateSession`, true);
    xhttp.send();

function submit() {
    myFatoorah.submit()
    // On success
        .then(function (response) {
            // Here you need to pass session id to you backend here
            var sessionId = response.sessionId;
            var cardBrand = response.cardBrand;//cardBrand will be one of the following values: Master, Visa, Mada, Amex
        })
    // In case of errors
        .catch(function (error) {
            console.log(error);
        });
}
function handleBinChanges(bin){
    console.log(bin);
}