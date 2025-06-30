import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import React from 'react';

export const Button = ({
  text,
  onClick,
  disabled = false,
  confirm = false,
  children,
  loading = false,
  icon = null,
}) => {
  const typeClass = confirm
    ? 'text-white bg-cyan-950 hover:bg-cyan-900'
    : 'text-black hover:bg-gray-50 border border-gray-300';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${typeClass} 
        text-center px-6 py-2 rounded-md text-gray-700
        h-10 w-48 flex items-center justify-center gap-2 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
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
