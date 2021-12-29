import React, { useState } from "react";
import axios from "axios";
import moment from 'moment';

function Event(props) {
    const [movieId] = useState(props.movieId)
    const [gotMovie, setGotMovie] = useState(false)
    const [movie, setMovie] = useState(null);

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
                            <p>{movie.description.replace("\n", <br />)}</p>
                            <p>DURATION: {(new Date(movie.endTime)).getHours() - (new Date(movie.startTime)).getHours()}h {(new Date(movie.endTime)).getMinutes() - (new Date(movie.startTime)).getMinutes()}m</p>
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
                                <div className="col-md-3">
                                    <a className="btn btn-ai" href={"/movies/" + movie.id + "/booknow"}>Reserve Now</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : null
            }
        </div>
    );
}

export default Event;