const userService = require("../services/userService");

const registerUser = async (req, res) => {
    try {
        const result = await userService.registerUser(req.body);

        res.status(200).send({
            success: true,
            message: "User registered successfully",
            data: result
        });

    } catch (err) {
        console.log(err.message)
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const loginUser = async (req, res) => {
    try {
        console.log(req.body);
        const result = await userService.loginUser(req.body);

        res.send({
            success: true,
            message: "Logged in successfully",
            ...result
        });

    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message
        });
    }
};

module.exports = { registerUser, loginUser };