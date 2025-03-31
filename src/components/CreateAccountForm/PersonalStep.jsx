import InputField from "../FormFields/InputField";
import SelectField from "../FormFields/SelectField";
import DateField from "../FormFields/DateField";

const PersonalStep = ({ register, errors, minDate }) => {
    return (
        <>
            <InputField
                id="personalData.fullName"
                label="Nome Completo"
                register={register}
                errors={errors}
                colSpan={2}
                placeholder="Nome Completo"
            />

            <InputField
                id="personalData.cpf"
                label="CPF"
                register={register}
                errors={errors}
                placeholder="CPF"
            />

            <SelectField
                id="personalData.gender"
                label="Gênero"
                register={register}
                errors={errors}
                options={[
                    { value: "Feminino", label: "Feminino" },
                    { value: "Masculino", label: "Masculino" },
                    { value: "Prefiro não dizer", label: "Prefiro não dizer" }
                ]}
            />

            <DateField
                id="personalData.birthDate"
                label="Data de Nascimento"
                register={register}
                errors={errors}
                max={minDate}
            />

            <InputField
                id="personalData.phone"
                label="Celular"
                register={register}
                errors={errors}
                placeholder="Celular"
            />
        </>
    );
};

export default PersonalStep;