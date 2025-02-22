import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home"; // Importar a Home


import AdminArea from "./pages/AdminPages/AdminArea";
import AddPet from "./pages/AdminPages/AddPet";
import { AuthContext } from "./contexts/AuthContext"; // Importar o contexto de autenticação
import CustomerArea from "./pages/UserPages/CustomerArea";
import CreateAccount from "./pages/UserPages/CreateAccount";
import QuestionarioAdotante from "./pages/UserPages/QuestionarioAdotante";
import AdocaoArea from "./pages/AdminPages/AdocaoArea";


const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useContext(AuthContext); // Usar contexto para verificar autenticação
    
    return isAuthenticated ? <Element /> : <Navigate to="/" />; // Verificar a autenticação com o context
};

const AppRoutes = () => (
    <BrowserRouter>
        <Routes> 
            <Route path="/" element={<Home />} />
            <Route path="/area-cliente" element={<CustomerArea />} />
            <Route path="/criar-conta-admin" element={<CreateAccount />} /> 
            <Route path="/criar-conta-adotante" element={<CreateAccount />} /> 
            <Route path="/questionario-adotante" element={<QuestionarioAdotante />} />


            {/* ROTAS PROTEGIDA*/}

            <Route path="/admin-area" element={<PrivateRoute element={AdminArea} />} /> 
            <Route path="/admin-area/adicionar" element={<PrivateRoute element={AddPet} />} /> 
            <Route path="/admin-area/area-adocao" element={<PrivateRoute element={AdocaoArea} />} /> 

        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
