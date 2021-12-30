import React, { useState } from "react";
import axios from "axios";

import './BookEvent.css'

function BookEvent(props) {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [cancelTicketCount, setCancelTicketCount] = useState(0);
    const [movieId] = useState(props.movieId);
    const [gotMovieDetails, setGotMovieDetails] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);

    const [gotTickets, setGotTickets] = useState(false);
    const [tickets, setTickets] = useState(null);

    const [selectedSeats, setSelectedSeats] = useState([]);

    if (gotMovieDetails === false && gotTickets === false) {
        setGotMovieDetails(true);
        setGotTickets(true);

        axios.get("/movies/" + movieId)
            .then((response) => {
                if (document.getElementById("card-expiry")) {
                    document.getElementById("card-expiry").max = (new Date().getFullYear() + 10).toString() + "-12";
                    document.getElementById("card-expiry").min = (new Date().getFullYear()).toString() + "-" + (new Date().getMonth()).toString();
                }
                setMovieDetails(response.data);
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    document.getElementById('modal-title').innerHTML = "ERROR";
                    document.getElementById('error-message').innerHTML = "Movie doesn't exist anymore." + <br /> + "Redirect in 3 seconds.";
                    document.getElementById('open-modal').click();
                    setTimeout(function () {
                        window.location.href = "/";
                    }, 3000);
                }
            });

        if (accessToken) {
            axios.get("/customer/booking", {
                headers: {
                    "Authorization": "Bearer " + accessToken
                }
            }).then((response) => {
                setTickets(response.data.tickets);
                for (let i = 0; i < tickets.length; i++) {
                    if (tickets[i].movieId === movieId) {
                        let ticket = {
                            rowNumber: tickets[i].rowNumber,
                            seatNumber: tickets[i].seatNumber
                        }
                        setSelectedSeats(selectedSeats => [
                            ...selectedSeats,
                            ticket
                        ]);
                    }
                }
            }).catch((error) => {
                console.log(error.response);
            })
        }
    }

    const seatClicked = (e) => {
        // e.currentTarget.id
        if (accessToken === null)
            window.location.href = "/login";

        if (e.currentTarget.className.includes("active")) {
            e.currentTarget.classList.remove("active");
            setSelectedSeats(selectedSeats.filter(seat => seat.row !== e.currentTarget.id.split("-")[0] && seat.seat !== e.currentTarget.id.split("-")[1]));
        } else {
            e.currentTarget.classList.add("active");
            let seat = {
                rowNumber: e.currentTarget.id.split("-")[0],
                seatNumber: e.currentTarget.id.split("-")[1]
            }
            setSelectedSeats(selectedSeats => [
                ...selectedSeats,
                seat
            ]);
        }
    };

    const returnSeats = (rowNumber, numOfSeats) => {
        var seats = []
        for (let i = 1; i <= numOfSeats; i++) {
            // eslint-disable-next-line no-loop-func
            if (tickets != null && tickets.find(ticket => ticket.rowNumber === i && ticket.seatNumber === rowNumber && ticket.movieId === movieId)) {
                seats.push(<div key={i + "-" + rowNumber} id={i + "-" + rowNumber} className="seat active"></div>)
            }
            else if (movieDetails.seats.find(seat => seat.row === i && seat.seat === rowNumber)) {
                seats.push(<div key={i + "-" + rowNumber} id={i + "-" + rowNumber} className="seat disabled"></div>)
            } else {
                seats.push(<div key={i + "-" + rowNumber} id={i + "-" + rowNumber} className="seat" onClick={seatClicked}></div>)
            }
        }
        return seats;
    };

    const returnRows = (numOfRows, numOfSeats) => {
        var leftRows = [];
        var rightRows = [];
        if (movieDetails !== null && gotMovieDetails === true && ((tickets !== null && gotTickets === true) || !accessToken)) {
            for (let i = 1; i <= numOfSeats / 2; i++) {
                leftRows.push(<div className={"cinema-row row-" + i} key={"cinema-row row-" + i}>
                    {returnSeats(i, numOfRows)}
                </div>)
            }
            for (let i = (numOfSeats / 2) + 1; i <= numOfSeats; i++) {
                rightRows.push(<div className={"cinema-row row-" + i} key={"cinema-row row-" + i}>
                    {returnSeats(i, numOfRows)}
                </div>)
            }
            return (
                <div className="theatre">
                    <div className="cinema-seats left">{leftRows}</div>
                    <div className="cinema-seats right">{rightRows}</div>
                </div>
            );
        }
    };

    const openPayment = () => {
        document.getElementById('open-modal-payment').click();
    }

    const confirmSeat = () => {
        console.log(selectedSeats);
        axios.post("/customer/booking/" + movieId, { seats: selectedSeats }, {
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        }).then((response) => {
            document.getElementById('close-payment').click();
            document.getElementById('modal-title').innerHTML = "SUCCESS";
            document.getElementById('error-message').innerHTML = "Redirect to homepage in 1 second.";
            document.getElementById('open-modal').click();
            setTimeout(function () {
                window.location.href = "/";
            }, 1000)
        }).catch((error) => {
            if (error.response.status === 400) {
                document.getElementById('close-payment').click();
                document.getElementById('modal-title').innerHTML = "ERROR";
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
            if (error.response.status === 401) {
                localStorage.clear();
                window.location.href = "/login";
            }
        });
    };

    const cardNumberLimit = (e) => {
        if (e.currentTarget.value > 16)
            e.currentTarget.value = e.currentTarget.value.slice(0, 16);
    }

    const cardCVVLimst = (e) => {
        if (e.currentTarget.value > 3)
            e.currentTarget.value = e.currentTarget.value.slice(0, 3);
    }

    const cancelReservation = () => {
        if (tickets !== null) {
            for (let i = 0; i < tickets.length; i++) {
                let ticket = {
                    rowNumber: tickets[i].rowNumber,
                    seatNumber: tickets[i].seatNumber
                }
                axios.delete("/customer/booking/" + movieId, {
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": "Bearer " + accessToken
                    },
                    data: ticket
                }).then((_response) => {
                    if (i === tickets.length - 1) {
                        document.getElementById('modal-title').innerHTML = "SUCCESS";
                        document.getElementById('error-message').innerHTML = "Redirect to homepage in 3 seconds.";
                        document.getElementById('open-modal').click();
                        setTimeout(function () {
                            window.location.href = "/";
                        }, 3000);
                    }
                }).catch((error) => {
                    console.log(error.response);
                    if (error.response.status === 400) {
                        document.getElementById('modal-title').innerHTML = "ERROR";
                        document.getElementById('error-message').innerHTML = "Cannot cancel seats before 3 hours of starting movie.";
                        document.getElementById('open-modal').click();
                    }
                    if (error.response.status === 401) {
                        localStorage.clear();
                        window.location.href = "/login";
                    }
                })
            }
        }
    }

    return (
        <div id="booking" className="container-fluid bg-light position-relative">
            {movieDetails ?
                <div id="events-title" className="position-relative mb-5 mt-3">
                    <h2 className="pb-2">{movieDetails.title}</h2>
                </div> : null
            }
            <div className="">
                <div className="d-flex justify-content-center align-items-center bg-primary rounded-top w-75 mx-auto mt-5">
                    <h1 className="m-0">SCREEN</h1>
                </div>
                {movieDetails && tickets != null ? returnRows(movieDetails.room.numRows, movieDetails.room.numSeats) : null}
                {movieDetails ? returnRows(movieDetails.room.numRows, movieDetails.room.numSeats) : null}
            </div>
            <button className={accessToken ? "btn btn-ai btn-lg position-absolute top-75 start-65" : "btn btn-ai btn-lg position-absolute top-75 start-65 disabled"} onClick={openPayment}>Confirm Seats</button>
            <button className={accessToken && tickets ? "btn btn-ai-outline btn-lg position-absolute top-75 start-25" : "btn btn-ai-outline btn-lg position-absolute top-75 start-25 disabled"} onClick={cancelReservation}>Cancel Reservation</button>

            <button id='open-modal' type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#error-modal">
            </button>
            <div id="error-modal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 id="modal-title" className="modal-title">ERROR</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div id="error-message" className="modal-body">
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            <button id='open-modal-payment' type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#payement-modal">
            </button>
            <div id="payement-modal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 id="modal-title" className="modal-title">PAYMENT</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-3">
                                        <label htmlFor="card-number" className="form-label">Card Number</label>
                                        <input type="number" className="form-control" id="card-number" placeholder="Card Number" onInput={cardNumberLimit} />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label htmlFor="card-expiry" className="form-label">Expiry Date</label>
                                            <input type="month" className="form-control" id="card-expiry" placeholder="Expiry Date" />
                                        </div>
                                        <div className="col-6">
                                            <label htmlFor="card-cvv" className="form-label">CVC/CVV</label>
                                            <input type="number" className="form-control" id="card-cvv" placeholder="CVC/CVV" onInput={cardCVVLimst} />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="card-name" className="form-label">Cardholder Name</label>
                                        <input type="text" className="form-control" id="card-name" placeholder="Cardholder Name" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button id="close-payment" type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-ai" onClick={confirmSeat}>Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookEvent;