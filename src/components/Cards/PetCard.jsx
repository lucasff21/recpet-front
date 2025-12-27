import logo from '../../assets/logo-pet.png';
import React from 'react';

const PetCard = ({ pet, openPagePet }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
      <div className="aspect-square bg-gray-50 relative overflow-hidden">
        <img
          src={pet.imagemPath || logo}
          alt={pet.nome || 'pet'}
          className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = logo;
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <div className="flex flex-col overflow-hidden">
            <h3
              className="text-lg font-bold text-gray-800 truncate pr-2"
              title={pet.nome}
            >
              {pet.nome}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{pet.porte}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`${
                pet.sexo.toLowerCase() === 'macho'
                  ? 'bg-blue-50 text-blue-700 border-blue-100'
                  : 'bg-pink-50 text-pink-700 border-pink-100'
              } border rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide`}
            >
              {pet.sexo}
            </span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 rounded-full px-2.5 py-0.5 text-[10px] font-medium">
              {pet.idade}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <button
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors shadow-sm active:transform active:scale-[0.98]"
            onClick={() => openPagePet(pet.id)}
          >
            Mais detalhes
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
