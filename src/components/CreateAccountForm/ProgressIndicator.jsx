const ProgressIndicator = ({ currentStep, goToStep }) => {
  const steps = [
    { number: 1, label: 'Conta' },
    { number: 2, label: 'Dados pessoais' },
    { number: 3, label: 'Endereço' },
  ];

  return (
    <div className="relative mb-10">
      {/* Desktop version */}
      <div className="hidden md:flex justify-between relative">
        <div className="absolute top-16 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
        <div
          className="absolute top-1/2 left-0 h-0.5 bg-green-600 -translate-y-1/2 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>

        {steps.map((step) => (
          <div
            key={step.number}
            className="flex flex-col items-center relative z-10 cursor-pointer"
            onClick={() => goToStep(step.number)}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold 
                            ${currentStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {step.number}
            </span>
            <p
              className={`text-sm ${currentStep >= step.number ? 'text-green-600 font-medium' : 'text-gray-500'}`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile version */}
      <div className="md:hidden space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`flex items-center p-3 rounded-lg cursor-pointer ${currentStep === step.number ? 'bg-blue-50' : ''}`}
            onClick={() => goToStep(step.number)}
          >
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-bold 
                            ${currentStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {step.number}
            </span>
            <p
              className={`m-0 ${currentStep >= step.number ? 'text-green-600 font-medium' : 'text-gray-500'}`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
