import React, { useState } from "react";

function Navigationbar() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    if (accessToken !== null && accessToken !== undefined && user.role === "admin")
        window.location.href = "/manageaccounts";

    const signOut = () => {
        localStorage.clear();
        window.location.href = "/";
    }
    return (
        <div className='container-fluid bg-black text-white py-3 text-center'>
            <div className="row">
                <div className="col-md-6">
                </div>
                <div className="col-md-6">
                    <ul className="nav justify-content-end">
                        <li className="nav-item">
                            <a className="nav-link anchor-default" href="/">Events</a>
                        </li>
                        {!accessToken ?
                            <li className="nav-item">
                                <a className="nav-link anchor-default" href="/login">Login</a>
                            </li> : null
                        }
                        {!accessToken ?
                            <li className="nav-item">
                                <a className="nav-link anchor-default" href="/sign-up">Sign up</a>
                            </li> : null
                        }
                        {accessToken ?
                            <li className="nav-item ml-3">
                                <p className="nav-link m-0 text-white">
                                    Welcome {user.firstName + " " + user.lastName}!
                                </p>
                            </li> : null
                        }
                        {accessToken ?
                            <li className="nav-item ml-3">
                                <a className="nav-link m-0 anchor-default" onClick={signOut} role="button">
                                    Sign Out
                                </a>
                            </li> : null
                        }
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Navigationbar;