import InputField from "../FormFields/InputField";

const AccountStep = ({ register, errors }) => {
    return (
        <>
            <InputField
                id="email"
                label="E-mail"
                register={register}
                errors={errors}
                type="email"
                placeholder="example@gmail.com"
                colSpan={2}
            />

            <InputField
                id="confirmEmail"
                label="Confirmar E-mail"
                register={register}
                errors={errors}
                type="email"
                placeholder="example@gmail.com"
                colSpan={2}
            />

            <InputField
                id="password"
                label="Senha"
                register={register}
                errors={errors}
                type="password"
                placeholder="Senha"
                autoComplete="new-password"
            />

            <InputField
                id="confirmPassword"
                label="Confirmar Senha"
                register={register}
                errors={errors}
                type="password"
                placeholder="Confirme sua Senha"
                autoComplete="new-password"
            />
        </>
    );
};

export default AccountStep;