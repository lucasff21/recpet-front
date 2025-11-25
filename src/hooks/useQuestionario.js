import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../contexts/AuthContext';
import { createQuestionario, updateQuestionario } from '../services/ApiAdocao';
import { showToast } from '../utils/toast';
import { questionarioSchema, defaultValues } from '../zod/questionarioSchema';

export const useQuestionario = ({ onSuccess } = {}) => {
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

  // Carregar dados existentes se for edição
  useEffect(() => {
    if (user?.questionario) {
      const q = user.questionario;
      
      // Helper para converter valor numérico/boolean da API para String do Input
      const toStr = (val) => (val !== undefined && val !== null ? String(val) : '');
      const boolToStr = (val) => (val === true ? 'true' : 'false');

      reset({
        // Enums (Strings diretas)
        preferenciaSexo: q.preferenciaSexo || 'INDIFERENTE',
        temCriancas: q.temCriancas || 'NAO', // Atenção ao nome do campo vindo do DTO Response

        // Escalas (Converter Number -> String para o Select)
        preferenciaPorte: toStr(q.preferenciaPorte),
        nivelEnergia: toStr(q.nivelEnergia),
        nivelQuedaPelo: toStr(q.nivelQuedaPelo),
        nivelLatido: toStr(q.nivelLatido),
        instintoGuarda: toStr(q.instintoGuarda),
        moradia: toStr(q.moradia),
        tempoDisponivel: toStr(q.tempoDisponivel),
        experienciaPets: toStr(q.experienciaPets),

        // Booleans de Contexto (Converter Boolean -> String "true"/"false" para Radio)
        possuiCaes: boolToStr(q.possuiCaes),
        possuiGatos: boolToStr(q.possuiGatos),
        disposicaoNecessidadesEspeciais: boolToStr(q.disposicaoNecessidadesEspeciais),
        cienteCustos: boolToStr(q.cienteCustos),

        // Termos (Manter Boolean para Checkbox)
        termoCompromissoLongoPrazo: q.termoCompromissoLongoPrazo || false,
        termoSaudeBemEstar: q.termoSaudeBemEstar || false,
        termoPacienciaAdaptacao: q.termoPacienciaAdaptacao || false,
        termoVistoria: q.termoVistoria || false,
        termoDevolucaoNaoAbandono: q.termoDevolucaoNaoAbandono || false,
        termoLegislacaoPosseResponsavel: q.termoLegislacaoPosseResponsavel || false,
      });
    }
  }, [user, reset]);

  // Toast de erro
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      // Se for um erro de enum/objeto, a mensagem pode estar aninhada
      const msg = firstError?.message || 'Verifique os campos obrigatórios.';
      showToast(msg, 'warning');
      console.log('Erros de validação:', errors); // Útil para debug
    }
  }, [errors]);

  const onSubmit = async (data) => {
    try {
      let response;

      // O Zod já converteu as strings numéricas para Int e "true" para boolean aqui
      if (isEditing) {
        response = await updateQuestionario(data);
        showToast('Perfil atualizado com sucesso!', 'success');
      } else {
        response = await createQuestionario(data);
        showToast('Perfil criado com sucesso!', 'success');
      }

      // Atualiza o contexto do usuário com o novo questionário retornado
      updateUserQuestionario(response.data);

      if (onSuccess) {
        onSuccess(response.data || response);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        showToast('Sessão expirada. Faça login novamente.', 'error');
        navigate('/login');
      } else if (error.response?.status === 400) {
        // Tenta pegar a mensagem específica do backend se houver validação lá
        const serverMsg = error.response.data?.message || 'Dados inválidos.';
        showToast(serverMsg, 'error');
      } else {
        showToast('Erro ao salvar. Tente novamente.', 'error');
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