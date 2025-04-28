import { useFieldValidation } from '../../hooks/useFieldValidation';

const InputField = ({
  id,
  label,
  register,
  errors,
  className = '',
  placeholder = '',
  type = 'text',
  colSpan = 1,
  ...props
}) => {
  const { errorMessage, hasError } = useFieldValidation(id, errors);

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
        {...(register ? register(id) : {})}
        {...props}
      />
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 m-0">{errorMessage}</p>
      )}
    </div>
  );
};
export default InputField;
