import React, {useContext, useEffect, useState} from "react";
import {getUsers, updateRole} from "../services/ApiAdmin";
import {toast} from "react-toastify";
import {Link} from "react-router-dom";
import {deleteUser} from "../services/ApiAdmin";
import ConfirmModal from "./ConfirmModal";
import {showToast} from "../services/toastService";
import {AuthContext} from "../contexts/AuthContext";

const UserTable = () => {
    const [accounts, setAccounts] = useState([])
    const [filters, setFilters] = useState({ query: '', role: '', sortByDate: 'desc' });
    const [total, setTotal] = useState([]);
    const [modal, setModal] = useState({ isOpen: false, userId: null });
    const { user } = useContext(AuthContext);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredUsers = accounts
        .filter((account ) => {
            const queryMatch =
                account.nome.toLowerCase().includes(filters.query.toLowerCase()) ||
                account.email.toLowerCase().includes(filters.query.toLowerCase());
            const roleMatch = filters.role === '' || account['tipoUsuario'] === filters.role;
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
                setAccounts(accounts.filter((account ) => account.id !== modal.userId));
                showToast("Sucesso ao deletar o usuário");
            })
            .catch(() => {
                showToast("Erro ao deletar o usuário", 'error');
            });
        setModal({ isOpen: false, userId: null });
    };


    const handleRoleChange = (id, newRole) => {
        updateRole(id, { tipo: newRole })
            .then(() => {
                setAccounts(accounts.map(account => account.id === id ? { ...account, tipoUsuario: newRole } : account ));
                showToast("Sucesso ao editar o usuário");
            })
            .catch(() => {
                showToast("Erro ao editar o usuário", 'error');
            });
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
                setAccounts(response.data.content);
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
                {filteredUsers.map((account) => (
                    <tr key={account.id}>
                        <td>{account.nome}</td>
                        <td>{account.email}</td>
                        <td>
                            <select
                                disabled={account.id === user.id}
                                value={account['tipoUsuario']}
                                onChange={(e) =>
                                    handleRoleChange(account.id, e.target.value)}
                            >
                                {Object.entries(tipos).map(([key, value]) => (
                                    <option key={key} value={key}> {value} </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <button className="delete-btn" onClick={() => handleDelete(account.id)}>
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