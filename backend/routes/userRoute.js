const express = require("express");
const UserModel = require("../model/userModel");
const userRouter = express.Router(); //creates a router object to handle routes for user-related operations
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const emailHelper = require("../config/emailHelper")
const {registerUser} = require("../controllers/userController");

const SALT_Rounds = 12;

// Collision check
// 90000 - 99999
const otpGenerator = function () {
    return Math.floor((Math.random() * 10000) + 90000);
}

userRouter.post("/register", registerUser);

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
            token,
            role:user.role
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
})

userRouter.get("/get-current-user", authMiddleware, async function (req, res){
    try {
        const userId = req.userId
        if(!userId) {
            return res.status(500).send({
                success: false,
                message: "Something went wrong! Try again"
            })
        }

        const user = await UserModel.findById(userId).select("-password")
        res.send({
            success: true,
            user
        })
    } 
    catch (err) {
        res.status(500).send({
            success: false,
            message: "Something went wrong! Try again"
        })
    }
})

userRouter.post("/forgetpassword", async function(req, res){
    /****
        * 1. You can ask for email
        * 2. check if email is present or not
        *  * if email is not present -> send a response to the user(user not found)
        * 3. if email is present -> create basic otp -> and send to the email 
        * 4. also store that otp -> in the userModel
        * 5. to avoid that collison
        *      response -> unique url with id of the user and that will form your reset password 
        * 
    ****/
    try{
        if(req.body.email == undefined){
            res.status(401).json({
                status: "failure",
                message: "Please enter the email for forget Password"
            })
        }

        // find the user -> going db -> getting it for the server
        let user = await UserModel.findOne({email : req.body.email})

        // If user is not present, then we can't reset password
        if (user == null) {
            return res.status(404).json({
                status: "failure",
                message: "user not found for this email"
            })
        }

        const otp = otpGenerator();

        // Check if this OTP is present in the OTPTable
        // Maybe use a while loop while here


        // Alternative
        // Before saving OTP< check if OTP is present for any user
        // UserModel.findOne({ otp: otp });

        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000; //10 mins from now, the otp will expire
        // those updates will be send to the db
        await user.save();
        res.status(200).json({
            status: "success",
            message: "otp sent to your email",
        });
        // send the mail to there email -> otp
        await emailHelper(
            "otp.html"
            , user.email,
            {
                name: user.name,
                otp: otp
            }
        );
    }
    catch(err){
        console.log({ err })
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
})

userRouter.post("/resetpassword", async function(req, res){
    try{
        let resetDetails = req.body;

        if(!resetDetails.password == true || !resetDetails.otp == true){
            return res.status(401).json({
                status: "failure",
                message: "invalid request"
            })
        }

        const user = await UserModel.findOne({otp : req.body.otp})
        if(!user){
            return res.status(404).json({
                status: "failure",
                message: "OTP is wrong"
            })
        }

        if(user.otpExpiry < Date.now()){
            return res.status(404).json({
                status: "failure",
                message: "OTP is Expired"
            })
        }

        const gensalt = await bcrypt.genSalt(SALT_Rounds);
        const hashedpassword = await bcrypt.hash(req.body.password, gensalt);

        user.password = hashedpassword;
        // remove the otp from the user
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({
            status: "success",
            message: "password reset successfully"
        })
        console.log("Reset")
    }
    catch(err){
        res.status(500).json({
            message: err.message,
            status: "failure"
        })
    }
    
})

module.exports = userRouter;