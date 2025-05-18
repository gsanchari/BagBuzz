const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn.js")

router.get("/register", (req, res)=>{
    let error = req.flash("error");
    res.render("signupLogin.js", {error});
} )

router.get("/shop", isLoggedIn, (req, res) => {
    res.render("shop.ejs");
})


module.exports = router;


