import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaForm } from '../zod/personalForms';
import { getAddressByZipCode } from '../services/addressService';
import { createUser } from '../services/ApiUser';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../utils/toast';

export const usePersonalForm = () => {
  const [uf, setUf] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(schemaForm),
    defaultValues: {
      fullName: '',
      cpf: '',
      gender: '',
      birthDate: '',
      phone: '',
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      zipCode: '',
      street: '',
      complement: '',
      district: '',
      city: '',
      state: '',
    },
  });

  const handleClear = () => {
    reset();
  };

  const zipCode = watch('zipCode');

  const handleFormSubmit = async (data) => {
    const payload = {
      nome: data.fullName,
      cpf: data.cpf?.replace(/\D/g, ''),
      genero: data.gender,
      dataNascimento: data.birthDate,
      telefone: data.phone?.replace(/\D/g, ''),
      email: data.email,
      senha: data.password,
      cep: data.zipCode?.replace(/\D/g, ''),
      logradouro: data.street,
      complemento: data.complement || '',
      bairro: data.district,
      localidade: data.city,
      uf: uf.sigla,
    };

    setLoading(true);

    await createUser(payload)
      .then((response) => {
        if (response.status === 201) {
          navigate('/login', { state: { userCreated: true } });
        }
      })
      .catch((e) => {
        showToast(e.response?.data?.error || 'Erro ao criar conta', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSetAddress = useCallback(
    (data) => {
      setValue('state', data.estado);
      setValue('city', data.localidade);
      setValue('street', data.logradouro || '');
      setValue('district', data.bairro);
      setValue('complement', data.complemento || '');
      setUf({ sigla: data.uf });
    },
    [setValue]
  );

  useEffect(() => {
    const zipCodeFormat = zipCode?.replace(/\D/g, '');

    if (zipCodeFormat?.length === 8) {
      setLoading(true);
      getAddressByZipCode(zipCodeFormat)
        .then((response) => {
          handleSetAddress(response.data);
        })
        .catch(() => {
          showToast('Erro ao buscar o endereço', 'error');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [zipCode, handleSetAddress]);

  return {
    errors,
    register,
    handleSubmit,
    watch,
    currentStep,
    setCurrentStep,
    loading,
    handleFormSubmit,
    handleClear,
  };
};
