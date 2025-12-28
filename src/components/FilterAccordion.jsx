const FilterAccordion = ({ title, children, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-300">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-bold text-black hover:text-blue-700 focus:outline-none transition-colors"
        onClick={toggleOpen}
      >
        <span className="text-sm tracking-wider">{title}</span>
        <span className="text-lg font-bold">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="pb-5 animate-fadeIn">{children}</div>}
    </div>
  );
};

export default FilterAccordion;
