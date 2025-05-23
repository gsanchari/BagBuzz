const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn.js");
const productModel = require("../models/product-model.js");
const userModel = require("../models/user-model.js");

// Route to Shop Page
router.get("/shop", isLoggedIn, async (req, res) => {
    const gender = req.query.gender ? req.query.gender.toLowerCase() : null;
    let products;

    if (gender === "woman" || gender === "man") {
        products = await productModel.find({ gender: gender });
    } else {
        products = await productModel.find();
    }

    let success = req.flash("success");
    res.render("shop.ejs", { products, success, selectedGender: gender });
});

// Route to Cart Page
router.get("/cart", isLoggedIn, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate("cart.product");

    const cartItems = user.cart
        .filter(item => item.product) // Ignore missing product references
        .map(item => {
            const product = item.product;
            const quantity = item.quantity;
            const finalCost = (Number(product.price) + 20 - Number(product.discount || 0)) * quantity;

            return {
                ...product._doc,
                quantity,
                finalCost
            };
        });

    res.render("cart.ejs", { user, cartItems });
});

// Add product to cart
router.get("/addtocart/:id", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    // Clean up broken references
    user.cart = user.cart.filter(item => item.product);

    const existing = user.cart.find(item => item.product?.toString() === req.params.id.toString());

    if (existing) {
        existing.quantity += 1;
    } else {
        user.cart.push({ product: req.params.id, quantity: 1 });
    }

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/users/shop");
});

// Increment quantity in cart
router.get("/increment/:id", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    const item = user.cart.find(i => i.product?.toString() === req.params.id.toString());
    if (item) item.quantity += 1;

    await user.save();
    res.redirect("/users/cart");
});

// Decrement quantity in cart
router.get("/decrement/:id", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    const item = user.cart.find(i => i.product?.toString() === req.params.id.toString());
    if (item && item.quantity > 1) item.quantity -= 1;

    await user.save();
    res.redirect("/users/cart");
});

// Remove item from cart
router.get("/deletefromcart/:id", isLoggedIn, async (req, res) => {
    const user = await userModel.findOne({ email: req.user.email });

    user.cart = user.cart.filter(item => item.product?.toString() !== req.params.id.toString());

    await user.save();
    req.flash("success", "Item removed from cart");
    res.redirect("/users/cart");
});

module.exports = router;
