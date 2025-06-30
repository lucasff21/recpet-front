const FilterAccordion = ({ title, children, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={toggleOpen}
      >
        <span>{title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="pb-4">{children}</div>}
    </div>
  );
};

export default FilterAccordion;
