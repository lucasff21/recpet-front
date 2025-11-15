import { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { createQuestionario } from '../../services/ApiAdocao';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { showToast } from '../../utils/toast';

const QuestionarioAdotante = () => {
  const [moradia, setMoradia] = useState('');
  const [telasProtecao, setTelasProtecao] = useState('');
  const [todosDeAcordo, setTodosDeAcordo] = useState('');
  const [qtdCaes, setQtdCaes] = useState(0);
  const [qtdGatos, setQtdGatos] = useState(0);
  const [qtdOutros, setQtdOutros] = useState(0);
  const [cienteCustos, setCienteCustos] = useState('');
  const [termoCompromissoLongoPrazo, setTermoCompromissoLongoPrazo] = useState(false);
  const [termoSaudeBemEstar, setTermoSaudeBemEstar] = useState(false);
  const [termoPacienciaAdaptacao, setTermoPacienciaAdaptacao] = useState(false);

  const {role, setHasQuestionario } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleCreateQuestionario = async (e) => {
    e.preventDefault();

    if (
      !moradia ||
      !telasProtecao ||
      !todosDeAcordo ||
      !cienteCustos ||
      !termoCompromissoLongoPrazo ||
      !termoSaudeBemEstar ||
      !termoPacienciaAdaptacao
    ) {
      showToast('Por favor, preencha todos os campos e aceite todos os termos.', 'warning');
      return;
    }

    const formData = {
      moradia,
      telasProtecao: telasProtecao === 'true',
      todosDeAcordo: todosDeAcordo === 'true',
      qtdCaes: parseInt(qtdCaes, 10),
      qtdGatos: parseInt(qtdGatos, 10),
      qtdOutros: parseInt(qtdOutros, 10),
      cienteCustos: cienteCustos === 'true',
      termoCompromissoLongoPrazo,
      termoSaudeBemEstar,
      termoPacienciaAdaptacao,
    };

    if (role.includes('ADOTANTE') || role.includes('ADMIN')) {
      createQuestionario(formData)
        .then(() => {
          if (setHasQuestionario) {
            setHasQuestionario(true);
          }
          localStorage.setItem('hasQuestionario', 'true');
          showToast('Questionário enviado com sucesso!', 'success');
          navigate('/');
        })
        .catch(() => {
          showToast('Erro ao enviar o questionário. Tente novamente.', 'error');
        });
    } else {
      showToast('Apenas adotantes podem enviar este questionário.', 'error');
    }
  };

  return (
    <Layout showFooter={false}>
      <ToastContainer />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Questionário de Adoção</h2>
          <p className="text-gray-600 mb-6">
            Preencha as informações abaixo para iniciar o processo de adoção.
          </p>

          <form onSubmit={handleCreateQuestionario} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sua moradia é:
              </label>
              <select 
                value={moradia} 
                onChange={(e) => setMoradia(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione</option>
                <option value="CASA_QUINTAL_TOTALMENTE_FECHADO">Casa com quintal totalmente fechado</option>
                <option value="CASA_QUINTAL_ABERTO">Casa com quintal aberto</option>
                <option value="CASA_SEM_QUINTAL">Casa sem quintal</option>
                <option value="APARTAMENTO">Apartamento</option>
              </select>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Janelas e sacadas possuem telas ou grades de proteção?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="telasProtecao" 
                    value="true" 
                    checked={telasProtecao === 'true'}
                    onChange={(e) => setTelasProtecao(e.target.value)}
                    className="mr-2"
                  />
                  Sim
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="telasProtecao" 
                    value="false" 
                    checked={telasProtecao === 'false'}
                    onChange={(e) => setTelasProtecao(e.target.value)}
                    className="mr-2"
                  />
                  Não
                </label>
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Todos na sua casa estão de acordo com a adoção?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="todosDeAcordo" 
                    value="true" 
                    checked={todosDeAcordo === 'true'}
                    onChange={(e) => setTodosDeAcordo(e.target.value)}
                    className="mr-2"
                  />
                  Sim
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="todosDeAcordo" 
                    value="false" 
                    checked={todosDeAcordo === 'false'}
                    onChange={(e) => setTodosDeAcordo(e.target.value)}
                    className="mr-2"
                  />
                  Não
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quais animais você já tem em casa?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cães</label>
                  <input 
                    type="number" 
                    value={qtdCaes} 
                    onChange={(e) => setQtdCaes(e.target.value)} 
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Gatos</label>
                  <input 
                    type="number" 
                    value={qtdGatos} 
                    onChange={(e) => setQtdGatos(e.target.value)} 
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Outros</label>
                  <input 
                    type="number" 
                    value={qtdOutros} 
                    onChange={(e) => setQtdOutros(e.target.value)} 
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Você pode incluir os custos de um animal (ração, vacinas, veterinário) no seu orçamento?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="cienteCustos" 
                    value="true" 
                    checked={cienteCustos === 'true'}
                    onChange={(e) => setCienteCustos(e.target.value)}
                    className="mr-2"
                  />
                  Sim
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="cienteCustos" 
                    value="false" 
                    checked={cienteCustos === 'false'}
                    onChange={(e) => setCienteCustos(e.target.value)}
                    className="mr-2"
                  />
                  Não
                </label>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pilares da Adoção Responsável
              </label>
              <div className="space-y-3">
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={termoCompromissoLongoPrazo} 
                    onChange={(e) => setTermoCompromissoLongoPrazo(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Entendo que um animal pode viver mais de 15 anos e é um compromisso para a vida toda.
                  </span>
                </label>
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={termoSaudeBemEstar} 
                    onChange={(e) => setTermoSaudeBemEstar(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Comprometo-me a zelar pela saúde e bem-estar do animal.
                  </span>
                </label>
                <label className="flex items-start">
                  <input 
                    type="checkbox" 
                    checked={termoPacienciaAdaptacao} 
                    onChange={(e) => setTermoPacienciaAdaptacao(e.target.checked)}
                    className="mt-1 mr-3"
                  />
                  <span className="text-sm text-gray-700">
                    Entendo que o animal precisará de paciência e carinho para se adaptar.
                  </span>
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium"
            >
              Enviar Questionário
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default QuestionarioAdotante;
