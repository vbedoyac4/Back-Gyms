module.exports = {
    isLoggedIn (req, res, next) {
        console.log(req)
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }
};