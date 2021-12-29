import React from "react";
import { useParams } from 'react-router-dom';

import Navigationbar from "../components/Navigationbar";
import Footer from "../components/Footer";
import BookEvent from "../components/BookEvent";

function BookEventPage() {
    const { movieId } = useParams();
    return (
        <div>
            <title>Book a seat | Cinema Reservation System</title>
            <Navigationbar />
            <BookEvent movieId={movieId} />
            <Footer />
        </div>
    );
}

export default BookEventPage;