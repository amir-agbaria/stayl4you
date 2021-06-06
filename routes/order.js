const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const userService = require('../services/userService');
const cartService = require('../services/cartService');
const orderService = require('../services/orderService');

const { checkIfloggin } = require('../middlewares/checkIfLoggin');

// Render "Order" page
router.get('/', checkIfloggin, async (req, res) => {
    // Creates a copy of the user in the session
    let user = JSON.parse(JSON.stringify(req.session.user))

    user.password = undefined;
    user.isAdmin = undefined;
    user.__v = undefined;

    const itemsCart = await cartService.getUserCartsByUserId(user._id);

    user._id = undefined;

    res.render('pages/order', {
        user, itemsCart, pageName: 'order'
    });
});

// Create new "Order"
router.post('/', checkIfloggin, async (req, res) => {
    const { orderModel, paymentDetails } = req.body;
    const user = req.session.user

    orderModel.userId = user._id
    // Creats new order
    orderCreated = await orderService.createOrder(orderModel);
    // Clears user's cart
    await cartService.deleteUserCartsByUserId(user._id);

    res.status(200).end();
})

router.delete('/:orderID', checkIfloggin, async (req, res) => {
    var orderID = req.params.orderID;

    var deletedOrder = orderService.deleteOrder(orderID);

    res.status(200).end();
})

router.post('/updateDetails', checkIfloggin, [
    // Data validation
    body('firstName', 'נא להזין שם פרטי').exists().notEmpty(),
    body('lastName', 'נא להזין שם פרטי').exists().notEmpty(),
    body('email', 'נא להזין מייל חוקי').exists().isEmail(),
    body('phone', 'מספר פלאפון אמור להיות באורך 10 ספרות ולהתחיל ב05').exists().matches(/^05\d{8}$/),
    body('street', 'נא להזין כתובת').exists().notEmpty(),
    body('city', 'נא להזין שם עיר').exists().notEmpty(),
    body('zipCode', 'במיקוד אמור להיות מספר בן 7 ספרות כגון: 1234567').exists().matches(/^\d{7}$/),
    body('state', 'נא להזין אזור').exists().notEmpty()
], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) return res.status(409).json(errors);

    const { firstName, lastName, phone, email, city, street, state, zipCode } = req.body
    const orderDitails = {
        _id: req.session.user._id,
        firstName,
        lastName,
        email,
        phone,
        address: {
            state,
            city,
            street,
            zipCode
        }
    };
    const updatedUser = await userService.updateUser(orderDitails);

    req.session.user = JSON.parse(JSON.stringify(updatedUser));;

    updatedUser._id = undefined;
    updatedUser.password = undefined;
    updatedUser.isAdmin = undefined;
    updatedUser.__v = undefined;

    res.status('200').json(updatedUser);
});

router.post('/validOrderDetails', [
    // Data validation
    body('orderDetails', 'יש להשלים פרטים').exists().custom(function (orderDetils) {
        console.log({ orderDetils });
        var isValid = Object.keys(orderDetils).every(function (key) {
            if (!orderDetils[key]) return false;
            if (key === 'address') {
                return Object.values(orderDetils[key]).every(function (values) {
                    return values ? true : false;
                });
            }
            return true;
        });
        return isValid;
    })
], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).json('Order details are missing')
    }
    res.status(200).json('Order details is valided')
})

router.post('/validPaymentDetails', [
    // Data validation
    body('firstName', 'נא להזין שם פרטי').exists({ checkFalsy: true }),
    body('lastName', 'נא להזין שם משפחה').exists({ checkFalsy: true }),
    body('expirationMonth', 'נא להזין תאריך תפוגה').exists({ checkFalsy: true }),
    body('expirationYear', 'נא להזין תאריך תפוגה').exists({ checkFalsy: true }),
    body('securityCode', 'נא להזין קוד ביטחון תקין').exists({ checkFalsy: true }).matches(/^\d{3}$/),
    body('cardNumber', 'נא להזין מספר כרטיס תקין').exists({ checkFalsy: true }).matches(/^\d+$/),
], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).json(errors)
    }
    res.status(200).json(req.body)
})

module.exports = router;