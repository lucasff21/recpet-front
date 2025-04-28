import { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { createQuestionario } from '../../services/ApiAdocao';
import { AuthContext } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const QuestionarioAdotante = () => {
  const [sexo, setSexo] = useState('');
  const [porte, setPorte] = useState('');
  const [pelagem, setPelagem] = useState('');
  const [idealCasa, setIdealCasa] = useState('');
  const [gostaCrianca, setGostaCrianca] = useState('');
  const [caoGuarda, setCaoGuarda] = useState('');
  const [brincalhao, setBrincalhao] = useState('');
  const [necessidadeCorrer, setNecessidadeCorrer] = useState('');
  const [quedaPelo, setQuedaPelo] = useState('');
  const [tendeLatir, setTendeLatir] = useState('');
  const { authToken, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCreateQuestionario = async (e) => {
    e.preventDefault();

    if (
      !sexo ||
      !porte ||
      !pelagem ||
      !idealCasa ||
      !gostaCrianca ||
      !caoGuarda ||
      !brincalhao ||
      !necessidadeCorrer ||
      !quedaPelo ||
      !tendeLatir
    ) {
      alert('Por favor, preencha todos os campos antes de enviar.');
      return;
    }

    const formData = {
      sexo,
      porte,
      pelagem,
      idealCasa: Boolean(idealCasa),
      gostaCrianca: Boolean(gostaCrianca),
      caoGuarda: Boolean(caoGuarda),
      brincalhao: Boolean(brincalhao),
      necessidadeCorrer: Boolean(necessidadeCorrer),
      quedaPelo: Boolean(quedaPelo),
      tendeLatir: Boolean(tendeLatir),
    };

    console.log(role);

    try {
      if (role.includes('ADOTANTE')) {
        const result = await createQuestionario(formData, authToken);

        console.log(result);

        if (result) {
          toast.success('Questionário enviado com sucesso!', {
            position: 'bottom-right',
            autoClose: 5000,
          });
          navigate('/');
        } else {
          toast.error('Erro ao enviar o questionário. Tente novamente.', {
            position: 'bottom-right',
            autoClose: 5000,
          });
        }
      } else {
        toast.error('Apenas adotantes podem enviar este questionário.', {
          position: 'bottom-right',
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error('Erro ao enviar o questionário:', error);
      toast.error('Ocorreu um erro ao enviar o questionário.', {
        position: 'bottom-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <Layout showFooter={false}>
      <ToastContainer />
      <div className="space-y-8 bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <div style={{ textAlign: 'center' }}>
          <h3>Encontre o Pet ideal para você!</h3>
          <p className="font-medium">
            Responda às perguntas abaixo para que possamos encontrar o cachorro
            ideal para o seu estilo de vida.
          </p>
        </div>
        <hr />
        <form id="questionario-adotante" onSubmit={handleCreateQuestionario}>
          <label htmlFor="sexo">Qual o sexo do pet que você prefere?</label>
          <select
            id="sexo"
            className="form-control"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="macho">Macho</option>
            <option value="femea">Fêmea</option>
          </select>

          <label htmlFor="porte">Qual o porte do pet que você prefere?</label>
          <select
            id="porte"
            className="form-control"
            value={porte}
            onChange={(e) => setPorte(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="pequeno">Pequeno</option>
            <option value="medio">Médio</option>
            <option value="grande">Grande</option>
            <option value="gigantes">Gigante</option>
          </select>

          <label htmlFor="pelagem">
            Qual o tipo de pelagem que você prefere?
          </label>
          <select
            id="pelagem"
            className="form-control"
            value={pelagem}
            onChange={(e) => setPelagem(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="pelo curto liso">Pelo curto liso</option>
            <option value="pelo curto duro">Pelo curto e duro</option>
            <option value="pelo longo liso">Pelo longo liso</option>
            <option value="pelo longo ondulado">Pelo longo ondulado</option>
          </select>

          <label htmlFor="idealCasa">
            O pet será ideal para viver em casa?
          </label>
          <select
            id="idealCasa"
            className="form-control"
            value={idealCasa}
            onChange={(e) => setIdealCasa(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="gostaCrianca">
            O pet precisa ser amigável com crianças?
          </label>
          <select
            id="gostaCrianca"
            className="form-control"
            value={gostaCrianca}
            onChange={(e) => setGostaCrianca(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="caoGuarda">
            Você está procurando um cão de guarda?
          </label>
          <select
            id="caoGuarda"
            className="form-control"
            value={caoGuarda}
            onChange={(e) => setCaoGuarda(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="brincalhao">O pet deve ser brincalhão?</label>
          <select
            id="brincalhao"
            className="form-control"
            value={brincalhao}
            onChange={(e) => setBrincalhao(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="necessidadeCorrer">
            O pet terá necessidade de correr frequentemente?
          </label>
          <select
            id="necessidadeCorrer"
            className="form-control"
            value={necessidadeCorrer}
            onChange={(e) => setNecessidadeCorrer(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="quedaPelo">
            Você se incomoda com queda de pelos?
          </label>
          <select
            id="quedaPelo"
            className="form-control"
            value={quedaPelo}
            onChange={(e) => setQuedaPelo(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <label htmlFor="tendeLatir">
            O pet pode ser de uma raça que tende a latir com frequência?
          </label>
          <select
            id="tendeLatir"
            className="form-control"
            value={tendeLatir}
            onChange={(e) => setTendeLatir(e.target.value)}
          >
            <option value="" disabled>
              Selecione:
            </option>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>

          <button type="submit" className="btn btn-primary mt-3">
            Enviar
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default QuestionarioAdotante;
