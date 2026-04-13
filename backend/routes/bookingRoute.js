const bookingRouter = require('express').Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const authMiddleware = require('../middlewares/authMiddleware');
const Booking = require('../model/bookingModel');
const Show = require('../model/showModel');
const UserModel = require('../model/userModel');
const emailHelper = require("../config/emailHelper")
const {makePayment, bookShow} = require("../controllers/bookingController")

//console.log('Stripe Key:', process.env.STRIPE_KEY); 

bookingRouter.post('/make-payment', authMiddleware, makePayment);

// Create a booking after the payment
bookingRouter.post('/book-show', authMiddleware, bookShow);


bookingRouter.get("/get-all-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.userId })
            .populate("user")
            .populate({
                path: "show",
                populate: [
                    { path: "movie", model: "movies" },
                    { path: "theatre", model: "theatres" }
                ]
            });

        res.send({
            success: true,
            message: "Bookings fetched!",
            data: bookings
        })

    } catch (err) {
        res.send({
            success: false,
            message: err.message
        })
    }
});



module.exports = bookingRouter;
