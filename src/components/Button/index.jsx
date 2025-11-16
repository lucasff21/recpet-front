import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const Button = ({
  text,
  onClick,
  disabled = false,
  confirm = false,
  children,
  loading = false,
  icon = null,
  size = 'full',
  type,
  className = '',
}) => {
  const isDisabled = disabled || loading;

  const typeClass = confirm
    ? 'text-white bg-cyan-950 hover:bg-cyan-900'
    : 'text-black hover:bg-gray-50 border border-gray-300';

  const sizeClasses = {
    small: 'px-4 py-1 text-sm h-8 w-48',
    medium: 'px-6 py-2 text-base h-10 w-64',
    big: 'px-8 py-3 text-lg h-12 w-80',
    full: 'px-6 py-2 text-base h-10 w-full',
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${typeClass} 
        ${sizeClasses[size]} 
        text-center px-6 py-2 rounded-md text-gray-700
        h-10 flex items-center justify-center gap-2 
        ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
        `}
      type={type}
    >
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {text || children}
        </>
      )}
    </button>
  );
};
