import AdminArea from "./AdminArea";

const AddPet = () => {
    return (
        <AdminArea>
            <div className="add_pet_area">
                <h1 className="title_add_pet"> ADICIONAR NOVO PET </h1>
                <div className="area_inputs mt-5">
                    <input type="text" className="form-control" placeholder="Nome" />
                    <input type="text" className="form-control" placeholder="Idade" />
                    <input type="text" className="form-control" placeholder="Sexo" />
                    <input type="text" className="form-control" placeholder="Porte" />


                    <select className="form-control">
                        <option>Opção 1</option>
                        <option>Opção 2</option>
                        <option>Opção 3</option>
                        <option>Opção 4</option>
                        <option>Opção 5</option>
                    </select>
                </div>

                <div style={{ textAlign: "left" }} className="mt-3">
                    <ul style={{listStyle: "none"}}>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Ideal para casa?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Gosta de crianças?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Cão de guarda?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Gosta de brincar?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Necessidade de correr?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Queda de pelo?
                            </label>
                        </li>
                        <li>
                            <input className="form-check-input" type="checkbox" />
                            <label className="form-check-label" for="gridCheck1">
                                Tende a latir?
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </AdminArea>

    )
}


export default AddPet;