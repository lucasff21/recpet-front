import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../contexts/AuthContext';
import { createQuestionario, updateQuestionario } from '../services/ApiAdocao';
import { showToast } from '../utils/toast';
import { questionarioSchema, defaultValues } from '../zod/questionarioSchema';

export const useQuestionario = () => {
  const navigate = useNavigate();
  const { user, updateUserQuestionario } = useContext(AuthContext);

  const isEditing = !!user?.questionario;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(questionarioSchema),
    defaultValues,
  });

  useEffect(() => {
    if (user?.questionario) {
      const q = user.questionario;

      reset({
        moradia: q.moradia || '',
        telasProtecao: q.telasProtecao || false,
        todosDeAcordo: q.todosDeAcordo || false,
        qtdCaes: q.qtdCaes || 0,
        qtdGatos: q.qtdGatos || 0,
        qtdOutros: q.qtdOutros || 0,
        cienteCustos: q.cienteCustos || false,
        termoCompromissoLongoPrazo: q.termoCompromissoLongoPrazo || false,
        termoSaudeBemEstar: q.termoSaudeBemEstar || false,
        termoPacienciaAdaptacao: q.termoPacienciaAdaptacao || false,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      showToast(
        firstError?.message || 'Por favor, corrija os erros no formulário.',
        'warning'
      );
    }
  }, [errors]);

  const onSubmit = async (data) => {
    try {
      let response;

      if (isEditing) {
        response = await updateQuestionario(data);
        showToast('Questionário atualizado com sucesso!', 'success');
      } else {
        response = await createQuestionario(data);
        showToast('Questionário enviado com sucesso!', 'success');
      }
      if (updateUserQuestionario) {
        updateUserQuestionario(response.data || response);
      }

      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Sessão expirada. Faça login novamente.', 'error');
        navigate('/login');
      } else if (error.response?.status === 400) {
        showToast('Dados inválidos. Verifique o formulário.', 'error');
      } else if (error.response?.data?.message) {
        showToast(error.response.data.message, 'error');
      } else {
        showToast('Erro ao enviar o questionário. Tente novamente.', 'error');
      }
    }
  };

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
    isEditing,
    setValue,
    watch,
  };
};
