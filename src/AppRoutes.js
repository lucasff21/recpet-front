import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home"; // Importar a Home
import CustomerArea from "./pages/CustomerArea";
import Signup from "./pages/Signup";
import CreateAccount from "./pages/CreateAccount";
import AdminArea from "./pages/AdminPages/AdminArea";
import AddPet from "./pages/AdminPages/AddPet";


const getToken = () => {
    return localStorage.getItem("Tokec_RecSys");
};


const PrivateRoute = ({ element: Element }) => {
    return getToken() ? <Element /> : <Navigate to="/" />; 
};

const AppRoutes = () => (
    <BrowserRouter>
        <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} /> 
            <Route path="/area-cliente" element={<CustomerArea />} />
            <Route path="/criar-conta" element={<CreateAccount />} /> 


            {/* ROTAS PROTEGIDA*/}

            <Route path="/admin-area" element={<PrivateRoute element={AdminArea} />} /> 
            <Route path="/admin-area/adicionar" element={<PrivateRoute element={AddPet} />} /> 

        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
