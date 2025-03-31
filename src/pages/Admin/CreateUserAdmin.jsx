import {Button} from "../../components/Button";
import {ToastContainer} from "react-toastify";
import {useCreateAdminUserForm} from "../../hooks/useCreateAdminUserForm";
import "../../styles/CreateAccount.css";

const CreateUserAdmin = () => {
    const {
        errors,
        register,
        handleSubmit,
        handleFormSubmit,
        handleClear,
    } = useCreateAdminUserForm();

    return (
        <div className="form-container">
            <header className="form-container-header">
                <h1>Crie um novo usuário</h1>
            </header>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="form">
                <div>
                    <label htmlFor="email">E-mail</label>
                    <input id="email" name="email" {...register("personalData.email")}
                           placeholder="E-mail"/>
                    {errors?.personalData?.email && <span>{errors?.personalData?.email.message}</span>}
                </div>

                <div>
                    <label htmlFor="senha">Senha</label>
                    <input type="password" id="senha"
                           name="senha"
                           {...register("personalData.password")}
                           placeholder="Senha"
                           autoComplete="new-password"
                    />
                    {errors?.personalData?.password && <span>{errors?.personalData?.password.message}</span>}
                </div>

                <h2 className="row-title full-row">Dados Pessoais</h2>

                <div>
                    <label htmlFor="nomeCompleto">Nome Completo</label>
                    <input id="nomeCompleto" name="nomeCompleto" {...register("personalData.fullName")}
                           placeholder="Nome Completo"/>
                    {errors?.personalData?.fullName && <span>{errors?.personalData?.fullName.message}</span>}
                </div>

                <div>
                    <label htmlFor="tipo">Tipo</label>
                    <select id="tipo" name="tipo" {...register("personalData.role")}>
                        <option value="" disabled>Selecione uma função</option>
                        <option value="ADMIN" >Administrador</option>
                        <option value="MODERATOR">Moderador</option>
                    </select>
                    {errors?.personalData?.role && <span>{errors?.personalData?.role.message}</span>}
                </div>


                <div className="full-row buttons-container">
                    <Button text="Cancelar" onClick={handleClear} disabled={false}/>
                    <Button text="Cadastrar" onClick={handleSubmit(handleFormSubmit)} disabled={false}
                            lightMode={false}/>
                </div>
            </form>
            <ToastContainer/>
        </div>
    )
}

export default CreateUserAdmin