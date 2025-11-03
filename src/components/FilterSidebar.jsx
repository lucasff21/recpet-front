import React, { useState } from 'react';
import FilterAccordion from './FilterAccordion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

const FilterSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  tempFilters,
  handleTempFilterChange,
  handleTemperamentChange,
  applyFilters,
  clearFilters,
  allTemperaments,
  temperamentsLoading,
  temperamentsError,
}) => {
  const [accordionOpen, setAccordionOpen] = useState({
    nome: false,
    porte: true,
    idade: true,
    genero: true,
    temperamento: true,
  });

  const toggleAccordion = (key) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white p-6 lg:p-2 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex-shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
      >
        <h2 className="text-xl font-bold text-gray-800 mb-6 hidden lg:block">
          FILTRE POR
        </h2>
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-800">FILTRE POR</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        <div className="space-y-0">
          <FilterAccordion
            title="NOME"
            isOpen={accordionOpen.nome}
            toggleOpen={() => toggleAccordion('nome')}
          >
            <input
              type="text"
              id="name"
              name="name"
              value={tempFilters.name}
              onChange={handleTempFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
              placeholder="Buscar por nome..."
            />
          </FilterAccordion>

          <FilterAccordion
            title="PORTE"
            isOpen={accordionOpen.porte}
            toggleOpen={() => toggleAccordion('porte')}
          >
            <select
              id="size"
              name="size"
              value={tempFilters.size}
              onChange={handleTempFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
            >
              <option value="">Todos</option>
              <option value="PEQUENO">Pequeno</option>
              <option value="MEDIO">Médio</option>
              <option value="GRANDE">Grande</option>
              <option value="GIGANTE">Gigante</option>
            </select>
          </FilterAccordion>

          <FilterAccordion
            title="IDADE"
            isOpen={accordionOpen.idade}
            toggleOpen={() => toggleAccordion('idade')}
          >
            <select
              id="ageGroup"
              name="ageGroup"
              value={tempFilters.ageGroup}
              onChange={handleTempFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
            >
              <option value="">Todos</option>
              <option value="FILHOTE">Filhote (0-1 ano)</option>
              <option value="ADOLESCENTE">Adolescente (1-3 anos)</option>
              <option value="ADULTO">Adulto (3-8 anos)</option>
              <option value="IDOSO">Idoso (8+ anos)</option>
            </select>
          </FilterAccordion>

          <FilterAccordion
            title="SEXO"
            isOpen={accordionOpen.genero}
            toggleOpen={() => toggleAccordion('genero')}
          >
            <select
              id="gender"
              name="gender"
              value={tempFilters.gender}
              onChange={handleTempFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 mt-2"
            >
              <option value="">Todos</option>
              <option value="MACHO">Macho</option>
              <option value="FEMEA">Fêmea</option>
            </select>
          </FilterAccordion>

          <FilterAccordion
            title="TEMPERAMENTO"
            isOpen={accordionOpen.temperamento}
            toggleOpen={() => toggleAccordion('temperamento')}
          >
            <div className="space-y-2 mt-2">
              {temperamentsLoading ? (
                <div className="flex items-center text-sm text-gray-500">
                  <AiOutlineLoading3Quarters className="animate-spin w-4 h-4 mr-2" />
                  Carregando...
                </div>
              ) : temperamentsError ? (
                <div className="text-sm text-red-600">{temperamentsError}</div>
              ) : (
                allTemperaments.map((char) => (
                  <div key={char.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`temperament-${char.id}`}
                      name={`temperament-${char.nome}`}
                      checked={tempFilters.temperament.includes(char.id)}
                      onChange={(e) =>
                        handleTemperamentChange(char.id, e.target.checked)
                      }
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`temperament-${char.id}`}
                      className="ml-2 text-sm text-gray-900"
                    >
                      {char.nome}
                    </label>
                  </div>
                ))
              )}
            </div>
          </FilterAccordion>
        </div>

        <div className="mt-8 flex flex-col space-y-3">
          <button
            type="submit"
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={clearFilters}
            className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-200"
          >
            Limpar Filtros
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default FilterSidebar;
