import React, { useEffect } from 'react';
import Panel from '../../../components/Panel';
import { Button } from '../../../components/Button';
import { useCharacteristicForm } from '../../../hooks/useCharacteristicForm';
import { findAllCaracteristicas } from '../../../services/ApiCharacteristics';
import { showToast } from '../../../utils/toast';
import { useParams, useNavigate } from 'react-router-dom';

const EditCharacteristic = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, loading, cancel, setFormData } =
    useCharacteristicForm();

  useEffect(() => {
    findAllCaracteristicas({})
      .then((res) => {
        const item = (res.data || []).find((i) => String(i.id) === String(id));
        if (item) {
          setFormData({
            nome: item.nome || '',
            descricao: item.descricao || '',
          });
        } else {
          showToast('Temperamento não encontrado', 'error');
          navigate('/admin/temperamentos');
        }
      })
      .catch(() => {
        showToast('Erro ao carregar temperamentos', 'error');
        navigate('/admin/temperamentos');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(id);
  };

  return (
    <Panel>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Característica
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              id="nome"
              type="text"
              placeholder="Digite o nome da característica"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              placeholder="Digite a descrição (opcional)"
              value={formData.descricao}
              onChange={(e) => handleChange('descricao', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              text="Cancelar"
              onClick={cancel}
              type="button"
              size="medium"
              className="w-full sm:w-auto"
            />
            <Button
              text={loading ? 'Salvando...' : 'Salvar Alterações'}
              type="submit"
              disabled={loading}
              confirm
              size="medium"
              className="w-full sm:w-auto"
            />
          </div>
        </form>
      </div>
    </Panel>
  );
};

export default EditCharacteristic;
