import InputField from '../FormFields/InputField';

const AddressStep = ({ register, errors, ufs, cities }) => {
  return (
    <>
      <InputField
        id="zipCode"
        label="CEP"
        register={register}
        errors={errors}
        placeholder="CEP"
      />

      <InputField
        id="state"
        label="Estado"
        register={register}
        errors={errors}
        placeholder="Estado"
        disabled
      />

      <InputField
        id="city"
        label="Cidade"
        register={register}
        errors={errors}
        placeholder="Cidade"
        disabled
      />

      <InputField
        id="street"
        label="Logradouro"
        register={register}
        errors={errors}
        placeholder="Logradouro"
      />

      <InputField
        id="district"
        label="Bairro"
        register={register}
        errors={errors}
        placeholder="Bairro"
      />

      <InputField
        id="complement"
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
