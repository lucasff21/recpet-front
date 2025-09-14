import React, { useState, useCallback, useContext } from 'react';
import { createAnimal } from '../../../services/ApiAdocao';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../../contexts/AuthContext';
import { basePetSchema } from '../../../zod/petForms';
import PetForm from './PetForm';
import { useNavigate } from 'react-router-dom';

const AddPet = () => {
  document.title = 'Adicionar Pet | ADMIN ';
  const { authToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const cadastrarPet = async (data) => {
    setLoading(true);
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (key !== 'imagem' && key !== 'caracteristicasIds') {
        formData.append(key, data[key]);
      }
    });

    if (data.imagem) {
      formData.append('imagem', data.imagem);
    }

    if (data.caracteristicasIds && data.caracteristicasIds.length > 0) {
      data.caracteristicasIds.forEach((id) => {
        formData.append('caracteristicasIds', id);
      });
    }

    try {
      await createAnimal(formData, authToken);
      toast.success('Pet cadastrado com sucesso!');
      navigate('/admin/pets');
    } catch (error) {
      toast.error('Erro ao cadastrar pet. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = useCallback(() => {}, []);

  return (
    <PetForm
      isEdit={false}
      onSubmit={cadastrarPet}
      loading={loading}
      onClear={handleClearForm}
      validationSchema={basePetSchema}
    />
  );
};

export default AddPet;
