const mongoose = require("mongoose");

const userScemaRules = {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    // isAdmin:{
    //     type: Boolean,
    //     required: false,
    //     default: false
    // }
    role: {
        type: String,
        required: true,
        default: "user" //user, admin, partner
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
}

const userScema = new mongoose.Schema(userScemaRules)
const UserModel = mongoose.model("users", userScema); //users is the collection name in the database

module.exports = UserModel;