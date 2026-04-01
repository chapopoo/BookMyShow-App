const express = require("express");
const userRouter = express.Router(); //creates a router object to handle routes for user-related operations
const authMiddleware = require("../middlewares/authMiddleware");
const {registerUser, loginUser, getCurrentUser, forgetPassword, resetPassword} = require("../controllers/userController");

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/get-current-user", authMiddleware, getCurrentUser)

userRouter.post("/forgetpassword", forgetPassword)

userRouter.post("/resetpassword", resetPassword)

module.exports = userRouter;