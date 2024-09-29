const User = require("../models/user.js");
module.exports.renderSignUp = (req, res) => {
    res.render("user/signUp.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        let registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "welcome to wonderlust");
            res.redirect("/listing");
        })
    } catch (err) {
        req.flash('error', "User already exist");
    }
};

module.exports.renderLogIn =  (req, res) => {
    res.render("user/login.ejs");
};

module.exports.logIn = async (req, res) => {
    try {
        req.flash("success", "Welcome back to wonderlust");
        let redirectUrl = res.locals.redirectUrl || "/listing";
        res.redirect(redirectUrl);
    } catch (err) {
        console.log(err);
    }
};

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listing");
    })
};

