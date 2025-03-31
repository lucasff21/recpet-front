import logo from "../assets/vira-lata.png";
import React from "react";

const PetCard = ({ cachorro, openModalPet }) => {
    return (
        <div className="w-64 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="h-48 bg-orange-100 flex items-center justify-center">
                <img
                    src={cachorro.imageUrl || cachorro.imagePath || logo}
                    alt={cachorro.nome || "Cachorro"}
                    className="w-full h-48 object-cover"
                />
            </div>

            <div className="p-4 ">
                <div className="flex justify-between items-start divide-x-2 divide-gray-100">
                    <div>
                        <p className="text-xl font-bold text-gray-800">{cachorro.nome}</p>
                        <p className="text-sm text-gray-600 m-0">Raça indefinida</p>
                    </div>

                    <div className="flex-column justify-between items-start pl-2">
                        <p>
                                <span
                                    className="bg-pink-100 rounded-full px-3 py-1 text-pink-800 text-xs font-semibold">FÊMEA</span>
                        </p>
                        <p className="text-sm text-right text-gray-700 m-0">{cachorro.idade}</p>
                    </div>
                </div>

                <button
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition duration-200"
                    onClick={openModalPet}
                >
                    QUERO ADOTAR
                </button>
            </div>
        </div>
    );
};

export default PetCard;