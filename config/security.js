//console.log("hello from security");



module.exports = {
    ensureAuthentication: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        } else {
            req.flash('danger', 'Please Login!');
            res.redirect('/users/login');
        }

    }

}