const express = require('express');
const router = express.Router();
const { checkIfloggin } = require('../middlewares/checkIfLoggin');

const orderService = require('../services/orderService');

// Render history orders page
router.get('', checkIfloggin, async (req, res) => {
    var user = req.session.user

    var orders = await orderService.getOrders({ userId: user._id });

    res.render('pages/historyOrders', { user, pageName: 'history', orders });
});

// Render history orders page
router.get('/:orderID', checkIfloggin, async (req, res) => {
    var user = req.session.user
    var orderID = req.params.orderID;

    var order = await orderService.getOrderById(orderID);

    res.render('pages/historyOneOrder', { user, pageName: 'history', order });
});

module.exports = router;
