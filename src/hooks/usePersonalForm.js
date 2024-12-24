import { useForm } from "react-hook-form";
import { useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaForm } from "../zod/personalForms"; o
import { getAdressByZipCode } from "../services/viaCepApi";
import { toast } from "react-toastify";
import { createUser } from "../services/ApiUser";


export const usePersonalForm = () => {
    const {
        handleSubmit,
        register,
        watch,
        setValue,
        formState: { errors },
        reset
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

    const handleClear = () => {
        reset();
    };

    const zipCode = watch("address.zipCode");

    const showToast = (message, type = 'sucess') => {
        toast(message, {
            type: type,
            position: 'bottom-right',
            autoClose: 5000,
        });
    }

    const handleFormSubmit = async (data) => {
        const payload = { ...data.address, ...data.personalData };
        console.log("Dados do formulário enviados:", payload);

        try {
            let response = await createUser(payload);
            console.log(response)
            // se for ok
            // if (response.status === 201) {
            //     navigate("/login", { state: { userCreated: true } });
            // }
            showToast('Usuário criado com sucesso')
        } catch (error) {
            showToast("Erro ao criar conta");
            console.error("Erro ao criar conta:", error);
        }
    };

    const handleSetAddress = useCallback(
        (data) => {
            setValue("address.city", data.localidade);
            setValue("address.state", data.uf);
            setValue("address.street", data.logradouro || "");
            setValue("address.district", data.bairro);
            setValue("address.complement", data.complemento || "");
        },
        [setValue]
    );

    const handleFetchAddress = useCallback(
        async (zipCode) => {
            try {
                const response = await getAdressByZipCode(zipCode);

                if (response.status === 200) {
                    handleSetAddress(response.data)
                }
                console.log(response)
            } catch (error) {
                console.error("Erro ao buscar endereço:", error);
            }
        },[handleSetAddress]);

    useEffect( () => {
        if (zipCode?.length === 8) {
            handleFetchAddress(zipCode);
        }
    }, [zipCode, handleFetchAddress]);

    return {
        errors,
        register,
        handleSubmit,
        handleFormSubmit,
        handleClear
    };
};
