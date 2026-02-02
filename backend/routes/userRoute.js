const express = require("express");
const UserModel = require("../model/userModel");
const userRouter = express.Router(); //creates a router object to handle routes for user-related operations
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SALT_Rounds = 12;

userRouter.post("/register", async (req, res) => {
    try {
        const isEmailValid = validator.validate(req.body.email)

        if (!isEmailValid) {
            return res.status(500).send({
                success: false,
                message: "Please enter a valid email"
            })   
        }

        //checking if user with the email already exists
        const isUserPresent = await UserModel.findOne({
            email: req.body.email
        }) 
        if(isUserPresent){
           return res.status(500).send({
                success: false,
                userPresentError: true,
                message: "User with this email already exists"
            })
        }

        const user = new UserModel(req.body); //creating new user object locally

        //generating a salt and hashing the password with the salt
        const gensalt = await bcrypt.genSalt(SALT_Rounds) 
        const hashedpassword = await bcrypt.hash(req.body.password, gensalt) 

        user.password = hashedpassword; //setting the hashed password to the user object

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
                message:"No email/password combo found"
            })
        }

        //start my JWT token generation
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        )

        res.send({
            success: true,
            message: "Logged In successfully",
            token
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