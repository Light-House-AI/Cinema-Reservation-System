import React from 'react';

function Footer() {
    return (
        <div className='container-fluid bg-black text-white py-3 text-center'>
            <div className='row'>
                <div className='col-md-6'>
                    <h6 className='text-off-yellow mb-3'>GET IN TOUCH</h6>
                    <ul className='no-bullet p-0 m-0'>
                        <li><a className='anchor-default' href="/">Home</a></li>
                    </ul>
                </div>
                <div className='col-md-6'>
                    <h6 className='text-off-yellow mb-3'>SERVICES</h6>
                    <ul className='no-bullet p-0 m-0'>
                        <li><a className='anchor-default' href="/">Events</a></li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='m-0'>© 2021 Light-House-AI, All Rights Reserved. Developed by Light-House-AI</p>
        </div>
    );
}

export default Footer;