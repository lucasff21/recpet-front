const Panel = ({ children, className }) => {
  return (
    <div
      className={`w-full space-y-6 bg-white p-8 rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
};

export default Panel;
