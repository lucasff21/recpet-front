import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {schemaForm} from "../zod/userAdminForms";
import {toast} from "react-toastify";
import { createUser } from "../services/ApiAdmin";
import { useNavigate } from "react-router-dom";

export const useCreateAdminUserForm = () => {
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        formState: { errors },
        reset,
    } = useForm({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(schemaForm),
        defaultValues: {
            personalData: {
                fullName: "",
                email: "",
                password: "",
                role: ""
            },
        },
    });

    const handleClear = () => { reset() };

    const showToast = (message, type = 'sucess') => {
        toast(message, {
            type: type,
            position: 'bottom-right',
            autoClose: 5000,
        });
    }

    const handleFormSubmit = async (data) => {
        const payload = {
            nome: data.personalData.fullName,
            tipo: data.personalData.role,
            email: data.personalData.email,
            senha: data.personalData.password,
        };

        createUser(payload)
            .then((response) => {
                if (response.status === 201) {
                    navigate("/admin/usuarios/lista");
                }
                showToast('Usuário criado com sucesso')
            })
            .catch((error) => {
                showToast("Erro ao criar conta", 'error');
            });
    };

    return {
        errors,
        register,
        handleSubmit,
        handleFormSubmit,
        handleClear
    };
}