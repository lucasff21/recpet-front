import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schemaForm } from '../zod/userAdminForms';
import { createUser } from '../services/ApiAdmin';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showToast } from '../utils/toast';

export const useCreateAdminUserForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'all',
    criteriaMode: 'all',
    resolver: zodResolver(schemaForm),
    defaultValues: {
      personalData: {
        fullName: '',
        email: '',
        password: '',
        role: '',
      },
    },
  });

  const handleClear = () => {
    reset();
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      nome: data.personalData.fullName,
      tipo: data.personalData.role,
      email: data.personalData.email,
      senha: data.personalData.password,
    };

    setLoading(true);
    createUser(payload)
      .then((response) => {
        if (response.status === 201) {
          navigate('/admin/usuarios');
        }
        showToast('Usuário criado com sucesso');
      })
      .catch((error) => {
        showToast('Erro ao criar conta', 'error');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    errors,
    register,
    loading,
    handleSubmit,
    handleFormSubmit,
    handleClear,
  };
};
