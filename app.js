if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const Article = require("./models/article");
const Contact = require("./models/contact");
const passport = require("passport");
const mongoSanitize = require('express-mongo-sanitize');
const csurf = require("csurf");
const { checkAuthenticated, checkNotAuthenticated } = require("./middleware/auth");

const csrfProtection = csurf();

try {
    mongoose.connect('mongodb://blogUser:password123@localhost:27017/blog');
    console.log('DB connected');
} catch (error) {
    console.log('Error: ' + error.message);
}

app.use(express.static("./public"));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(flash());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrfProtection);
app.use(mongoSanitize());

app.set('view engine', 'pug');


app.get("/", checkAuthenticated, async function (req, res) {
    const articles = await Article.find();

    res.render('homepage', { name: req.user.username, articles, csrfToken: req.csrfToken() });
});

app.delete("/logout", (req, res) => {
    req.logOut();
    res.send();
})

app.get("/contact", checkAuthenticated, (req, res) => {
    res.render("contact",  { name: req.user.username });
})

app.post("/contact", async (req, res) => {
    try {
        await new Contact(req.body).save();
        res.redirect("/");
    }
    catch (error) {
        res.redirect("/contact");
    }
})

app.get('/search', checkAuthenticated, async (req, res) => {
    const keyword = req.query.keyword;
    try {
        const articles = await Article.find({ title: new RegExp('^.*'+ keyword +'.*$', "i")});
        
        return res.render("search", { name: req.user.username, articles });
    } catch (error) {
        res.redirect('/');
    }
})

app.use("/auth", checkNotAuthenticated, require("./routes/auth"));
app.use("/article", checkAuthenticated, require("./routes/article"));

const port = process.env.PORT || 3000;

app.listen(port);
console.log("Server is listening on", port);