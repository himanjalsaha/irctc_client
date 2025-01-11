import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Signup from "./pages/auth/Signup";
import BookTrain from "./pages/BookTrain";
import { useAuth } from "./context/authcontext";

import Booking from "./pages/booking";
import React from "react";
import NavBar from "./components/Navbar";



const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth(); 

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
  <NavBar/>
    {children}
    </>
  )
};



export default function App() {


  return (
    <BrowserRouter>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking/:train_id" element={<PrivateRoute><BookTrain /></PrivateRoute>} />
        <Route path="/bookings/users/:user_id" element={<PrivateRoute><Booking /></PrivateRoute>} />
        
      </Routes>
    </BrowserRouter>
  );
}
