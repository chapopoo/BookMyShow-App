const UserModel = require("../model/userModel");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const emailHelper = require("../config/emailHelper")

const SALT_ROUNDS = 12;

// Collision check
// 90000 - 99999
const otpGenerator = function () {
    return Math.floor((Math.random() * 10000) + 90000);
}

const registerUser = async (data) => {

    if (!data.email || !data.password || !data.name) {
        throw new Error("All fields are required");
    }

    data.email = data.email.toLowerCase().trim();

    const isEmailValid = validator.validate(data.email);
    if (!isEmailValid) {
        throw new AppError("Invalid email", 400);
    }

    if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 7. Create user
    const user = new UserModel({
        ...data,
        password: hashedPassword
    });

    await user.save(); // Save user to database

    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};

const loginUser = async (data) => {

    if (!data.email || !data.password) {
        throw new Error("Email and password are required");
    }

    const email = data.email.toLowerCase().trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
        throw new AppError("User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 400);
    }

    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return {
        token,
        role: user.role,
        name: user.name,
        email: user.email
    };
};

const getCurrentUser = async (data) => {
    const userId = data.userId;
    if (!userId) {
        throw new Error("User ID is required");
    }

    //we dont want to send the password to the client, so we are using select to exclude the password field from the user object
    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return {
        user
    };
}

const forgetPassword = async (data) => {
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
    if (!data.email) {
        throw new Error("Email is required");
    }

    const email = data.email.toLowerCase().trim();

    // find the user -> going db -> getting it for the server
    const user = await UserModel.findOne({ email });

    // If user is not present, then we can't reset password
    if (!user) {
        throw new AppError("User not found", 404);
    }

    // Generate OTP
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

    // send the mail to there email -> otp
    await emailHelper(
        "otp.html",
        user.email,
        {
            name: user.name,
            otp: otp
        }
    );

    return {
        message: "OTP sent to your email",
        email: user.email
    };
};

const resetPassword = async (data) => {
    if (!data.password || !data.otp) {
        throw new Error("Password and OTP are required");
    }

    const user = await UserModel.findOne({ otp: data.otp });

    if (!user) {
        throw new AppError("Invalid OTP", 404);
    }

    if (user.otpExpiry < Date.now()) {
        throw new AppError("OTP expired", 400);
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    user.password = hashedPassword;

    // clear OTP // remove the otp from the user
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return {
        success: true,
        message: "Password reset successfully"
    };
};

module.exports = { registerUser, loginUser, getCurrentUser, forgetPassword, resetPassword };