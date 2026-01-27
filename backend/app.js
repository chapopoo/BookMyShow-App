const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");//importing userRouter from userRoute.js

const dotenv = require("dotenv");
dotenv.config(); //stores the environment variables from .env file in process.env

app.use(express.json()); //middleware to parse json data in request body, we cant use req.body directly without this middleware

app.use("/api", userRouter);//registering root level route for userRouter


const dbConfig = require("./config/db");

//database connection
dbConfig.connectDB(); 

app.listen(process.env.PORT, () => {
    console.log("backend application has started!")
})