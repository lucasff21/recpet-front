import { useFieldValidation } from '../../hooks/useFieldValidation';

const formatCPF = (value) => {
  return value
    .replace(/\D/g, '')                 // só números
    .replace(/(\d{3})(\d)/, '$1.$2')    
    .replace(/(\d{3})(\d)/, '$1.$2')    
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

const cleanCPF = (value) => value.replace(/\D/g, ''); // só números

const InputField = ({
  id,
  label,
  register,
  errors,
  className = '',
  placeholder = '',
  type = 'text',
  colSpan = 1,
  mask,
  ...props
}) => {
  const { errorMessage, hasError } = useFieldValidation(id, errors);

  const registered = register
    ? register(id, {
        setValueAs: (v) => (mask === 'cpf' ? cleanCPF(v) : v), // valor limpo vai para o form
        onChange: (e) => {
          if (mask === 'cpf') {
            e.target.value = formatCPF(e.target.value); // exibe formatado
          }
        },
      })
    : {};

  return (
    <div className={`${colSpan > 1 ? 'md:col-span-2' : ''}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <input
        id={id}
        type={type}
        className={`
          w-full px-4 py-2
          rounded-md
          border-2
          ${hasError ? 'border-red-500' : 'border-gray-300'}
          focus:outline-none
          focus:border-black
          ${className}
        `}
        placeholder={placeholder}
        {...registered}
        {...props}
      />

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 m-0">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
