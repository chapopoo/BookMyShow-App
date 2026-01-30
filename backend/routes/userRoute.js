const express = require("express");
const UserModel = require("../model/userModel");
const userRouter = express.Router(); //creates a router object to handle routes for user-related operations
const bcrypt = require("bcryptjs");

const SALT_Rounds = 12;

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
    catch(e) {
        console.log(e)
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
})

userRouter.post("/login", async function(req, res){
    try {
        const user = await UserModel.findOne({
            email:req.body.email
        }); //finding the user object from the database
        
        console.log(user)
        if(!user){
            return res.status(404).send({
                success:false,
                message:"User not found"
            })
        }

        //checking password
        // if(user.password !== req.body.password){
        //     return res.status(404).send({
        //         success:false,
        //         message:"No user/pass combo found"
        //     })
        // }

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password)
        if(!isPasswordValid){
            return res.status(404).send({
                success:false,
                message:"No user/pass combo found"
            })
        }

        res.send({
            success: true,
            message: "Logged In successfully",
            data: user
        })
    }
    catch(e) {
        console.log(e)
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
})

module.exports = userRouter;