const express = require("express");
const app = express();
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showRouter = require("./routes/showRoute");

const dotenv = require("dotenv");
dotenv.config(); //stores the environment variables from .env file in process.env
const bookingRouter = require("./routes/bookingRoute");
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")

//CORS configuration
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(helmet())
app.use(express.json()); //middleware to parse json data in request body, we cant use req.body directly without this middleware

// Rate limiter middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes in ms
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

app.use("/api/", apiLimiter)

app.use("/api/user", userRouter);//registering root level route for userRouter
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showRouter);
app.use("/api/bookings", bookingRouter);

const dbConfig = require("./config/db");

//database connection
dbConfig.connectDB(); 

app.listen(process.env.PORT, () => {
    console.log("backend application has started!")
})