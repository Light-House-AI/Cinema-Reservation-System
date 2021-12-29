import React, { useState } from "react";
import axios from 'axios';

function Events() {
    const [gotMovies, setGotMovies] = useState(false)
    const [movies, setMovies] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    if (gotMovies === false) {
        setGotMovies(true);
        axios.get('/movies')
            .then((response) => {
                console.log(response.data);
                setMovies(response.data.movies)
                console.log(movies)
            })
            .catch((error) => {
                console.log("ERROR: " + error)
            });
    }
    return (
        <div id="events" className="container-fluid bg-light py-5">
            <div id="events-title" className="position-relative mb-5">
                {user !== null & user !== undefined && user.role === "manager" ?
                    <a className="btn btn-ai float-end" href="/addevent">ADD EVENT</a> : null
                }
                <h2 className="pb-2">Events</h2>
            </div>
            <div className="row">
                {movies.map(movie => {
                    return (
                        <div className="col-md-4 text-center" key={movie._id}>
                            <a className="anchor-default-2 m-0" href={"/" + movie.id}>
                                <p className="h5 mb-3">{movie.title}</p>
                            </a>
                            <a href={"/movies/" + movie.id}>
                                <img className="img-fluid" src={"http://localhost:3000/" + movie.image} alt="event" />
                            </a>
                            <a className="btn btn-ai mt-3" href={"/" + movie.id}>
                                More Details
                            </a>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Events;