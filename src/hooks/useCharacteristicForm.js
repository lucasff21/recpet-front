import { useState } from 'react';
import {
  createCaracteristica,
  updateCaracteristica,
} from '../services/ApiCharacteristics';
import { showToast } from '../utils/toast';
import { useNavigate } from 'react-router-dom';

export const useCharacteristicForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    nome: initialData?.nome || '',
    descricao: initialData?.descricao || '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (id = null) => {
    if (!formData.nome?.trim()) {
      showToast('Nome é obrigatório', 'error');
      return;
    }

    setLoading(true);

    const dataToSend = id ? formData : { ...formData, ativo: true };

    const action = id
      ? updateCaracteristica(id, formData)
      : createCaracteristica(dataToSend);

    const successMessage = id
      ? 'Característica atualizada com sucesso'
      : 'Característica criada com sucesso';

    try {
      await action;
      showToast(successMessage, 'success');
      navigate('/admin/temperamentos');
    } catch (error) {
      showToast('Erro ao salvar característica', 'error');
    } finally {
      setLoading(false);
    }
  };
  const cancel = () => navigate('/admin/temperamentos');

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    cancel,
    setFormData,
  };
};
