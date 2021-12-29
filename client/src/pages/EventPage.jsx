import React from "react";
import { useParams } from 'react-router-dom';

import Navigationbar from '../components/Navigationbar'
import Footer from '../components/Footer'
import Event from '../components/Event'

function EventPage() {
    const { movieId } = useParams();
    return (
        <div>
            <title>Movie | Cinema Reservation System</title>
            <Navigationbar />
            <Event movieId={movieId} />
            <Footer />
        </div>
    );
}

export default EventPage;