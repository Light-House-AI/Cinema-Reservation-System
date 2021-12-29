import React, { useState } from "react";
import axios from 'axios';

function Signup() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));

    if (accessToken !== null)
        window.location.href = "/";

    const submitSignup = () => {
        const data = {
            username: document.getElementById("user-name").value,
            password: document.getElementById("user-password").value,
            firstName: document.getElementById("user-first").value,
            lastName: document.getElementById("user-last").value,
            email: document.getElementById("user-email").value,
            role: document.getElementById("user-role").checked ? "manager" : "customer"
        };

        axios.post('/signup', data, {
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => {
            window.location.href = "/login";
        }).catch((error) => {
            console.log(error.response)
            if (error.response.status === 400) {
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
        });
    };

    return (
        <div id="sign-up" className="container-fluid bg-light">
            <div className="row d-flex justify-content-center my-5">
                <div className="col-md-6 border border-3 rounded px-4 py-5">
                    <h1 className="text-center">Sign Up</h1>
                    <div className="mb-3">
                        <label htmlFor="user-name" className="form-label">Username</label>
                        <input type="text" className="form-control" id="user-name" placeholder="username" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="user-password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="user-password" placeholder="Password" />
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="user-first" className="form-label">First Name</label>
                                <input type="text" className="form-control" id="user-first" placeholder="First name" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="user-last" className="form-label">Last Name</label>
                                <input type="text" className="form-control" id="user-last" placeholder="Last name" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="user-email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="user-email" placeholder="name@example.com" />
                    </div>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="user-role" />
                        <label className="form-check-label" htmlFor="user-role">Are you a manager?</label>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-ai btn-lg mt-2" onClick={submitSignup}>Sign Up</button>
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

export default Signup;