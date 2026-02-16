/**
 * Stripe Payment Integration Fix
 *
 * Problem:
 *   - The previous implementation used 'react-stripe-checkout', which is not compatible with Vite/ESM projects.
 *   - This caused build errors like "Could not resolve 'react'" and "Could not resolve 'prop-types'" because 'react-stripe-checkout' uses CommonJS (require) imports.
 *
 * Solution:
 *   1. Uninstalled 'react-stripe-checkout'.
 *   2. Installed '@stripe/react-stripe-js' and '@stripe/stripe-js', which are compatible with Vite and React.
 *   3. Replaced the <StripeCheckout> component with <Elements> and <CardElement> from Stripe's official React SDK.
 *   4. Updated the payment handler to use Stripe's createPaymentMethod API.
 *
 * Result:
 *   - The payment form is now secure, modern, and works with Vite and React.
 */

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { message, Card, Row, Col, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { getShowById } from "../api/shows";
import moment from "moment";
import { bookShow, makePayment } from "../api/bookings";
import {loadStripe} from '@stripe/stripe-js';
import {Elements, useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

const STRIPE_PUB_KEY = "pk_test_51T1Ob1DnZOBgyuOcU4XkNDXHsYmpEUZpq4KlPgXro9bXA31OVRZwfdOp54Xb24TD74P0q53l0WoHjjFuOkGc0kEp00nEaTDB7m"

const stripePromise = loadStripe(STRIPE_PUB_KEY);

const BookShow = () => {
    const { user } = useSelector(state => state.users);
    const dispatch = useDispatch();

    const [show, setShow] = useState();

    const [selectedSeats, setSelectedSeats] = useState([]);

    const params = useParams();
    const navigate = useNavigate();

    const getData = async () => {
        try {
            dispatch(showLoading());
            const response = await getShowById({ showID: params.id });

            if (response.success) {
                setShow(response.data);
                console.log(response.data);
            }
            else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        }
        catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    }

    const book = async (transactionId) => {
        try {
            dispatch(showLoading());
            const response = await bookShow({
                show: params.id,
                transactionId,
                seats: selectedSeats,
                user: user._id,
            })

            if (response.success) {
                message.success("Show Booking done!");
                navigate("/");
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        }
        catch (err) {
            message.error(err.message);
            dispatch(hideLoading());
        }
    }

    // Stripe payment handler
    const StripePaymentForm = () => {
        const stripe = useStripe();
        const elements = useElements();

        const handleSubmit = async (event) => {
            event.preventDefault();
            if (!stripe || !elements) return;
            dispatch(showLoading());
            const cardElement = elements.getElement(CardElement);
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });
            if (error) {
                message.error(error.message);
                dispatch(hideLoading());
                return;
            }
            const response = await makePayment(
                paymentMethod.id,
                selectedSeats.length * show.ticketPrice * 100
            );
            if (response.success) {
                message.success(response.message);
                book(response.data);
            } else {
                message.error(response.message);
            }
            dispatch(hideLoading());
        };
        return (
            <form onSubmit={handleSubmit} style={{maxWidth: 400, margin: '0 auto'}}>
                <CardElement options={{hidePostalCode: true}} style={{marginBottom: 16}}/>
                <Button type="primary" shape="round" size="large" block htmlType="submit" disabled={!stripe} style={{marginTop: 16}}>
                    Pay Now
                </Button>
            </form>
        );
    };

    const getSeats = () => {
        let columns = 12

        let totalSeats = 120
        let rows = totalSeats / columns;

        return (
            <div className="d-flex flex-column align-items-center">
                <div className="w-100 max-width-600 mx-auto mb-25px">
                    <p className="text-center mb-10px">Screen this side, you will be watching in this direction</p>
                    <div className="screen-div">
                    </div>
                </div>
                <ul className="seat-ul justify-content-center">
                    {Array.from(Array(rows).keys()).map((row) => {
                        return (Array.from(Array(columns).keys()).map((column) => {

                            // First row and third column
                            // seatNumber = 0 * 12 + 2 + 1 = 3

                            // Second row and third column
                            // seatNumber = 1 * 12 + 2 + 1 = 15
                            let seatNumber = row * columns + column + 1;

                            let seatClass = "seat-btn";
                            // Selected seats are currently selected seats in frontend
                            // They are NOT booked yet
                            if (selectedSeats.includes(seatNumber)) {
                                seatClass += " selected"
                            }

                            // Booked seats are coming from server 
                            // They are seats which are previously booked for this show
                            if (show.bookedSeats.includes(seatNumber)) {
                                seatClass += " booked"
                            }


                            // We have to ensure that the seatnumber is only until the total seats in the show
                            if (seatNumber <= totalSeats)
                                return (
                                    <li><button className={seatClass} onClick={() => {
                                        if (selectedSeats.includes(seatNumber)) {
                                            setSelectedSeats(selectedSeats.filter((curSeatNumber => curSeatNumber !== seatNumber)))
                                        } else {
                                            setSelectedSeats([...selectedSeats, seatNumber]);
                                        }
                                    }}>{seatNumber}</button></li>
                                )
                        })
                        )
                    })}
                </ul>

                <div className="d-flex bottom-card justify-content-between w-100 max-width-600 mx-auto mb-25px mt-3">
                    <div className="flex-1">Selected Seats: <span>{selectedSeats.join(", ")}</span></div>
                    <div className="flex-shrink-0 ms-3">Total Price: <span>Rs. {selectedSeats.length * show.ticketPrice}</span></div>
                </div>
            </div>
        )
    }

    
    useEffect(() => {
        getData();
    }, [])

    return (<>

        {show && <Row gutter={24}>
            <Col span={24}>

                <Card
                    title={<div className="movie-title-details">
                        <h1>{show.movie.movieName}</h1>
                        <p>Theatre: {show.theatre.name}, {show.theatre.address}</p>
                    </div>}
                    extra={<div className="show-name py-3">
                        <h3><span>Show Name:</span> {show.name}</h3>
                        <h3><span>Date & Time: </span>{moment(show.date).format("MMM Do YYYY")} at {moment(show.time, "HH:mm").format("hh:mm A")}</h3>
                        <h3><span>Ticket Price:</span> Rs. {show.ticketPrice}/-</h3>
                        <h3><span>Total Seats:</span> {show.totalSeats}<span> &nbsp;|&nbsp; Available Seats:</span> {show.totalSeats - show.bookedSeats.length}  </h3>
                    </div>}
                    style={{ width: "100%" }}
                >
                    {getSeats()}


                    {selectedSeats.length > 0 && (
                        <Elements stripe={stripePromise}>
                            <StripePaymentForm />
                        </Elements>
                    )}
                </Card>
            </Col>
        </Row>}


    </>)
}
export default BookShow;