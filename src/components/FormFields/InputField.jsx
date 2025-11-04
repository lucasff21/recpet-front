import { useFieldValidation } from '../../hooks/useFieldValidation';
import InputMask from 'react-input-mask';

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
  required = true,
  ...props
}) => {
  const { errorMessage, hasError } = useFieldValidation(id, errors);

  const registerProps = register ? register(id, { required }) : {};

  const commonProps = {
    id: id,
    type: type,
    className: `
      w-full px-4 py-2
      rounded-md
      border-2
      ${hasError ? 'border-red-500' : 'border-gray-300'}
      focus:outline-none
      focus:border-black
      ${className}
    `,
    placeholder: placeholder,
    ...registerProps,
    ...props,
  };

  return (
    <div className={`${colSpan > 1 ? 'md:col-span-2' : ''}`}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      {mask ? (
        <InputMask mask={mask} maskChar={null} {...commonProps}>
          {(inputProps) => <input {...inputProps} />}
        </InputMask>
      ) : (
        <input {...commonProps} />
      )}

      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 m-0">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputField;
