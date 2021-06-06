const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const itemService = require('../services/itemService');
const utilsService = require('../services/utilsService');
const cartService = require('../services/cartService');
const { checkIfloggin } = require('../middlewares/checkIfLoggin');

// Render items
router.get('/', async (req, res) => {
    const user = req.session && req.session.user
        ? req.session.user
        : null;

    const { query } = req.query;

    const filter = {};
    if (query && 's' in query) {
        filter.name = query.s;
    }

    const items = await itemService.getItems(filter);

    res.render('pages/store', { items: items, user, pageName: 'store' });
});

// Render item by id
router.get('/item/:id', async (req, res) => {
    // Check if user log in
    const user = req.session && req.session.user
        ? req.session.user
        : null;

    // Get the item by ID
    const itemID = req.params.id;

    const item = await itemService.getItemByID(itemID);
    if (item === null) {
        // Not found page
    } else {
        res.render('pages/item', { item, user, pageName: 'store' });
    }
});

// Add item to "Items cart"
router.post('/item/:id', checkIfloggin, [
    // Data validation
    param('id').exists().withMessage('Id item is require')
        .custom(id => mongoose.Types.ObjectId.isValid(id)).withMessage('Invalid item ID'),
    body('size').exists().withMessage('please add size')
        .isIn(['xs', 's', 'm', 'l', 'xl', 'xxl'])
        .withMessage('\'size\' should be xs, s, m, l, xl or xxl.').toLowerCase()
], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).json(errors);
    }

    const itemID = req.params.id;
    const item = await itemService.getItemByID(itemID);

    // If item not found
    if (item === null) {
        const err = utilsService.createValidationError(
            `Item not fonded itemID`, 'itemID', itemID)
        errors.push(err);
        return res.status(409).json(errors);
    }

    const userID = req.session.user._id;
    const cart = {
        userID,
        itemID,
        size: req.body.size
    }
    const cartCreated = await cartService.addToCart(cart);

    res.status(200).redirect('/store');
});


module.exports = router;
