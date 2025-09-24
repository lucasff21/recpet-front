import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Página não encontrada!
      </h2>
      <p className="text-gray-600">
        A página solicitada não existe. Volte ao{' '}
        <Link to="/" className="text-blue-600 hover:underline">
          Início
        </Link>
        .
      </p>
    </div>
  );
};

export default NotFound;
