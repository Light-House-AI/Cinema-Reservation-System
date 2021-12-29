import React, { useState } from "react";
import axios from "axios";

function Login() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));

    if (accessToken !== null)
        window.location.href = "/";

    const submitLogin = () => {
        const data = {
            username: document.getElementById("user-name").value,
            password: document.getElementById("user-password").value
        };

        axios.post('/login', data, {
            headers: {
                "Content-type": "application/json"
            }
        }).then((response) => {
            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            window.location.href = "/";
        }).catch((error) => {
            console.log(error.response)
            if (error.response.status === 400) {
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
        });
    };

    return (
        <div id="log-in" className="container-fluid bg-light">
            <div className="row d-flex justify-content-center my-5">
                <div className="col-md-6 border border-3 rounded px-4 py-5">
                    <h1 className="text-center">Login</h1>
                    <div className="mb-3">
                        <label htmlFor="user-name" className="form-label">Username</label>
                        <input type="text" className="form-control" id="user-name" placeholder="username" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="user-password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="user-password" placeholder="Password" />
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="button" className="btn btn-ai btn-lg mt-2" onClick={submitLogin}>Login</button>
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

export default Login;