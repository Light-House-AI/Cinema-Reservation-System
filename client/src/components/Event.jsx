import React, { useState } from "react";
import axios from "axios";
import moment from 'moment';

function Event(props) {
    const [movieId] = useState(props.movieId)
    const [gotMovie, setGotMovie] = useState(false)
    const [movie, setMovie] = useState(null);

    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [isManager] = useState(accessToken && user.role === "manager" ? true : false);
    const [availableRooms, setAvaliableRooms] = useState(null);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [fileSelected, setFileSelected] = useState(null);

    if (gotMovie === false) {
        setGotMovie(true);
        axios.get("/movies/" + movieId)
            .then((response) => {
                setMovie(response.data);
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const isRoomsAvailable = () => {
        if (isManager && availableRooms === null) {
            if (document.getElementById("movie-start") && document.getElementById("movie-end")) {
                let startDate = document.getElementById("movie-start").value;
                let endDate = document.getElementById("movie-end").value;
                let url = "/manager/movies/free-rooms?startTime=" + startDate + "&endTime=" + endDate;
                if (startDate != null && endDate != null && startDate !== "" && endDate !== "") {
                    axios.get(url, {
                        headers: {
                            "Authorization": "Bearer " + accessToken
                        }
                    }).then((response) => {
                        setAvaliableRooms(response.data.freeRooms);
                    });
                }
            }
        }
    }

    if (isManager && availableRooms == null && currentRoom == null && movie) {
        setTimeout(function () { isRoomsAvailable(); }, 500);
        setCurrentRoom(movie.room.numRows === 2 ? 1 : 2);
        // setTimeout(function () {
        //     if (document.getElementById("movie-rooms") && currentRoomAppended === false) {
        //         setCurrentRoomAppended(true);
        //         let currentRoomNo = movie.room.numRows === 2 ? 1 : 2;
        //         let newOption = document.createElement('option');
        //         newOption.value = currentRoomNo;
        //         newOption.innerText = "Room " + currentRoomNo;
        //         document.getElementById("movie-rooms").appendChild(newOption);
        //     }
        // }, 500);
    }


    const openInputFile = () => {
        document.getElementById("select-poster").click();
    }

    const selectPoster = (e) => {
        console.log(e.target.files);
        if (e.target.files && e.target.files.length) {
            let url = URL.createObjectURL(e.target.files[0]);
            document.getElementById("movie-poster").src = url;
            setFileSelected(e.target.files[0]);
        }
    }

    const updateEvent = () => {
        let movie = {
            title: document.getElementById("movie-title").value,
            description: document.getElementById("movie-description").value,
            startTime: document.getElementById("movie-start").value,
            endTime: document.getElementById("movie-end").value,
            roomId: document.getElementById("movie-rooms").selectedOptions[0].value
        };
        axios.patch("/manager/movies/" + movieId, movie, {
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + accessToken
            }
        }).then((response) => {
            if (fileSelected != null) {
                var movieFormData = new FormData();
                movieFormData.append("image", fileSelected)
                axios.patch("/manager/movies/" + movieId + "/image", movieFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": "Bearer " + accessToken
                    }
                }).then((response) => {
                    document.getElementById('modal-title').innerHTML = "SUCCESS";
                    document.getElementById('error-message').innerHTML = "Redirect to homepage in 1 second.";
                    document.getElementById('open-modal').click();
                    setTimeout(function () { window.location.href = "/"; }, 1000);
                }).catch((error) => {
                    document.getElementById('error-message').innerHTML = error.response.data.message + <br /> + "While uploading image.";
                    document.getElementById('open-modal').click();
                });
            } else {
                document.getElementById('modal-title').innerHTML = "SUCCESS";
                document.getElementById('error-message').innerHTML = "Redirect to homepage in 1 second.";
                document.getElementById('open-modal').click();
                setTimeout(function () { window.location.href = "/"; }, 1000);
            }
        }).catch((error) => {
            console.log(error)
            if (error.response.status === 400) {
                document.getElementById('modal-title').innerHTML = "ERROR";
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
        });
    }
    return (
        <div id="event" className="container-fluid bg-light py-5">
            {movie ?
                <div>
                    <div id="events-title" className="position-relative mb-5">
                        <h2 className="pb-2">{movie.title}</h2>
                    </div>
                    <div className="row">
                        {!isManager ?
                            <div className="col-md-5">
                                <img className="img-fluid rounded" src={"http://localhost:3000/" + movie.image} alt="event" />
                            </div> : null
                        }
                        {isManager ?
                            <div className="col-md-5">
                                <input type="file" id="select-poster" accept="image/*" hidden={true} onChange={selectPoster} />
                                <img id="movie-poster" className="img-fluid rounded cursor-pointer" src={"http://localhost:3000/" + movie.image} alt="event" onClick={openInputFile} />
                            </div> : null
                        }
                        <div className="col-md-7">
                            {isManager ?
                                <div className="mb-3">
                                    <label htmlFor="movie-title" className="form-label">TITLE:</label>
                                    <input type="text" className="form-control" id="movie-title" defaultValue={movie.title} />
                                </div> : null
                            }
                            {!isManager ?
                                <p>{movie.description.replace("\n", <br />)}</p> : null
                            }
                            {isManager ?
                                <div className="mb-3">
                                    <label htmlFor="movie-description" className="form-label">DESCRIPTION:</label>
                                    <textarea className="form-control" id="movie-description" rows="3" defaultValue={movie.description}></textarea>
                                </div> : null
                            }
                            {!isManager ?
                                <p>DURATION: {(new Date(movie.endTime)).getHours() - (new Date(movie.startTime)).getHours()}h {(new Date(movie.endTime)).getMinutes() - (new Date(movie.startTime)).getMinutes()}m</p> : null
                            }
                            {isManager ?
                                <p className="fw-bold">NOTE: Start and end dates are duration.</p> : null
                            }
                            {isManager ?
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="movie-start" className="form-label">Start Date</label>
                                            <input type="datetime-local" className="form-control" id="movie-start" placeholder="Start Date" defaultValue={new Date(movie.startTime).toISOString().slice(0, 16)} />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="movie-end" className="form-label">End Date</label>
                                            <input type="datetime-local" className="form-control" id="movie-end" placeholder="Start Date" defaultValue={new Date(movie.endTime).toISOString().slice(0, 16)} />
                                        </div>
                                    </div>
                                </div> : null
                            }
                            {isManager ?
                                <p className="fw-bold">Current Room: {currentRoom}</p> : null
                            }
                            {isManager ?
                                <div className="mb-3">
                                    <label htmlFor="movie-rooms" className="form-label">Available Rooms:</label>
                                    <select className="form-select" id="movie-rooms" defaultValue={movie.room.numRows === 2 ? 1 : 2}>
                                        <option value={movie.room.numRows === 2 ? 1 : 2}>Room {movie.room.numRows === 2 ? 1 : 2}</option>
                                        {availableRooms && availableRooms.map(roomId => {
                                            return (
                                                <option key={roomId} value={roomId}>Room {roomId}</option>
                                            );
                                        })}
                                        {!availableRooms ? <option disabled={true}>No Rooms Available</option> : null}
                                    </select>
                                </div> : null
                            }
                            {!isManager ?
                                <div id="events-title" className="position-relative mb-5">
                                    <h2 className="pb-2">VIEWING TIME</h2>
                                </div> : null
                            }
                            {isManager ?
                                <div id="events-title" className="position-relative mb-2">
                                    <h2 className="pb-2">CURRENT VIEWING TIME</h2>
                                </div> : null
                            }
                            <div className="row">
                                <div className="col-md-6">
                                    <p className="m-0 px-2 py-3">
                                        {moment(new Date("2022-01-02T14:45:00.000Z").toISOString().slice(0, 16)).format("hh:mm A DD MMM YYYY")}
                                    </p>
                                </div>
                                {!isManager ?
                                    <div className="col-md-6 d-flex align-items-center justify-content-end">
                                        <a className="btn btn-ai" href={"/movies/" + movie.id + "/booknow"}>Reserve Now</a>
                                    </div> : null
                                }
                                {isManager ?
                                    <div className="col-md-6 d-flex align-items-center justify-content-end">
                                        <p className="m-0 text-end">
                                            Total Seats: {movie.room.numRows * movie.room.numSeats}
                                            <br />
                                            Reserved Seats: {movie.seats.length}
                                        </p>
                                    </div> : null
                                }
                            </div>
                            <div className="float-end mt-3">
                                <button className="btn btn-ai btn-lg" onClick={updateEvent}>Update Event</button>
                            </div>
                        </div>
                    </div >
                </div > : null
            }
            <button id='open-modal' type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#error-modal">
            </button>
            <div id="error-modal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 id="modal-title" className="modal-title">Error</h5>
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
        </div >
    );
}

export default Event;