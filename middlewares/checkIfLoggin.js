function checkIfloggin(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).redirect('/login');
    }
}



module.exports = {
    checkIfloggin
}