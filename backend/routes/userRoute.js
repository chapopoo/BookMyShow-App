const express = require("express");
const UserModel = require("../model/userModel");
const userRouter = express.Router(); //creates a router object to handle routes for user-related operations

userRouter.post("/register", async (req, res) => {
    try {
        const user = new UserModel(req.body); //creating a js object out of the class defined in userModel.js
        await user.save(); //saving the user object to the database

        res.send({
            success: true,
            message: "User registered successfully",
            data: user
        })
    }
    catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
})

module.exports = userRouter;