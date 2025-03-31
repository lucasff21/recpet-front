import InputField from "../FormFields/InputField";
import SelectField from "../FormFields/SelectField";

const AddressStep = ({ register, errors, ufs, cities }) => {
    return (
        <>
            <InputField
                id="address.zipCode"
                label="CEP"
                register={register}
                errors={errors}
                placeholder="CEP"
            />

            <SelectField
                id="address.state"
                label="Estado"
                register={register}
                errors={errors}
                options={ufs.map(uf => ({
                    value: uf.sigla,
                    label: uf.nome
                }))}
                placeholder="Selecione um Estado"
            />

            <SelectField
                id="address.city"
                label="Cidade"
                register={register}
                errors={errors}
                options={cities.map(city => ({
                    value: city.nome,
                    label: city.nome
                }))}
                placeholder="Selecione uma cidade"
            />

            <InputField
                id="address.street"
                label="Logradouro"
                register={register}
                errors={errors}
                placeholder="Logradouro"
            />

            <InputField
                id="address.district"
                label="Bairro"
                register={register}
                errors={errors}
                placeholder="Bairro"
            />

            <InputField
                id="address.complement"
                label="Complemento"
                register={register}
                errors={errors}
                placeholder="Complemento"
                required={false}
            />
        </>
    );
};

export default AddressStep;