const hostName = (location.hostname === "localhost") ? 'http://localhost:3000' : '';

let orderModel = {
    orderDetails: orderDetails,
    items: items,
    totalPrice: null,
};

let paymentDetails = null;

$(window).on('load', function () {
    $('#orderFromDetails').submit(updateOrderDetails);
    $('#paymentFromDetails').submit(validtionPaymentDetails);
    setModalNonClosing('#completedOrderModal')
})

// Updates and verifies the order details form inputs 
function updateOrderDetails(event) {
    event.preventDefault();
    const objectFromValues = getFormValues('#orderFromDetails');

    const url = `${hostName}/order/updateDetails`
    var xHttp = new XMLHttpRequest();

    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            const udatedDetails = JSON.parse(this.responseText);
            orderModel.orderDetails = udatedDetails;
            // Renders the updated details
            renderUpdatedOrderDetails(udatedDetails);
            $('#orderModal').modal('hide');

        } else if (this.readyState === 4 && this.status === 409) {
            errors = JSON.parse(this.responseText);
            // Displays the error messages in the form
            formVerification(errors);
        }
    }
    xHttp.open('POST', url, true)
    xHttp.setRequestHeader('Content-Type', 'application/json');
    xHttp.send(JSON.stringify(objectFromValues));
}


// Verifies the payment form inputs
function validtionPaymentDetails(event) {
    event.preventDefault();

    const objectFromValues = getFormValues('#paymentFromDetails');

    const url = `${hostName}/order/validPaymentDetails`
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            paymentDetails = objectFromValues;

            renderPaymentDetails(objectFromValues);

            renderPanelPaymentBtn();
            $('#paymentModal').modal('hide');
        } else if (this.readyState === 4 && this.status === 409) {
            errors = JSON.parse(this.responseText);
            formVerification(errors);
        }
    }
    xHttp.open('POST', url, true)
    xHttp.setRequestHeader("Content-Type", "application/json");
    xHttp.send(JSON.stringify(objectFromValues));
}

// Payment button function
function onPayBtn() {
    const url = `${hostName}/order/validOrderDetails`
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            $('#paymentModal').modal('show');
            // Hide message
            $('#msg').hide();
        } else if (this.readyState === 4 && this.status === 409) {
            // Show message
            $('#msg').show();
            // Scroll page to top
            $('html, body').animate({
                scrollTop: $("#msg").offset().top
            }, 100);
        }
    }
    xHttp.open('POST', url, true)
    xHttp.setRequestHeader("Content-Type", "application/json");
    xHttp.send(JSON.stringify(orderModel));
}

// Oreder button function
function onOrderBtn() {
    orderModel.totalPrice = totalPriceCalculation(orderModel.items);
    const data = {
        orderModel,
        paymentDetails
    }
    const url = `${hostName}/order`
    var xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            $('#completedOrderModal').modal('show');
        }
    }
    xHttp.open('POST', url, true)
    xHttp.setRequestHeader("Content-Type", "application/json");
    xHttp.send(JSON.stringify(data));
}

// Render updated order details
function renderUpdatedOrderDetails(updatedDetails) {
    const htmlStr = `
        <p class="section-row mb-0">${updatedDetails.firstName} ${updatedDetails.lastName}</p>
        <p class="section-row">${updatedDetails.phone}</p>
        <p class="section-row">${updatedDetails.email}</p>
        <p class="section-row mb-0">${updatedDetails.address.city}, ${updatedDetails.address.street}</p>
        <p class="section-row">${updatedDetails.address.state}, ${updatedDetails.address.zipCode}</p>`
    $('.details-order .content').html(htmlStr);
}

// Renders payment details
function renderPaymentDetails(pymentDetails) {
    const { cardNumber, expirationMonth, expirationYear, firstName, lastName } = pymentDetails;
    const htmlStr = `
        <div class="section">
            <p class="title-section">פריטי תשלום</p>
            <div class="content">
                <div class="d-flex">
                    <p class="my-0 ms-1 fw-bold">שם בעל כרטיס:</p>
                    <p class="my-0">${firstName} ${lastName}</p>
                </div>
                <div class="d-flex">
                    <p class="my-0 ms-1 fw-bold">מספר כרטיס:</p>
                    <p class="my-0">${cardNumber.slice(cardNumber.length - 4)}••••</p>
                </div>
                <div class="d-flex mb-2">
                    <p class="my-0 ms-1 fw-bold">תוקף כרטיס:</p>
                    <p class="my-0">${expirationMonth}-${expirationYear}</p>
                </div>
                <button class="btn btn-success" onclick="onPayBtn()">ערוך</button>   
            </div>
        </div>
        `;
    $('.box').html(htmlStr);
}

// Change the button "Pay" to "Order" 
function renderPanelPaymentBtn() {
    const htmlStr = `
        <button class="btn btn-primary" onclick="onOrderBtn()">הזמן</button>
    `;
    $('.PanelPaymentBtn').html(htmlStr);
}

//Calculates the amount of order items
function totalPriceCalculation(items) {
    let totalPrice = 0;
    items.forEach((item) => {
        totalPrice += item.itemID.price;
    })
    return totalPrice;
}

// Gets selector of form and returns the inputs values as an object
function getFormValues(selector) {
    const arrayInputValues = $(selector).serializeArray();
    // Convert "arrayInputValues" to object
    const objectInputValues = {};
    arrayInputValues.forEach(function (input) {
        objectInputValues[input.name] = input.value;
    });
    return objectInputValues;
}

// Get selector of modal and Cancels function model closure
function setModalNonClosing(selector) {
    $(selector).on('hide.bs.modal', function () {
        return false;
    });
}
