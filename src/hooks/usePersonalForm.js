import { useForm } from "react-hook-form";
import {useCallback, useEffect, useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaForm } from "../zod/personalForms";
import { getAddressByZipCode } from "../services/addressService";
import { toast } from "react-toastify";
import { createUser } from "../services/ApiUser";
import { getAllStates, getCitiesFromState } from "../services/addressService";
import {useNavigate} from "react-router-dom";

export const usePersonalForm = () => {
    const [ufs, setUfs] = useState([]);
    const [cities, setCities] = useState([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const navigate = useNavigate();

    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        mode: "all",
        criteriaMode: "all",
        resolver: zodResolver(schemaForm),
        defaultValues: {
            personalData: {
                fullName: "",
                cpf: "",
                gender: "",
                birthDate: "",
                phone: "",
                email: "",
                confirmEmail: "",
                password: "",
                confirmPassword: "",
            },
            address: {
                zipCode: "",
                street: "",
                complement: "",
                district: "",
                city: "",
                state: "",
            },
        },
    });

    const handleClear = () => { reset() };

    const zipCode = watch("address.zipCode");
    const state = watch("address.state");

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
             cpf: data.personalData.cpf,
             genero: data.personalData.gender,
             dataNascimento: data.personalData.birthDate,
             telefone: data.personalData.phone,
             email: data.personalData.email,
             senha: data.personalData.password,
             cep: data.address.zipCode,
             logradouro: data.address.street,
             complemento: data.address.complement || "",
             bairro: data.address.district,
             localidade: data.address.city,
             uf: data.address.state,
         };

        console.log("Dados do formulário enviados:", payload);

        try {
            let response = await createUser(payload);

            if (response.status === 201) {
                navigate("/login", { state: { userCreated: true } });
            }
            showToast('Usuário criado com sucesso')
        } catch (error) {
            showToast("Erro ao criar conta", 'error');
            console.error("Erro ao criar conta:", error);
        }
    };

    const handleSetAddress = useCallback(
        (data) => {
            setValue("address.state", data.uf);
            setValue("address.city", data.localidade);
            setValue("address.street", data.logradouro || "");
            setValue("address.district", data.bairro);
            setValue("address.complement", data.complemento || "");
        },
        [setValue, loadingCities]
    );

    useEffect(() => {
        getAllStates()
            .then((response) => {
                setUfs(response.data);
            })
            .catch(() => {
                showToast("Erro ao buscar os Estados", 'error')
            });
    }, []);


    useEffect(() => {
        if (!state) return;
        setLoadingCities(true);

        getCitiesFromState(state)
            .then((response) => {
                setCities(response.data);
            })
            .catch(() => {
                showToast("Erro ao buscar as cidades", 'error')
            })
            .finally(() => setLoadingCities(false));
    }, [state]);


    useEffect( () => {
        const zipCodeFormat = zipCode?.replace(/\D/g, '');

        if (zipCodeFormat?.length === 8) {
            getAddressByZipCode(zipCodeFormat)
                 .then(response => {
                     handleSetAddress(response.data)
                 })
                 .catch(() => {
                     showToast("Erro ao buscar o endereço", 'error')
                 })
        }
    }, [zipCode, handleSetAddress]);

    return {
        errors,
        register,
        ufs,
        cities,
        handleSubmit,
        handleFormSubmit,
        handleClear
    };
};
