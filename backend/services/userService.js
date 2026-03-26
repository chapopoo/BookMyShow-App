const UserModel = require("../model/userModel");
const validator = require("email-validator");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

const SALT_ROUNDS = 12;

const registerUser = async (data) => {

    // 1. Validate required fields
    if (!data.email || !data.password || !data.name) {
        throw new Error("All fields are required");
    }

    // 2. Normalize email
    data.email = data.email.toLowerCase().trim();

    // 3. Validate email format
    const isEmailValid = validator.validate(data.email);
    if (!isEmailValid) {
        throw new Error("Invalid email", 400);
    }

    // 4. Check password strength
    if (data.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    // 5. Check if user already exists
    const existingUser = await UserModel.findOne({ email: data.email });
    if (existingUser) {
        throw new AppError("User already exists", 409);
    }

    // 6. Hash password
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // 7. Create user
    const user = new UserModel({
        ...data,
        password: hashedPassword
    });

    await user.save();

    // 8. Return safe data only
    return {
        _id: user._id,
        name: user.name,
        email: user.email
    };
};

const loginUser = async (data) => {

}
module.exports = { registerUser };