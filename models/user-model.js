const mongoose = require('mongoose');

//mongoose.connect("mongodb://127.0.0.1:27017/bagShop");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
    },
    email: String,
    password: String,
    cart: {
        type: Array,
        default:[]
    },
    gender:String,
    orders: {
        type: Array,
        default:[]
    },
    contect: Number,
    picture: String
});

module.exports = mongoose.model("user", userSchema)