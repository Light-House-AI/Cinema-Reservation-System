import React from "react";

import Navigationbar from '../components/Navigationbar'
import Footer from '../components/Footer'
import Login from '../components/Login'

function LoginPage() {
    return (
        <div>
            <title>Login | Cinema Reservation System</title>
            <Navigationbar />
            <Login />
            <Footer />
        </div>
    );
}

export default LoginPage;