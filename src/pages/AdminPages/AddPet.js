import { useContext, useState } from "react";
import AdminArea from "./AdminArea";
import { createCachorro, uploadImagePet } from "../../services/ConsumeApi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from "../../contexts/AuthContext";


const AddPet = () => {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [sexo, setSexo] = useState("");
    const [porte, setPorte] = useState("");
    const [pelagem, setPelagem] = useState("");
    const [idealCasa, setIdealCasa] = useState(false);
    const [gostaCrianca, setGostaCrianca] = useState(false);
    const [caoGuarda, setCaoGuarda] = useState(false);
    const [brincalhao, setBrincalhao] = useState(false);
    const [necessidadeCorrer, setNecessidadeCorrer] = useState(false);
    const [quedaPelo, setQuedaPelo] = useState(false);
    const [tendeLatir, setTendeLatir] = useState(false);
    const { authToken } = useContext(AuthContext)
    const [imagePath, setImagePath] = useState("");
    const [imagePreSave, setImagePreSave] = useState(null);


    const cadastrarPet = async () => {
        if (!nome || !idade || !sexo || !porte || !pelagem) {
            toast.warning('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
    
        try {
            // Primeiro, envia a imagem
            const resultImage = imagePreSave ? await uploadImagePet(imagePreSave, authToken) : null;
    
            const petData = {
                nome,
                idade,
                sexo,
                porte,
                pelagem,
                idealCasa,
                gostaCrianca,
                caoGuarda,
                brincalhao,
                necessidadeCorrer,
                quedaPelo,
                tendeLatir,
                imagePath: resultImage ? resultImage : "" 
            };

            console.log("Dados sendo enviados:", petData);


            const result = await createCachorro(petData, authToken);
            if (result) {
                toast.success('Pet cadastrado com sucesso!');
                resetFields();
            } else {
                toast.error('Erro ao cadastrar pet.');
            }
        } catch (error) {
            toast.error("Erro ao salvar a imagem ou cadastrar o pet.");
            console.error(error);
        }
    };
    
    const resetFields = () => {
        setNome("");
        setIdade("");
        setSexo("");
        setPorte("");
        setPelagem("");
        setIdealCasa(false);
        setGostaCrianca(false);
        setCaoGuarda(false);
        setBrincalhao(false);
        setNecessidadeCorrer(false);
        setQuedaPelo(false);
        setTendeLatir(false);
        setImagePath("");
    };
    
    const uploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            toast.error("Nenhum arquivo selecionado.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", file);
    
        // Atualiza o estado
        setImagePreSave(formData);
    
        console.log(imagePreSave)
    };

    const handleCheckboxChange = (setter) => (e) => {
        setter(e.target.checked);
    }

    return (
        <AdminArea>
            <ToastContainer />
            <div className="add_pet_area">
                <h1 className="title_add_pet"> ADICIONAR NOVO PET </h1>
                <form onSubmit={(e) => { e.preventDefault(); cadastrarPet(); }}>
                    <div style={{ border: '1px solid black' }}>
                        <div className="area_inputs mt-5">
                            <input type="text" className="form-control" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                            <input type="text" className="form-control" placeholder="Idade" value={idade} onChange={(e) => setIdade(e.target.value)} />
                            <select
                                id="sexo"
                                className="form-control"
                                value={sexo}
                                onChange={(e) => setSexo(e.target.value)}
                            >
                                <option value="" disabled>- Selecione o Sexo: -</option>
                                <option value="macho">Macho</option>
                                <option value="femea">Fêmea</option>
                            </select>

                            <input type="text" className="form-control" placeholder="Porte" value={porte} onChange={(e) => setPorte(e.target.value)} />

                            <select
                                id="pelagem"
                                className="form-control myRed"
                                value={pelagem}
                                onChange={(e) => setPelagem(e.target.value)}
                            >
                                <option value="" disabled>- Selecione o tipo de pelagem: -</option>
                                <option value="curta">Curta</option>
                                <option value="media">Média</option>
                                <option value="longa">Longa</option>
                                <option value="encaracolada">Encaracolada</option>
                                <option value="dura">Dura</option>
                                <option value="sedosa">Sedosa</option>
                                <option value="lanosa">Lanosa</option>
                            </select>
                        </div>

                        <div style={{ textAlign: "left" }} className="mt-3">
                            <ul style={{ listStyle: "none" }}>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={idealCasa} onChange={(e) => setIdealCasa(e.target.checked)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Ideal para casa?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={gostaCrianca} onChange={handleCheckboxChange(setGostaCrianca)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Gosta de crianças?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={caoGuarda} onChange={handleCheckboxChange(setCaoGuarda)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Cão de guarda?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={brincalhao} onChange={handleCheckboxChange(setBrincalhao)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Gosta de brincar?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={necessidadeCorrer} onChange={handleCheckboxChange(setNecessidadeCorrer)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Necessita de correr?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={quedaPelo} onChange={handleCheckboxChange(setQuedaPelo)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Queda de pelo?
                                    </label>
                                </li>
                                <li>
                                    <input className="form-check-input" type="checkbox" checked={tendeLatir} onChange={handleCheckboxChange(setTendeLatir)} />
                                    <label className="form-check-label" htmlFor="gridCheck1">
                                        Tende a latir?
                                    </label>
                                </li>
                                <br />
                                <li>
                                    <div>
                                        <h2>Imagem do Pet:</h2>
                                        <input type="file" onChange={(e) => uploadImage(e)} />
                                        <img style={{ width: 300 }} src={imagePath} />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="area_btn_add mt-3">
                        <button className="btn btn-success">CADASTRAR</button>
                    </div>
                </form>
            </div>
        </AdminArea>
    );
};

export default AddPet;
