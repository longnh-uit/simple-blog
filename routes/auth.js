const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require('passport');

const initializePassport = require('../config/passport-config');
initializePassport(
    passport, 
    username => User.findOne({ username }),
    id => User.findById(id).then(user => user)
)

router.get("/login", function (req, res) {
    res.render("login", { csrfToken: req.csrfToken() });
});

router.post("/login", passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true
}));

router.get("/signup", (req, res) => {
    res.render("sign_up", { csrfToken: req.csrfToken() });
})

router.post("/signup", async (req, res) => {
    const { username, password } = req.body;

    const checkExist = await User.findOne({ username });
    if (checkExist) {
        req.flash("error", "Username is already exist, please choose another");
        return res.redirect("/auth/signup");
    }

    if (password != req.body.confirmPassword) {
        req.flash("error", "Password does not match");
        return res.redirect("/auth/signup");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User({ username, password: hashedPassword });
    try {
        newUser.save();
        console.log("Sign up successfully!");
        return res.redirect('/auth/login');
    } catch(error) {
        console.log("Error: " + error.message);
        return res.redirect('/auth/signup');
    }
})

module.exports = router;