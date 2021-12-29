import React, { useState } from "react";
import axios from "axios";

import './BookEvent.css'

function BookEvent(props) {
    const [accessToken] = useState(localStorage.getItem("accessToken"));

    const [movieId] = useState(props.movieId);
    const [gotMovieDetails, setGotMovieDetails] = useState(false);
    const [movieDetails, setMovieDetails] = useState(null);

    const [selectedSeats, setSelectedSeats] = useState([]);

    if (gotMovieDetails === false) {
        setGotMovieDetails(true);
        axios.get("/movies/" + movieId)
            .then((response) => {
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
    }

    const seatClicked = (e) => {
        // e.currentTarget.id
        if (accessToken === null)
            window.location.href = "/login";

        if (e.currentTarget.className.includes("active")) {
            e.currentTarget.classList.remove("active");
            setSelectedSeats(selectedSeats.filter(seat => seat.row !== e.currentTarget.id.split("-")[1] && seat.seat !== e.currentTarget.id.split("-")[0]));
        } else {
            e.currentTarget.classList.add("active");
            debugger;
            let seat = {
                rowNumber: e.currentTarget.id.split("-")[1],
                seatNumber: e.currentTarget.id.split("-")[0]
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
            if (movieDetails.seats.find(seat => seat.row === rowNumber && seat.seat === i)) {
                seats.push(<div key={rowNumber + "-" + i} id={rowNumber + "-" + i} className="seat disabled"></div>)

            } else {
                seats.push(<div key={rowNumber + "-" + i} id={rowNumber + "-" + i} className="seat" onClick={seatClicked}></div>)
            }
        }
        return seats;
    };

    const returnRows = (numOfRows, numOfSeats) => {
        var leftRows = [];
        var rightRows = [];
        if (movieDetails !== null && gotMovieDetails === true) {
            for (let i = 1; i <= numOfRows; i++) {
                leftRows.push(<div className={"cinema-row row-" + i} key={"cinema-row row-" + i}>
                    {returnSeats(i, numOfSeats / 2)}
                </div>)
            }
            for (let i = numOfRows + 1; i <= numOfRows * 2; i++) {
                rightRows.push(<div className={"cinema-row row-" + i} key={"cinema-row row-" + i}>
                    {returnSeats(i, numOfSeats / 2)}
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

    const confirmSeat = () => {
        console.log(selectedSeats);
        axios.post("/customer/booking/" + movieId, selectedSeats, {
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        }).then((response) => {
            document.getElementById('modal-title').innerHTML = "SUCCESS";
            document.getElementById('error-message').innerHTML = response.data.message + <br /> + <br /> + "Redirect to homepage in 1 second.";
            document.getElementById('open-modal').click();
            setTimeout(function () {
                window.location.href = "/";
            }, 1000)
        }).catch((error) => {
            if (error.response.status === 400) {
                document.getElementById('modal-title').innerHTML = "ERROR";
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
        });
    };

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
                {movieDetails ? returnRows(movieDetails.room.numRows, movieDetails.room.numSeats) : null}
            </div>
            <button className={accessToken ? "btn btn-ai btn-lg position-absolute top-75 start-50 translate-middle" : "btn btn-ai btn-lg position-absolute top-75 start-50 translate-middle disabled"} onClick={confirmSeat}>Confirm Seats</button>

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
                        <div id="error-message" className="modal-body">
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookEvent;