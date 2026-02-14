const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");

const dotenv = require("dotenv");
dotenv.config(); //stores the environment variables from .env file in process.env

//CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json()); //middleware to parse json data in request body, we cant use req.body directly without this middleware

app.use("/api/user", userRouter);//registering root level route for userRouter
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);

const dbConfig = require("./config/db");

//database connection
dbConfig.connectDB(); 

app.listen(process.env.PORT, () => {
    console.log("backend application has started!")
})