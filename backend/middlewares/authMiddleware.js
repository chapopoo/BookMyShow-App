const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    try{
        const token = req.headers.authorization.split(" ")[1]; //Authorization
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        //adding userId to req.body so that it can be accessed in the route handler
        req.userId = verifiedToken.userId;

        next();
    }
    catch(e){
        let message = "Invalid token";

        if (e.name === "TokenExpiredError") {
            message = "Token expired. Please login again";
        }
        res.status(401).send({
            success: false,
            message: "Invalid Token! please try logging in again"
        })
    }
}