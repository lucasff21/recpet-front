export const Button = ({ text, onClick, disabled, confirm = false }) => {
  const typeClass = confirm
    ? 'text-white bg-cyan-950 hover:bg-cyan-900'
    : 'text-black hover:bg-gray-50 border border-gray-300';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${typeClass} px-6 py-2 rounded-md text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};
