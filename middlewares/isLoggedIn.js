const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "You need to log in first");
        return res.redirect("/register");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel
            .findOne({ email: decoded.email })
            .select("-password");

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect("/register");
        }

        req.user = user;
        next();
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        req.flash("error", "Session expired or invalid token");
        res.redirect("/register");
    }
};
