import React from "react";

import Navigationbar from '../components/Navigationbar'
import Footer from '../components/Footer'
import AddEvent from '../components/AddEvent'

function AddEventPage() {
    return (
        <div>
            <title>Movie | Cinema Reservation System</title>
            <Navigationbar />
            <AddEvent />
            <Footer />
        </div>
    );
}

export default AddEventPage;