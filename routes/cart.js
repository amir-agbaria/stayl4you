const express = require('express');
const router = express.Router();
const cartService = require('../services/cartService');
const { checkIfloggin } = require('../middlewares/checkIfLoggin');

router.get('', checkIfloggin, async (req, res) => {
    // Check if user is logged in
    if (!req.session || !req.session.user) {
        return res.status(401).redirect('/login');
    }
    const user = req.session.user;
    const itemsCart = await cartService.getUserCartsByUserId(user._id);
    res.render('pages/cart',
        { user, pageName: 'cart', itemsCart });
});

router.delete('/item/:id', checkIfloggin, async (req, res) => {
    const cartID = req.params.id;
    const deletedCart = await cartService.deleteFromCart(cartID);

    if (!deletedCart) {
        return res.status(409).json({ error: 'Item cart not founded' })
    }

    res.status(200).json({ massage: 'Item cart deleted' });
});

module.exports = router;
