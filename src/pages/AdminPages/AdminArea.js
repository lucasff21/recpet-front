import { useNavigate } from "react-router-dom";
import "../../styles/AdminPages.css";

const AdminArea = ({ children }) => {
    const navigate = useNavigate();


    const logout = () => {
        localStorage.removeItem("Token_RecSys");

        navigate("/");

    }

    return (
        <div style={{ display: 'flex' }}>
            <div className="barra-lateral">
                <div className="list-group">
                    <a href="/admin-area/adicionar" className="list-group-item list-group-item-action">Adicionar Pet</a>
                    <a href="#" className="list-group-item list-group-item-action">Gerenciar Usuários</a>
                    <a href="#" className="list-group-item list-group-item-action">Gerenciar Adoções</a>
                    <a className="list-group-item list-group-item-action disabled" aria-disabled="true">Export Data</a>
                </div>

                <button type="button" className="btn btn-danger" onClick={logout}>Sair</button>
            </div>

            <div className="container text-center" style={{ flex: 1 }}>
                <div className="row">
                    <div className="col-12 col-md-12">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminArea;
