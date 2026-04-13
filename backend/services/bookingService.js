const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_KEY);
const Booking = require('../model/bookingModel');
const Show = require('../model/showModel');
const UserModel = require('../model/userModel');
const emailHelper = require("../config/emailHelper")
const AppError = require("../utils/AppError");

const makePayment = async ({ token, amount }) => {
    const customers = await stripe.customers.list({
        email: token.email,
        limit: 1
    });

    let customer;

    if (customers.data.length > 0) {
        customer = customers.data[0];
    } else {
        customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
    }
    //     // This is what confirms that stripe has charged the card
    //     // which the user has provided from frontend

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'usd',
        payment_method_types: ['card'],
        customer: customer.id,
        receipt_email: token.email,
        description: "Token has been assigned to the movie!"
    });

    const transactionId = paymentIntent.id;
    return transactionId;
}

const bookShow = async (bookingData) => {
    console.log("Booking data received:", bookingData);
    const show = await Show.findById(bookingData.show);

    if (!show) {
        throw new AppError("Show not found", 404);
    }

    // Check if seats already booked
    const isSeatTaken = bookingData.seats.some(seat =>
        show.bookedSeats.includes(seat)
    );

    if (isSeatTaken) {
        throw new AppError("Some seats are already booked", 400);
    }

    // Create booking
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // Update seats
    const updatedBookedSeats = [...show.bookedSeats, ...bookingData.seats];

    await Show.findByIdAndUpdate(bookingData.show, {
        bookedSeats: updatedBookedSeats
    });

    const user = await UserModel.findById(newBooking.user)

    console.log({ user })

    await emailHelper("ticket.html", user.email, {
        name: user.name,
        movie: show.movie.movieName,
        theatre: show.theatre.name,
        date: show.date,
        time: show.time,
        seats: newBooking.seats,
        amount: newBooking.seats.length * show.ticketPrice,
        transactionId: newBooking.transactionId,
    });

    console.log("Email sent")

    return newBooking;
};

// getAllBookings = async (userId) => {
//     const bookings = await Booking.find({ user: userId })
//         .populate("user")
//         .populate({
//             path: "show",
//             populate: [
//                 { path: "movie" },
//                 { path: "theatre" }
//             ]
//         });

//     return bookings;
// };

module.exports = {
    makePayment,
    bookShow,
}