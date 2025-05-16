const port = 3001;
const express = require ("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");

const database = require("./config/mongoose-connection.js");
const ownersRouter = require("./routes/ownersRouter.js");
const usersRouter = require("./routes/usersRouter.js");
const productsRouter = require("./routes/productsRouter.js")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/products", productsRouter);


// app.get("/", (req,res)=>{
//     res.send("hey");
// })

app.listen(port, ()=>{
    console.log(`Server listen ${port}`);
})


