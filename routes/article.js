const express = require("express");
const router = express.Router();
const Article = require("../models/article");

router.get("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    res.render('edit', { name: req.user.username, article, csrfToken: req.csrfToken() });
})

router.post("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    await Article.findByIdAndUpdate(id, data);
    res.redirect("/");
})

router.get("/new", (req, res) => {
    const article = { 
        title: "",
        description: "",
        markdown: ""
    } // trickster
    return res.render("new", { name: req.user.username, csrfToken: req.csrfToken(), article });
})

router.post("/new", async (req, res) => {
    let article = req.body;
    article.author = req.user.username;
    const newArticle = new Article(article);
    await newArticle.save();
    res.redirect("/");
})


router.get('/search', async (req, res) => {
    const keyword = req.query.keyword;
    try {
        const articles = await Article.find({ title: new RegExp('^.*'+ keyword +'.*$', "i")});
        
        return res.render("search", { articles });
    } catch (error) {
        res.redirect('/');
    }
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    res.render("blog", { name: req.user.username, article, csrfToken: req.csrfToken() });
})

router.delete("/:id", async (req, res) => {
    await Article.findByIdAndDelete(req.params.id);
    res.send({ message: "success" });
})

router.post('/comment/:id', async (req, res) => {
    const comment = req.body.comment;
    Article.findByIdAndUpdate(req.params.id, {$push: { comments: { user: req.user.username, comment, date: new Date() }}}).then((result) => {
        return res.redirect(req.get('referer'));
    }).catch((error) => {
        console.log(error.message);
        return res.redirect(req.get('referer'));
    })

})

module.exports = router;