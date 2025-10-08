import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useState } from 'react';
import { showToast } from '../../../utils/toast';
import Panel from '../../../components/Panel';
import InputField from '../../../components/FormFields/InputField';
import { Button } from '../../../components/Button';
import {
  createPagina,
  findPaginaById,
  updatePagina,
} from '../../../services/ApiAdmin';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const contentSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.').max(255),
  titulo: z
    .string()
    .min(3, 'O título deve ter no mínimo 3 caracteres.')
    .max(255),
  conteudo: z.string().min(10, 'O conteúdo é obrigatório.'),
});

const ContentForm = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('Nova Página de Conteúdo');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: 'all',
    resolver: zodResolver(contentSchema),
    defaultValues: {
      nome: '',
      titulo: '',
      conteudo: '',
    },
  });

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true);
      findPaginaById(id)
        .then((response) => {
          const { nome, titulo, conteudo } = response.data;
          reset({ nome, titulo, conteudo });
          setPageTitle(`Editar Página: ${titulo}`);
        })
        .catch(() => showToast('Erro ao carregar dados da página.', 'error'))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (isEdit) {
        await updatePagina(id, data);
        showToast('Página atualizada com sucesso!', 'success');
      } else {
        await createPagina(data);
        showToast('Página criada com sucesso!', 'success');
      }
      navigate('/admin/conteudos');
    } catch (error) {
      showToast(
        error.response?.data?.message || 'Erro ao salvar página.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Panel>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          {pageTitle}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            id="nome"
            label="Nome (identificador único, ex: 'quem_somos')"
            register={register}
            errors={errors}
          />
          <InputField
            id="titulo"
            label="Título Principal da Página"
            register={register}
            errors={errors}
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Conteúdo da Página
          </label>
          <Controller
            name="conteudo"
            control={control}
            render={({ field }) => (
              <ReactQuill
                theme="snow"
                value={field.value}
                onChange={field.onChange}
                className="bg-white"
              />
            )}
          />
          {errors.conteudo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.conteudo.message}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            text="Cancelar"
            onClick={() => navigate('/admin/conteudos')}
            disabled={loading}
            type="button"
          />
          <Button
            text={isEdit ? 'Atualizar' : 'Salvar'}
            disabled={loading || !isValid}
            loading={loading}
            type="submit"
            confirm={true}
          />
        </div>
      </form>
    </Panel>
  );
};

export default ContentForm;
