import React from 'react';
import Panel from '../../../components/Panel';
import { Button } from '../../../components/Button';
import { useCharacteristicForm } from '../../../hooks/useCharacteristicForm';

const CreateCharacteristic = () => {
  const { formData, handleChange, handleSubmit, loading, cancel } =
    useCharacteristicForm();

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <Panel>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Criar Temperamento
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
              placeholder="Digite o nome do temperamento"
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
              text={loading ? 'Salvando...' : 'Salvar'}
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

export default CreateCharacteristic;
