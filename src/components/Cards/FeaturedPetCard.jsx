import logo from '../../assets/vira-lata.png';

const FeaturedPetCard = ({ pet, openModalPet }) => {
  const traits = [
    { key: 'brincalhao', label: 'Brincalhão', color: 'blue' },
    { key: 'gostaCrianca', label: 'Bom com crianças', color: 'green' },
    { key: 'caoGuarda', label: 'Cão de guarda', color: 'yellow' },
    { key: 'idealCasa', label: 'Ideal para casa', color: 'purple' },
    {
      key: 'necessidadeCorrer',
      label: 'Precisa de exercícios',
      color: 'indigo',
    },
    { key: 'quedaPelo', label: 'Solta muito pelo', color: 'amber' },
    { key: 'tendeLatir', label: 'Gosta de latir', color: 'red' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
  };
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border-2 border-amber-400 hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 md:h-56 overflow-hidden">
        <img
          src={pet.imagePath || logo}
          alt={pet.nome}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />

        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {pet.porte && (
            <span className="bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
              {pet.porte}
            </span>
          )}
          {pet.sexo && (
            <span
              className={`bg-white/90 text-gray-800 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm ${
                pet.sexo.toLowerCase() === 'macho'
                  ? 'text-blue-600'
                  : 'text-pink-600'
              }`}
            >
              {pet.sexo}
            </span>
          )}
          {pet.brincalhao && (
            <span className="bg-white/90 text-amber-600 text-xs font-medium px-2 py-1 rounded-full backdrop-blur-sm">
              Brincalhão
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-gray-800">{pet.nome}</h2>
          {pet.idade && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
              {pet.idade}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {traits.map(
            (trait) =>
              pet[trait.key] === true && (
                <span
                  key={trait.key}
                  className={`${colorClasses[trait.color]} px-2 py-1 rounded-full text-xs md:text-sm`}
                >
                  {trait.label}
                </span>
              )
          )}
        </div>

        <button
          onClick={() => openModalPet(pet.id)}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Mais detalhes
        </button>
      </div>
    </div>
  );
};

export default FeaturedPetCard;
