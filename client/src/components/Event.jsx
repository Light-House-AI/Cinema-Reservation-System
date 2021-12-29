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

    if (gotMovie === false) {
        setGotMovie(true);
        axios.get("/movies/" + movieId)
            .then((response) => {
                setMovie(response.data);
            })
            .catch((error) => {
                console.log(error);
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
                        <div className="col-md-5">
                            <img className="img-fluid rounded" src={"http://localhost:3000/" + movie.image} alt="event" />
                        </div>
                        <div className="col-md-7">
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
                                            <input type="datetime-local" className="form-control" id="movie-start" placeholder="Start Date" />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="movie-end" className="form-label">End Date</label>
                                            <input type="datetime-local" className="form-control" id="movie-end" placeholder="Start Date" />
                                        </div>
                                    </div>
                                </div> : null
                            }
                            <br />
                            <br />
                            <div id="events-title" className="position-relative mb-5">
                                <h2 className="pb-2">VIEWING TIME</h2>
                            </div>
                            <div className="row">
                                <div className="col-md-9">
                                    <p className="m-0 px-2 py-3">
                                        {moment(new Date(movie.startTime)).format("hh:mm A DD MMM YYYY")}
                                    </p>
                                </div>
                                <div className="col-md-3 d-flex align-items-center">
                                    <a className="btn btn-ai" href={"/movies/" + movie.id + "/booknow"}>Reserve Now</a>
                                </div>
                            </div>
                        </div>
                    </div >
                </div > : null
            }
        </div >
    );
}

export default Event;