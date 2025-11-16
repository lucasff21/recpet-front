import React from 'react';

const Panel = ({ children, className = '', title = null }) => {
  return (
    <div className={`w-full bg-white p-8 rounded-lg ${className}`}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2">
          {title}
        </h2>
      )}
      {children}
    </div>
  );
};

export default Panel;
