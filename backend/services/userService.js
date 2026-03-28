const UserModel = require("../model/userModel");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 12;

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

module.exports = { registerUser, loginUser };