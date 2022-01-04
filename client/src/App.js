import { BrowserRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';

import Homepage from './pages/Homepage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import BookEventPage from './pages/BookEventPage';
import EventPage from './pages/EventPage';
import AddEventPage from './pages/AddEventPage';
import ManageAccountsPage from './pages/ManageAccountsPage';
import ApproveAccountsPage from './pages/ApproveAccountsPage';

function App() {
  axios.defaults.baseURL = "http://localhost:3000/api";
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movies" element={<Homepage />} />
        <Route path="/sign-up" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/movies/:movieId" element={<EventPage />} />
        <Route path="/addevent" element={<AddEventPage />} />
        <Route path="/movies/:movieId/booknow" element={<BookEventPage />} />
        <Route path="/manageaccounts" element={<ManageAccountsPage />} />
        <Route path="/approveaccounts" element={<ApproveAccountsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
