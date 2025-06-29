import { useState } from 'react';

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    nome: 'Milena',
    telefone: '(XX) XXXXX-XXXX',
    cpf: 'XXX.XXX.XXX-XX',
  });

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSaveSuccess(true);
      setEditing(false);
    } catch (err) {
      setSaveError('Erro ao salvar as configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Configurações da Conta
      </h2>

      {saveSuccess && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline">
            {' '}
            Suas configurações foram salvas.
          </span>
        </div>
      )}
      {saveError && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {saveError}</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={userData.nome}
            onChange={handleChange}
            disabled={!editing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${editing ? 'focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 cursor-not-allowed'}`}
          />
        </div>
        <div>
          <label
            htmlFor="telefone"
            className="block text-sm font-medium text-gray-700"
          >
            Telefone
          </label>
          <input
            type="text"
            id="telefone"
            name="telefone"
            value={userData.telefone}
            onChange={handleChange}
            disabled={!editing}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 ${editing ? 'focus:border-blue-500 focus:ring-blue-500' : 'bg-gray-50 cursor-not-allowed'}`}
          />
        </div>
        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-medium text-gray-700"
          >
            CPF
          </label>
          <input
            type="text"
            id="cpf"
            name="cpf"
            value={userData.cpf}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2 bg-gray-50 cursor-not-allowed"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Editar Perfil
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setEditing(false);
                setSaveError(null);
                setSaveSuccess(false);
              }}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
            >
              {saving ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
