import {Link, Route, Routes, useNavigate} from "react-router-dom";
import "../../styles/AdminPages.css";
import AddPet from "./AddPet";
import UserManagement from "./UserManagement";
import {ToastContainer} from "react-toastify";

const AdminArea = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("Token_RecSys");

        navigate("/");
    }

    return (
        <div style={{ display: 'flex' }}>
            <ToastContainer />
            <div className="barra-lateral bg-cyan-700">
                <div className="list-group">
                    <Link to="adicionar" className="list-group-item list-group-item-action">Adicionar Pet</Link>
                    <Link to="usuarios/lista" className="list-group-item list-group-item-action">Gerenciar Usuários</Link>
                    <Link to="adoptions" className="list-group-item list-group-item-action">Gerenciar Adoções</Link>
                    <span className="list-group-item list-group-item-action disabled" aria-disabled="true">Export Data</span>
                </div>
                <button type="button" className="btn btn-danger" onClick={logout}>Sair</button>
            </div>

            <div className="content">
                <div>
                    <Routes>
                        <Route path="/*" element={
                            <Routes>
                                <Route path="adicionar" element={<AddPet />} />
                                <Route path="usuarios/*" element={<UserManagement />} />
                            </Routes>
                        } />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default AdminArea;
