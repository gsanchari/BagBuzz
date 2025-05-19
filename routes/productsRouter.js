const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config.js");
const productModel = require("../models/product-model.js")

router.post("/create",upload.single("image"), async(req,res)=>{
    //res.send(req.file)
    try{
        let {name, price, discount,gender, bgcolor, panelcolor, textcolor} = req.body;
        let product = await productModel.create({
            name, 
            price, 
            discount,
            gender, 
            bgcolor, 
            panelcolor, 
            textcolor,
            image: req.file.buffer,
        })
        req.flash("success", "product Created Successfully")
        res.redirect("/owner/admin")
    }
    catch(err){
        res.send(err.message);
    }
})

module.exports = router