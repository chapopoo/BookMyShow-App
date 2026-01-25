const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config(); //stores the environment variables from .env file in process.env

app.listen(process.env.PORT, () => {
    console.log("backend application has started!")
})