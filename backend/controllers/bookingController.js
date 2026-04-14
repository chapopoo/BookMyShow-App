const bookingService = require('../services/bookingService');

const makePayment = async (req, res) => {
    try {
        const { token, amount } = req.body;

        const paymentIntent = await bookingService.makePayment({
            token,
            amount
        });

        res.json({
            success: true,
            message: "Payment Successful! Ticket(s) booked!",
            data: paymentIntent
        });

    } catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
};

const bookShow = async (req, res) => {
    try {
        const booking = await bookingService.bookShow(req.body)

        res.send({
            success: true,
            message: "New Bookings are Done",
            data: booking,
        });
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }

}

const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookingService.getAllBookings(req.userId);
        res.json({
            success: true,
            message: "Bookings fetched successfully!",
            data: bookings
        });
    }
    catch (err) {
        res.status(err.statusCode || 500).send({
            success: false,
            message: err.message || "Internal Server Error"
        })
    }
}

module.exports = {
    makePayment,
    bookShow,
    getAllBookings,
}