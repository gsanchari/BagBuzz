const express = require("express");
const router = express.Router();
const userModel = require("../models/user-model.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const {generateToken} = require("../utils/generateToken.js")

router.get("/register", (req, res) => {
    res.render("signupLogin.ejs");
})

router.post("/register", async(req, res) => {
    try{
        let {fullname, email, gender, password} = req.body;
        if (!fullname || !email || !password) {
            return res.status(400).send("All fields are required.");
        }

        let user = await userModel.findOne({email:email})
        if (user){
            return res.status(401).send("You already have an account,please login with anather account")
        }

        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(password, salt, async(err, hash)=>{
                if(err) return res.send(err.message);
                else{
                    let user = await userModel.create({
                        fullname: fullname,
                        email: email,
                        gender:gender,
                        password: hash
                    });
                    //let token = jwt.sign({email, id: user._id}, "hjiuytrewqasdfgh");
                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.send("user created successfully");

                }
            });
        });
    }
    catch(err){
        res.send(err.message)
    }
    
})

router.post("/login", async(req, res)=>{
    let {email, password} = req.body;
    let user = await userModel.findOne({email:email});
    if(!user){
        return res.send("Email or Password incorrect");
    }

    bcrypt.compare(password, user.password, (err, result)=>{
        if(result){
            let token = generateToken(user);
            res.cookie("token", token);
            res.status(200);
            //res.send("You Login Successfully");
            res.redirect("/shop");
            
        }
        else{
            res.redirect("/register");
        }
    })
})

router.get('/logout', (req,res)=>{
    res.cookie("token", "");
    res.redirect("/register")
})


module.exports = router;
