const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userService = require('../services/userService');
const { checkIfloggin } = require('../middlewares/checkIfLoggin');

// Render "profile" page
router.get('/', checkIfloggin, async (req, res) => {
    const user = req.session.user;
    res.render('pages/profile', { user, pageName: 'profile' });
});

router.get('/edit', checkIfloggin, async (req, res) => {
    const user = req.session.user;
    res.render('pages/editProfile', { user, pageName: 'profile', errors: null });
})

router.post('/edit', checkIfloggin, [
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
    const { firstName, lastName, phone, email, city, street, state, zipCode } = req.body
    const userToUpdate = {
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
    const errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.render('pages/editProfile',
            { user: userToUpdate, pageName: 'profile', errors });
    }

    const updatedUser = await userService.updateUser(userToUpdate);
    req.session.user = updatedUser;
    res.status(200).redirect('/profile')
})

module.exports = router;