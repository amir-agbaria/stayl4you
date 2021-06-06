const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');
const itemService = require('../services/itemService');

// Create new item
// Data validation
router.post('/create', [
    body('name').exists().withMessage('\'name\' is required.').bail()
        .isString().withMessage('Item name should be \'string\'.'),
    body('price').exists().withMessage('\'price\' is required.').bail()
        .isFloat({ min: 1 }).withMessage('\'price\ should be \'Number\' 1 or up.'),
    body('imgUrl').exists().withMessage('\'imgUrl\' is required.').bail()
        .isString().withMessage('\'imgUrl\' should be \'string\'.'),
    body('description').exists().withMessage('\'description\' is required.').bail()
        .isString().withMessage('\'description\' should be \'string\'.'),
    body('category').exists().withMessage('\'category\' is required.').bail()
        .isIn(['shirt', 'pants']).withMessage('\'category\' should be: shirt or pants.'),
    body('sizes').exists().withMessage('\'sizes\' is required.').bail()
        .isArray({ min: 1 }).withMessage('\'sizes\' should be \'array\'.').bail()
        .custom((sizes) => {
            const arr = ['xs', 's', 'm', 'l', 'xl', 'xxl'];
            return sizes.every(size => arr.includes(size.toLowerCase()));
        }).withMessage('\'sizes\' should be xs, s, m, l, xl or xxl.').toLowerCase(),

], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).json(errors);
    }

    const item = req.body;
    const newItem = await itemService.createItem(item);

    res.status(200).json(newItem);
});


// Delete item by id
router.delete('/remove/:id', [
    param('id').exists().withMessage('\'id\' is required').bail()
        .custom(id => mongoose.Types.ObjectId.isValid(id))
        .withMessage('Invalid id')

], async (req, res) => {
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).json(errors);
    }
    const itemID = req.params.id
    const deletedItem = await itemService.deleteItem(itemID);

    if (deletedItem) {
        res.status(200).json({ massage: 'Item deleted\n itemID: ' + deletedItem._id });
    } else {
        res.status(409).json({ massage: 'Item deleted failed because item not found\n itemID: ' + itemID });
    }
});


module.exports = router;
