import React, {useContext} from "react";
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from "./pages/Home";

import AdminArea from "./pages/Admin/AdminArea";
import { AuthContext } from "./contexts/AuthContext";
import Login from "./pages/User/Login";
import QuestionarioAdotante from "./pages/User/QuestionarioAdotante";
import CreateAccountForm from "./pages/User/CreateAccount";
import AboutUs from "./pages/AboutUs";
import Blog from "./pages/Blog";

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

const PublicRoute = ({ element: Element }) => {
    const { isAuthenticated } = useContext(AuthContext);

    return isAuthenticated ? <Navigate to="/" /> : <Element />;
};

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quem-somos" element={<AboutUs />} />
            <Route path="/blog" element={<Blog />} />

            {/* ROTAS PROTEGIDAS PARA USUÁRIO LOGADO */}
            <Route path="/login" element={<PublicRoute element={Login} />} />
            <Route path="/criar-conta" element={<PublicRoute element={CreateAccountForm} />} />

            {/* ROTAS PROTEGIDA */}
            <Route path="/questionario" element={< PrivateRoute element={QuestionarioAdotante} />} />

            {/* ROTAS PROTEGIDA ADMIN */}
            <Route path="/admin/*" element={<AdminRoute element={AdminArea} />}/>
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;
