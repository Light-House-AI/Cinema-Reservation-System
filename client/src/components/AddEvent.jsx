import React, { useState } from "react";
import axios from "axios";
import moment from 'moment';

function AddEvent() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [isManager] = useState(accessToken && user.role === "manager" ? true : false);
    const [availableRooms, setAvaliableRooms] = useState(null);
    const [fileSelected, setFileSelected] = useState(null);

    if (!isManager)
        window.location.href = "/";

    const isRoomsAvailable = () => {
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

    const addMovie = () => {
        let movie = {
            title: document.getElementById("movie-title").value,
            description: document.getElementById("movie-description").value,
            startTime: moment(new Date(document.getElementById("movie-start").value)).format(),
            endTime: moment(new Date(document.getElementById("movie-end").value)).format(),
            roomId: document.getElementById("movie-rooms").selectedIndex + 1
        };
        if (fileSelected != null) {
            axios.post("/manager/movies", movie, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": "Bearer " + accessToken
                }
            }).then((response) => {
                let movieId = response.data.movie._id;
                var movieFormData = new FormData();
                movieFormData.append("image", fileSelected)
                axios.patch("/manager/movies/" + movieId + "/image", movieFormData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": "Bearer " + accessToken
                    }
                }).then((response) => {
                    window.location.href = "/movies/" + movieId;
                }).catch((error) => {
                    document.getElementById('error-message').innerHTML = error.response.data.message;
                    document.getElementById('open-modal').click();
                });
            }).catch((error) => {
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            });
        } else {
            document.getElementById('error-message').innerHTML = "Please upload an image.";
            document.getElementById('open-modal').click();
        }
    }
    return (
        <div id="event" className="container-fluid bg-light py-5">
            <div id="events-title" className="position-relative mb-5">
                <h2 className="pb-2">ADD MOVIE</h2>
            </div>
            <div className="row">
                <div className="col-md-5">
                    <input type="file" id="select-poster" accept="image/*" hidden={true} onChange={selectPoster} />
                    <img id="movie-poster" className="img-fluid rounded cursor-pointer" src="http://localhost:3000/images/default.jpg" alt="event" onClick={openInputFile} />
                </div>
                <div className="col-md-7">
                    <div className="mb-3">
                        <label htmlFor="movie-title" className="form-label">TITLE:</label>
                        <input type="text" className="form-control" id="movie-title" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="movie-description" className="form-label">DESCRIPTION:</label>
                        <textarea className="form-control" id="movie-description"></textarea>
                    </div>
                    <p className="fw-bold">NOTE: Start and end dates are duration.</p>
                    <div className="row">
                        <div className="col-6">
                            <div className="mb-3">
                                <label htmlFor="movie-start" className="form-label">Start Date</label>
                                <input type="datetime-local" className="form-control" id="movie-start" placeholder="Start Date" onClick={isRoomsAvailable} />
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="mb-3">
                                <label htmlFor="movie-end" className="form-label">End Date</label>
                                <input type="datetime-local" className="form-control" id="movie-end" placeholder="Start Date" onClick={isRoomsAvailable} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="movie-rooms" className="form-label">Available Rooms:</label>
                        <select className="form-select" id="movie-rooms">
                            {availableRooms && availableRooms.map(roomId => {
                                return (
                                    <option key={roomId} value={roomId}>Room {roomId}</option>
                                );
                            })}
                            {!availableRooms ? <option disabled={true}>No Rooms Available</option> : null}
                        </select>
                    </div>
                    <div className="float-end">
                        <button className="btn btn-ai btn-lg" onClick={addMovie}>Add Event</button>
                    </div>
                </div>
            </div>
            <button id='open-modal' type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#error-modal">
            </button>
            <div id="error-modal" className="modal" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Error</h5>
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

export default AddEvent;