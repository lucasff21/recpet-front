import React, {useEffect, useState} from "react";
import {getUsers} from "../services/ApiAdmin";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {deleteUser} from "../services/ApiAdmin";
import ConfirmModal from "./ConfirmModal";

const UserTable = () => {
    const [users, setUsers] = useState([])
    const [filters, setFilters] = useState({ query: '', role: '', sortByDate: 'desc' });
    const [total, setTotal] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, userId: null });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredUsers = users
        .filter((user) => {
            const queryMatch =
                user.nome.toLowerCase().includes(filters.query.toLowerCase()) ||
                user.email.toLowerCase().includes(filters.query.toLowerCase());
            const roleMatch = filters.role === '' || user['tipoUsuario'] === filters.role;
            return queryMatch && roleMatch;
        })
        .sort((a, b) => {
            if (filters.sortByDate === 'desc') {
                return b.criadoEm - a.criadoEm;
            } else {
                return a.criadoEm - b.criadoEm;
            }
        });

    const handleDelete = (id) => {
        setModal({ isOpen: true, userId: id });
    };

    const confirmDelete = () => {
        deleteUser(modal.userId)
            .then(() => {
                setUsers(users.filter((user) => user.id !== modal.userId));
                toast("Sucesso ao deletar o usuário", { position: 'bottom-right', autoClose: 5000 });
            })
            .catch(() => {
                toast("Erro ao deletar o usuário", { type: 'error', position: 'bottom-right', autoClose: 5000 });
            });
        setModal({ isOpen: false, userId: null });
    };


    const handleEdit = (id) => {
        alert(`Edit user with ID: ${id}`);
    };

    const tipos = {
        ADMIN: "ADMINISTRADOR",
        MODERATOR: "MODERADOR",
        ADOTANTE: "ADOTANTE"
    }

    const getUsersFiltered = (filters = {}) => {
        getUsers(filters)
            .then((response) => {
                setTotal(response.data['totalElements']);
                setUsers(response.data.content);
            })
            .catch(() => {
                toast("Erro ao buscar os usuários", {
                    type: 'error',
                    position: 'bottom-right',
                    autoClose: 5000,
                });
            });
    }

    useEffect(() => {
        getUsersFiltered()
    }, []);

    const handleFilteredSearch = () => {
        getUsersFiltered(filters)
    }

    return (
        <div className="user-management">
            <h1>Usuários ({total})</h1>
            <div className="search-container">
                <button className="search-button" onClick={handleFilteredSearch}>
                    🔍
                </button>
                <input
                    type="text"
                    name="query"
                    placeholder="Pesquise por nome ou email"
                    value={filters.query}
                    onChange={handleFilterChange}
                    style={{marginBottom: '1rem', width: '40%', alignSelf: 'end'}}
                    onKeyDown={(e) => e.key === 'Enter' && handleFilteredSearch()}
                />
            </div>
            <div className="filters">
                <select name="role" value={filters.role} onChange={handleFilterChange}>
                    <option value="">Todos</option>
                    {Object.entries(tipos).map(([key, value]) => (
                        <option key={key} value={key}> {value} </option>
                    ))}
                </select>
                <select name="sortByDate" value={filters.sortByDate} onChange={handleFilterChange}>
                    <option value="desc">Mais Recentes</option>
                    <option value="asc">Mais Antigos</option>
                </select>
                <button type="button" className="btn btn-success">
                    <Link to="../criar" className="list-group-item list-group-item-action">+ Criar usuário</Link>
                </button>
            </div>
            <table>
                <thead>
                <tr>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {filteredUsers.map((user) => (
                    <tr key={user.id}>
                        <td>{user.nome}</td>
                        <td>{user.email}</td>
                        <td>{tipos[user['tipoUsuario']]}</td>
                        <td>
                            <button className="edit-btn" onClick={() => handleEdit(user.id)}>
                                ✏️ Editar
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(user.id)}>
                                🗑️ Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            {modal.isOpen && (
                <ConfirmModal
                    message="Tem certeza que deseja excluir este usuário?"
                    onConfirm={confirmDelete}
                    onCancel={() => setModal({isOpen: false, userId: null})}
                />
            )}
        </div>
    )
}

export default UserTable