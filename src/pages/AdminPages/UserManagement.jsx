import React from 'react';
import "../../styles/UserManagement.css";
import {Link, Route, Routes, useLocation} from "react-router-dom";
import UserTable from "../../components/UserTable";
import CreateUserAdmin from "./CreateUserAdmin";

const UserManagement = () => {
    const location = useLocation();

    const isCreatePage = location.pathname === "/admin-area/usuarios/criar";
    return (
        <div className="admin-table">
            {isCreatePage && (
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="lista">Usuários</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Criar
                        </li>
                    </ol>
                </nav>
            )}

            <Routes>
                <Route path="/*" element={
                    <Routes>
                        <Route path="/lista" element={<UserTable/>}/>
                        <Route path="/criar" element={<CreateUserAdmin/>}/>
                    </Routes>
                }/>
            </Routes>
        </div>
    );
}

export default UserManagement;