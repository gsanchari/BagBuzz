const port = 3001;
const express = require ("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash")

require("dotenv").config();

const database = require("./config/mongoose-connection.js");
const ownersRouter = require("./routes/ownersRouter.js");
const usersRouter = require("./routes/usersRouter.js");
const productsRouter = require("./routes/productsRouter.js")

const indexRouter = require("./routes/index.js"); 
const signupLoginRouter = require("./routes/signupLogin.js"); 
const shopRouter = require("./routes/shop.js")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET,
    })
);
app.use(flash());

app.use("/owner", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);

app.use("/", indexRouter); 
app.use("/users", signupLoginRouter); 
app.use("/users", shopRouter);


// app.get("/", (req,res)=>{
//     res.send("hey");
// })

app.listen(port, ()=>{
    console.log(`Server listen ${port}`);
})


