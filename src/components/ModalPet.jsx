import { Modal, Button, Spinner } from 'react-bootstrap';
import logo from '../assets/vira-lata.png';

const ModalPet = ({show, onHide, pet: selectedPet, onAdopt, authToken}) => {
    const traits = [
        { key: 'brincalhao', label: 'Brincalhão', color: 'blue' },
        { key: 'gostaCrianca', label: 'Bom com crianças', color: 'green' },
        { key: 'caoGuarda', label: 'Cão de guarda', color: 'yellow' },
        { key: 'idealCasa', label: 'Ideal para casa', color: 'purple' },
        { key: 'necessidadeCorrer', label: 'Precisa de exercícios', color: 'indigo' },
        { key: 'quedaPelo', label: 'Solta muito pelo', color: 'amber' },
        { key: 'tendeLatir', label: 'Gosta de latir', color: 'red' }
    ];

    return (
        <Modal show={show} onHide={onHide} centered size="lg" className="max-w-full">
            <Modal.Header closeButton className="border-b p-4 bg-gray-50">
                {selectedPet && (
                    <div className="flex items-center space-x-4">
                        <Modal.Title className="text-gray-800 font-bold text-lg md:text-xl">
                            {selectedPet.nome}
                        </Modal.Title>
                    </div>
                )}
            </Modal.Header>

            <Modal.Body className="p-0">
                {selectedPet ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div className="hidden md:block h-48 md:h-80 flex items-center justify-center p-4 md:p-6">
                                <img
                                    src={selectedPet.imagePath || logo}
                                    alt={selectedPet.nome}
                                    className="w-full h-full max-h-80 object-cover border-2 border-amber-400 rounded-lg shadow-md"
                                />
                            </div>

                            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                                <div className="space-y-3">
                                    <h3 className="text-base md:text-lg font-bold text-gray-800 border-b pb-2">Sobre</h3>
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500 m-0">Raça</p>
                                                <p className="font-medium text-sm md:text-base">
                                                    {selectedPet.raca || 'SRD (Sem Raça Definida)'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 m-0">Idade</p>
                                                <p className="font-medium text-sm md:text-base">
                                                    {selectedPet.idade}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-1 md:space-y-2">
                                            <div>
                                                <p className="text-xs text-gray-500 m-0">Sexo</p>
                                                <p className={`font-medium text-sm md:text-base ${
                                                    selectedPet.sexo?.toLowerCase() === 'macho'
                                                        ? 'text-blue-600'
                                                        : 'text-pink-600'
                                                }`}>
                                                    {selectedPet.sexo}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 m-0">Porte</p>
                                                <p className="font-medium text-sm md:text-base">
                                                    {selectedPet.porte}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <h3 className="text-base md:text-lg font-bold text-gray-800 border-b pb-2">
                                        Descrição
                                    </h3>
                                    <p className="text-gray-700 text-sm md:text-base mt-2 mb-0">
                                        {selectedPet.descricao || 'Este pet ainda não tem uma descrição cadastrada. Entre em contato para conhecer melhor suas características.'}
                                    </p>
                                </div>


                            </div>
                            <div className="p-4 pt-0 md:p-6z space-y-2 col-span-2">
                                <h3 className="text-base md:text-lg font-bold text-gray-800 border-b pb-2">
                                    Personalidade
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {traits.map(trait => (
                                        selectedPet[trait.key] === true && (
                                            <span
                                                key={trait.key}
                                                className={`bg-${trait.color}-100 text-${trait.color}-800 px-2 py-1 rounded-full text-xs md:text-sm`}
                                            >
                                                {trait.label}
                                            </span>
                                        )
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center p-8">
                        <Spinner animation="border" variant="primary"/>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer className="bg-gray-50 border-t p-4">
                <Button
                    variant="outline-secondary"
                    onClick={onHide}
                    className="px-4 py-1 md:px-6 md:py-2 text-sm md:text-base"
                >
                    Fechar
                </Button>
                <Button
                    variant="primary"
                    onClick={onAdopt}
                    className='px-4 py-1 md:px-6 md:py-2 text-sm md:text-base'>
                    {authToken ? 'Tenho Interesse' : 'Faça login para adotar'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalPet;