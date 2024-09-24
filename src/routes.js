import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; 
import CustomerArea from "./pages/CustomerArea";
import Signup from "./pages/Signup";


const getToken = () => {
    return localStorage.getItem("Tokec_RecSys");
};

const PrivateRoute = ({ element: Element }) => {
    return getToken() ? <Element /> : <Navigate to="/" />;
  };


const Routes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/area-cliente" element={<PrivateRoute element={CustomerArea} />} />
            <Route path="/signup" element={<PrivateRoute element={Signup} />} />
        </Routes>
    </BrowserRouter>
)

export default Routes;