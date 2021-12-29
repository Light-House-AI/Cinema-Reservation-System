import React, { useState } from "react";
import axios from "axios";

function ManageAccounts() {
    const [accessToken] = useState(localStorage.getItem("accessToken"));
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    if (accessToken === null || accessToken === undefined || user.role !== "admin")
        window.location.href = "/login";

    const [gotExistingAccounts, setGotExistingAccounts] = useState(false);
    const [existingAccounts, setExistingAccounts] = useState([]);

    if (gotExistingAccounts === false) {
        setGotExistingAccounts(true);
        axios.get("/admin/users", {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).then((response) => {
            setExistingAccounts(response.data.users);
        }).catch((error) => {
            console.log(error.response)
        });
    }

    const giveAccess = (e) => {
        let userId = e.currentTarget.id;
        axios.delete("/admin/users/" + userId, {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        }).then((response) => {
            window.location.reload();
        }).catch((error) => {
            if (error.response.status === 404) {
                document.getElementById('error-message').innerHTML = error.response.data.message;
                document.getElementById('open-modal').click();
            }
        });
    };

    const signOut = () => {
        localStorage.clear();
        window.location.href = "/";
    }

    return (
        <div id="manage-accounts" className="container fluid my-4 position-relative">
            <ul className="nav nav-tabs">
                <li className="nav-item">
                    <a className="nav-link anchor-default-2" aria-current="page" href="/approveaccounts">Requests</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link active" aria-current="page" href="/manageaccounts">Existing Managers</a>
                </li>
            </ul>
            <button className="btn btn-ai anchor-default-2 m-0 position-absolute end-0 top-0" onClick={signOut}>
                Sign Out
            </button>
            <div className="row mt-3">
                <div className="col-md-12">
                    <div className="row">
                        <div className="col-6 border-bottom">
                            <h4>Email Address</h4>
                        </div>
                        <div className="col-6 border-bottom">
                            <h4>Action</h4>
                        </div>
                    </div>
                    {existingAccounts.map((account) => {
                        return (
                            <div className="row mt-1" key={account._id}>
                                <div className="col-6 border-bottom pb-1 d-flex align-items-center">
                                    <p className="m-0">{account.email} ({account.firstName + " " + account.lastName})</p>
                                </div>
                                <div className="col-6 border-bottom pb-1">
                                    <button className="btn btn-ai" id={account._id} onClick={giveAccess}>Delete User</button>
                                </div>
                            </div>
                        );
                    })}
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

export default ManageAccounts;