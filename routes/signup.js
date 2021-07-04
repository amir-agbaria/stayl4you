const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userService = require('../services/userService');

// Render page login
router.get('/', (req, res) => {
    res.render('pages/signup', {
        errors: null, dataForm: {}, user: null, pageName: ''
    });
});

// Signup new user
router.post('/', [
    // Data validation
    body('email', 'נא להזין כתובת מייל תקנית')
        .exists().isEmail().custom(async (val, { req }) => {
            let user = await userService.getUserByEmail(val);
            if (user === null) { return true }
            throw new Error('כותבת מייל כבר בשימוש, נא להזין כתובת אחרת');
        }),
    body('password', 'סיסמא צריכה להיות בארוך של 8 תווים לפחות')
        .exists().bail().notEmpty().bail().isLength({ min: 8 }),
    body('confirmPass', 'נא להזין סיסמאות תואמות')
        .exists().bail().notEmpty().bail().custom((val, { req }) => {
            if (val !== req.body.password) { return false; }
            return true;
        })
], async (req, res) => {
    const data = req.body;
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(403).render('pages/signup', {
            errors: errors, dataForm: data, user: null, pageName: ''
        });
    }

    let userCreated = await userService.createUser(data);

    req.session.user = userCreated;

    res.status(200).render('pages/signup', {
        errors: errors, dataForm: data, user: userCreated, pageName: ''
    });
});

module.exports = router;
