import React, {useContext} from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home";

import AdminArea from "./pages/AdminPages/AdminArea";
import { AuthContext } from "./contexts/AuthContext";
import CustomerArea from "./pages/UserPages/CustomerArea";
import CreateAccount from "./pages/UserPages/CreateAccount";
import QuestionarioAdotante from "./pages/UserPages/QuestionarioAdotante";


const PrivateRoute = ({ element: Element }) => {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? <Element /> : <Navigate to="/" />;
};

const AdminRoute = ({ element: Element }) => {
    const { isAuthenticated, role, loading } = useContext(AuthContext);

    if (!loading) {
        return isAuthenticated && role === "ADMIN" ? <Element /> : <Navigate to="/" />;
    }
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

            {/* ROTAS PROTEGIDA ADMIN*/}
            <Route path="/admin-area/*" element={<AdminRoute element={AdminArea} />}/>
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
