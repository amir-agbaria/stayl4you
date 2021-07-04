const express = require('express');
const router = express.Router();

// Render home page
router.get('', (req, res) => {
    // Check if have login user
    const user = req.session && req.session.user
        ? req.session.user
        : null;
    res.render('pages/index', { user, pageName: 'home' });
});

module.exports = router;
