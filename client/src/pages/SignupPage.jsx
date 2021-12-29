import React from "react";

import Navigationbar from '../components/Navigationbar'
import Footer from '../components/Footer'
import Signup from '../components/Signup'

function SignupPage() {
    return (
        <div>
            <title>Sign Up | Cinema Reservation System</title>
            <Navigationbar />
            <Signup />
            <Footer />
        </div>
    );
}

export default SignupPage;