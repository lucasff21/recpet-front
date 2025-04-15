import logo from "../../assets/vira-lata.png";
import React from "react";

const PetCard = ({ pet, openModalPet}) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="h-48 bg-orange-100 flex items-center justify-center">
                <img
                    src={pet.imagePath || logo}
                    alt={pet.nome || "pet"}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
            </div>

            <div className="p-4 ">
                <div className="flex justify-between items-start divide-x-2 divide-gray-100">
                    <div>
                        <p className="text-xl font-bold text-gray-800">{pet.nome}</p>
                        <p className="text-sm text-gray-600 m-0">Raça indefinida</p>
                    </div>

                    <div className="flex-column justify-between items-center pl-2">
                        <p>
                            <span className={
                                `${pet.sexo.toLowerCase() === 'macho' ? 'bg-sky-100 text-sky-800' : 'bg-pink-50 text-pink-800'}
                                  rounded-full px-3 py-1 text-xs font-bold`}>
                                {pet.sexo.toUpperCase()}
                            </span>
                        </p>
                        <p className="text-sm text-center text-gray-700 m-0">
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                                {pet.idade}
                            </span>
                        </p>
                    </div>
                </div>

                <button
                    className="mt-4 w-full w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded transition-colors"
                    onClick={() => openModalPet(pet.id)}
                >
                    Mais detalhes
                </button>
            </div>
        </div>
    );
};

export default PetCard;