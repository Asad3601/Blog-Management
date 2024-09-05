const CheckLogin = (req, res, next) => {
    if (req.session.user) {
        next(); // User is logged in
    } else {
        res.redirect('/login_form'); // Redirect to login form
    }
};
const CheckAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role == 'admin') {
        next(); // User is logged in
    } else {
        res.redirect("/login_form"); // Redirect to login form
    }
};

// PreventLoggedIn.js
const PreventLoggedIn = (req, res, next) => {
    if (req.session.user && req.session.user.role == 'admin') {
        // User is logged in, redirect to profile or another page
        res.redirect('/dashboard'); // or any other route like '/dashboard'
    } else if (req.session.user && req.session.user.role == 'user') {
        // User is logged in, redirect to profile or another page
        res.redirect('/'); // or any other route like '/dashboard'
    } else {
        // User is not logged in, proceed to the login route
        next();
    }
};



module.exports = {
    PreventLoggedIn,
    CheckLogin,
    CheckAdmin,

};