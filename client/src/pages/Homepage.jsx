import React from 'react';

import Navigationbar from '../components/Navigationbar'
import Footer from '../components/Footer'
import Events from '../components/Events';

function Homepage() {
    return (
        <div>
            <title>Homepage | Cinema Reservation System</title>
            <Navigationbar />
            <Events />
            <Footer />
        </div>
    );
}

export default Homepage;