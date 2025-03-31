import { useContext, useEffect, useState } from "react"
import { findAllAdocoes } from "../../services/ApiAdocao"
import AdminArea from "./AdminArea"
import { AuthContext } from "../../contexts/AuthContext"


const AdocaoArea = () => {

    const [listAdocoes, setListAdocoes] = useState([])
    const { authToken } = useContext(AuthContext)

    console.log("Token no AdocaoArea:", authToken); // Verifique se o token está correto aqui

    useEffect(() => {
        const findAdocoes = async () => {
            try {
                const response = await findAllAdocoes(authToken);

                if (response) {
                    setListAdocoes(response);
                }
            } catch (error) {
                console.error("Error fetching adocoes:", error);
            }
        };

        if (authToken) {
            findAdocoes();
        }
    }, [authToken]);






    console.log(listAdocoes)

    return (
        <AdminArea>
            <h1>Gerenciar de Adoções</h1>

            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Data do pedido</th>
                        <th scope="col">Status</th>
                        <th scope="col">Nome Animal</th>
                        <th scope="col">Adotante</th>

                    </tr>
                </thead>
                <tbody>
                    {listAdocoes.map((adocoes) => (
                        <tr key={adocoes.id}>
                        <td>{adocoes.id ?? ''}</td>
                        <td>{adocoes.dataAdocao ?? ''}</td>
                        <td>{adocoes.status ?? ''}</td>
                        <td>{adocoes.animal?.nome ?? ''}</td>
                        <td>{adocoes.user?.email ?? ''}</td>
                    </tr>
                    ))}


                </tbody>
            </table>


        </AdminArea>
    )
}


export default AdocaoArea 