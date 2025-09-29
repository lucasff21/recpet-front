import { useFieldValidation } from '../../hooks/useFieldValidation';

const RadioGroupField = ({
  id,
  label,
  options,
  register,
  errors,
  colSpan = 1,
  ...props
}) => {
  const { errorMessage, hasError } = useFieldValidation(id, errors);

  return (
    <div className={`${colSpan > 1 ? 'md:col-span-2' : ''}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-col space-y-2">
        {options.map((option) => (
          <div key={option.label} className="flex items-center">
            <input
              type="radio"
              id={`${id}-${option.value}`}
              value={option.value}
              className={`
                h-4 w-4 text-black
                rounded-full
                border-2
                ${hasError ? 'border-red-500' : 'border-gray-300'}
                focus:outline-none
                focus:ring-2 focus:ring-black
                cursor-pointer
              `}
              {...register(id)}
              {...props}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className="ml-2 block text-sm font-medium text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 m-0">{errorMessage}</p>
      )}
    </div>
  );
};

export default RadioGroupField;
