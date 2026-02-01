const express = require("express");
const app = express();
const userRouter = require("./routes/userRoute");//importing userRouter from userRoute.js
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config(); //stores the environment variables from .env file in process.env

//CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); //middleware to parse json data in request body, we cant use req.body directly without this middleware

app.use("/api/user", userRouter);//registering root level route for userRouter


const dbConfig = require("./config/db");

//database connection
dbConfig.connectDB(); 

app.listen(process.env.PORT, () => {
    console.log("backend application has started!")
})