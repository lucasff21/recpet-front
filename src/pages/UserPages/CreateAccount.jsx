import "../../styles/CreateAccount.css";
import Layout from "../../components/Layout";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from "../../components/Button";
import { usePersonalForm } from "../../hooks/usePersonalForm.js";

const CreateAccount = () => {

    const {
        errors,
        register,
        handleSubmit,
        handleFormSubmit,
        handleClear
    } = usePersonalForm();

    const minDate18YearsOld = () => {
        const today = new Date();
        today.setFullYear(today.getFullYear() - 18);
        return today.toISOString().split('T')[0];
    };

    return (
        <Layout showFooter={true}>
            <div style={{background: '#EFC483', width: '60vw', maxWidth: '800px', borderRadius: '30px'}}>
                <header style={{background: '#ECAC4C', padding: '10px', textAlign: 'center', borderRadius: '30px'}}>
                    <h1>Crie sua conta</h1>
                </header>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="form-container">
                    <div>
                        <label htmlFor="email">E-mail</label>
                        <input id="email" name="email" {...register("personalData.email")} placeholder="E-mail"/>
                        {errors?.personalData?.email && <span>{errors?.personalData?.email.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="confirmarEmail">Confirmar E-mail</label>
                        <input id="confirmarEmail" name="confirmarEmail" {...register("personalData.confirmEmail")}
                               placeholder="Confirme seu E-mail"/>
                        {errors?.personalData?.confirmEmail &&
                            <span>{errors?.personalData?.confirmEmail.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="senha">Senha</label>
                        <input type="password" id="senha" name="senha" {...register("personalData.password")}
                               placeholder="Senha"/>
                        {errors?.personalData?.password && <span>{errors?.personalData?.password.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="confirmarSenha">Confirmar Senha</label>
                        <input type="password" id="confirmarSenha"
                               name="confirmarSenha" {...register("personalData.confirmPassword")}
                               placeholder="Confirme sua Senha"/>
                        {errors?.personalData?.confirmPassword &&
                            <span>{errors?.personalData?.confirmPassword.message}</span>}
                    </div>

                    <h2 className="row-title full-row">Dados Pessoais</h2>

                    <div>
                        <label htmlFor="nomeCompleto">Nome Completo</label>
                        <input id="nomeCompleto" name="nomeCompleto" {...register("personalData.fullName")}
                               placeholder="Nome Completo"/>
                        {errors?.personalData?.fullName && <span>{errors?.personalData?.fullName.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="cpf">CPF</label>
                        <input id="cpf" name="cpf" {...register("personalData.cpf")} placeholder="CPF"/>
                        {errors?.personalData?.cpf && <span>{errors?.personalData?.cpf.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="genero">Gênero</label>
                        <input id="genero" name="genero" {...register("personalData.gender")} placeholder="Gênero"/>
                        {errors?.personalData?.gender && <span>{errors?.personalData?.gender.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="dataNascimento">Data de Nascimento</label>
                        <input type="date" id="dataNascimento"
                               name="dataNascimento" {...register("personalData.birthDate")} max={minDate18YearsOld()}/>
                        {errors?.personalData?.birthDate && <span>{errors?.personalData?.birthDate.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="celular">Celular</label>
                        <input id="celular" name="celular" {...register("personalData.phone")} placeholder="Celular"/>
                        {errors?.personalData?.phone && <span>{errors?.personalData?.phone.message}</span>}
                    </div>

                    <h2 className="row-title full-row">Endereço</h2>

                    <div>
                        <label htmlFor="cep">CEP</label>
                        <input id="cep" name="cep" {...register("address.zipCode")} placeholder="CEP" maxLength="8"/>
                        {errors?.address?.zipCode && <span>{errors?.address?.zipCode.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="logradouro">Logradouro</label>
                        <input id="logradouro" name="logradouro" {...register("address.street")}
                               placeholder="Logradouro"/>
                        {errors?.address?.street && <span>{errors?.address?.street.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="complemento">Complemento</label>
                        <input id="complemento" name="complemento" {...register("address.complement")}
                               placeholder="Complemento"/>
                    </div>

                    <div>
                        <label htmlFor="bairro">Bairro</label>
                        <input id="bairro" name="bairro" {...register("address.district")} placeholder="Bairro"/>
                        {errors?.address?.district && <span>{errors?.address?.district.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="cidade">Cidade</label>
                        <input id="cidade" name="cidade" {...register("address.city")} placeholder="Cidade"/>
                        {errors?.address?.city && <span>{errors?.address?.city.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="estado">Estado</label>
                        <input id="estado" name="estado" {...register("address.state")} placeholder="Estado"/>
                        {errors?.address?.state && <span>{errors?.address?.state.message}</span>}
                    </div>

                    <div className="full-row buttons-container">
                        <Button text="Limpar Campos" onClick={handleClear} disabled={false}/>
                        <Button text="Cancelar" onClick={handleFormSubmit} disabled={false}/>
                        <Button text="Cadastrar" onClick={handleSubmit(handleFormSubmit)} disabled={false}
                                lightMode={false}/>
                    </div>
                </form>

            </div>
            <ToastContainer/>
        </Layout>
    );
}

export default CreateAccount;