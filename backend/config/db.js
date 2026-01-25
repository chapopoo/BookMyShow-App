const mongoose = require("mongoose")
const {DB_URL} = process.env

const connectDB = async () => mongoose.connect(DB_URL).then(() => {
    console.log("Database connected successfully")
}).catch((error) =>{
    console.log(error)
    process.exit(1)
})

module.exports = {connectDB}