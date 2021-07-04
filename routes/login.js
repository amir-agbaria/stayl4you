const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');
const loginService = require('../services/loginService');

// Render login page
router.get('/', (req, res) => {
    res.render('pages/login', {
        errors: null, dataForm: {}, user: null, pageName: ''
    });
});

// Login user
router.post('/', [
    // Data validation
    body('email', 'נא להזין כתובת מייל תקנית').exists().isEmail(),
    body('password', 'נא להזין סיסמא').exists().bail().notEmpty()
], async (req, res) => {
    const data = req.body;
    let errors = validationResult(req).errors;
    if (errors.length > 0) {
        return res.status(409).render('pages/login', {
            errors: errors, dataForm: data, user: null, pageName: ''
        });
    }

    // Get user from DB by email
    let user = await userService.getUserByEmail(data.email);

    if (user === null) {
        errors = loginService.createIncorrectErrors();
        return res.status(409).render('pages/login', {
            errors: errors, dataForm: data, user: null, pageName: ''
        });
    }

    // Check user password
    const isMatch = await bcrypt.compare(data.password, user.password)
    // If the password is invalid
    if (isMatch === false) {
        errors = loginService.createIncorrectErrors();
        return res.status(409).render('pages/login', {
            errors: errors, dataForm: data, user: null, pageName: ''
        });
    }

    // Save user logged in the session
    req.session.user = user;
    user.password = undefined; // hide the user password

    res.status(200).render('pages/login', {
        errors: errors, dataForm: data, user: user, pageName: ''
    });
});


module.exports = router;
