const Panel = ({ children, className }) => {
  return (
    <div className={`w-full space-y-4 bg-white p-8 rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Panel;
