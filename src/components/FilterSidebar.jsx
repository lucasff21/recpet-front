import React, { useState } from 'react';
import FilterAccordion from './FilterAccordion';

const FilterSidebar = ({
  isSidebarOpen,
  setIsSidebarOpen,
  tempFilters,
  handleTempFilterChange,
  handleMultiSelectChange,
  handleBooleanChange,
  applyFilters,
  clearFilters,
  metadata,
}) => {
  const [accordionOpen, setAccordionOpen] = useState({
    nome: false,
    species: true,
    gender: false,
    porte: false,
    idade: false,
    raca: false,
    cor: false,
    temperamento: true,
    saude: false,
    identificacao: false,
  });

  const toggleAccordion = (key) =>
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const CheckboxList = ({
    items,
    filterName,
    idKey = 'id',
    labelKey = 'nome',
    maxHeight = 'max-h-40',
  }) => (
    <div
      className={`space-y-2 mt-2 ${maxHeight} overflow-y-auto p-1 custom-scrollbar`}
    >
      {items.map((item) => (
        <div key={item[idKey]} className="flex items-center group">
          <input
            type="checkbox"
            id={`${filterName}-${item[idKey]}`}
            checked={tempFilters[filterName].includes(item[idKey])}
            onChange={(e) =>
              handleMultiSelectChange(filterName, item[idKey], e.target.checked)
            }
            className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label
            htmlFor={`${filterName}-${item[idKey]}`}
            className="ml-2 text-sm text-black font-medium cursor-pointer select-none group-hover:text-blue-700 transition-colors"
          >
            {item[labelKey]}
          </label>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white p-6 lg:p-2 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out overflow-y-auto border-r lg:border-none shadow-xl lg:shadow-none`}
      >
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-xl font-bold text-gray-900">FILTRE POR</h2>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-500"
          >
            ✕
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
              name="name"
              value={tempFilters.name}
              onChange={handleTempFilterChange}
              className="w-full p-2 border border-gray-500 rounded-md text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white text-black placeholder-gray-500 shadow-sm"
              placeholder="Buscar por nome..."
            />
          </FilterAccordion>

          <FilterAccordion
            title="ESPÉCIE"
            isOpen={accordionOpen.species}
            toggleOpen={() => toggleAccordion('species')}
          >
            <select
              name="species"
              value={tempFilters.species}
              onChange={handleTempFilterChange}
              className="w-full p-2 border border-gray-500 rounded-md text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white text-black shadow-sm cursor-pointer"
            >
              <option value="">Todas</option>
              <option value="GATO">Gato</option>
              <option value="CACHORRO">Cachorro</option>
            </select>
          </FilterAccordion>

          <FilterAccordion
            title="SEXO"
            isOpen={accordionOpen.gender}
            toggleOpen={() => toggleAccordion('gender')}
          >
            <CheckboxList
              items={[
                { id: 'MACHO', nome: 'Macho' },
                { id: 'FEMEA', nome: 'Fêmea' },
              ]}
              filterName="gender"
            />
          </FilterAccordion>

          <FilterAccordion
            title="PORTE"
            isOpen={accordionOpen.porte}
            toggleOpen={() => toggleAccordion('porte')}
          >
            <CheckboxList
              items={[
                { id: 'PEQUENO', nome: 'Pequeno' },
                { id: 'MEDIO', nome: 'Médio' },
                { id: 'GRANDE', nome: 'Grande' },
                { id: 'GIGANTE', nome: 'Gigante' },
              ]}
              filterName="size"
            />
          </FilterAccordion>

          <FilterAccordion
            title="FAIXA ETÁRIA"
            isOpen={accordionOpen.idade}
            toggleOpen={() => toggleAccordion('idade')}
          >
            <CheckboxList
              items={[
                { id: 'FILHOTE', nome: 'Filhote (0-1 ano)' },
                { id: 'ADOLESCENTE', nome: 'Adolescente (1-3 anos)' },
                { id: 'ADULTO', nome: 'Adulto (3-8 anos)' },
                { id: 'IDOSO', nome: 'Idoso (8+ anos)' },
              ]}
              filterName="ageGroup"
            />
          </FilterAccordion>

          <FilterAccordion
            title="RAÇA"
            isOpen={accordionOpen.raca}
            toggleOpen={() => toggleAccordion('raca')}
          >
            <CheckboxList
              items={metadata.racas.filter(
                (r) => !tempFilters.species || r.especie === tempFilters.species
              )}
              filterName="racaId"
            />
          </FilterAccordion>

          <FilterAccordion
            title="COR"
            isOpen={accordionOpen.cor}
            toggleOpen={() => toggleAccordion('cor')}
          >
            <CheckboxList items={metadata.cores} filterName="corId" />
          </FilterAccordion>

          <FilterAccordion
            title="TEMPERAMENTO"
            isOpen={accordionOpen.temperamento}
            toggleOpen={() => toggleAccordion('temperamento')}
          >
            <CheckboxList
              items={metadata.caracteristicas}
              filterName="temperament"
            />
          </FilterAccordion>

          <FilterAccordion
            title="SAÚDE"
            isOpen={accordionOpen.saude}
            toggleOpen={() => toggleAccordion('saude')}
          >
            <div className="space-y-2 mt-2 p-1">
              <div className="flex items-center group">
                <input
                  type="checkbox"
                  id="filter-castrado"
                  checked={tempFilters.castrado === 'true'}
                  onChange={(e) =>
                    handleBooleanChange('castrado', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="filter-castrado"
                  className="ml-2 text-sm text-black font-medium cursor-pointer select-none group-hover:text-blue-700 transition-colors"
                >
                  Castrado
                </label>
              </div>
              <div className="flex items-center group">
                <input
                  type="checkbox"
                  id="filter-vacinado"
                  checked={tempFilters.vacinado === 'true'}
                  onChange={(e) =>
                    handleBooleanChange('vacinado', e.target.checked)
                  }
                  className="h-4 w-4 text-blue-600 border-gray-500 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="filter-vacinado"
                  className="ml-2 text-sm text-black font-medium cursor-pointer select-none group-hover:text-blue-700 transition-colors"
                >
                  Vacinado
                </label>
              </div>
            </div>
          </FilterAccordion>

          <FilterAccordion
            title="MICROCHIP"
            isOpen={accordionOpen.identificacao}
            toggleOpen={() => toggleAccordion('identificacao')}
          >
            <input
              type="text"
              name="microchip"
              value={tempFilters.microchip}
              onChange={handleTempFilterChange}
              className="w-full p-2 border border-gray-500 rounded-md text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none bg-white text-black placeholder-gray-500 shadow-sm"
              placeholder="Número do Microchip..."
            />
          </FilterAccordion>
        </div>

        <div className="mt-8 space-y-3">
          <button
            onClick={applyFilters}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md font-semibold hover:bg-blue-700 transition shadow-md active:scale-[0.98]"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={clearFilters}
            className="w-full bg-white border border-gray-500 text-black py-2 rounded-md font-medium hover:bg-gray-100 transition active:scale-[0.98]"
          >
            Limpar Filtros
          </button>
        </div>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};
export default FilterSidebar;
