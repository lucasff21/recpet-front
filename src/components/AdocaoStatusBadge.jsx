const AdocaoStatusBadge = ({ status }) => {
  let text, textColor, bgColor;

  switch (status) {
    case 'PENDENTE':
      text = 'PENDENTE';
      textColor = 'text-blue-800';
      bgColor = 'bg-blue-100';
      break;
    case 'EM_ANALISE':
      text = 'EM ANÁLISE';
      textColor = 'text-yellow-800';
      bgColor = 'bg-yellow-100';
      break;
    case 'APROVADO':
      text = 'APROVADO';
      textColor = 'text-green-800';
      bgColor = 'bg-green-100';
      break;
    case 'RECUSADO':
      text = 'RECUSADO';
      textColor = 'text-red-800';
      bgColor = 'bg-red-100';
      break;
    case 'FINALIZADO':
      text = 'FINALIZADO';
      textColor = 'text-purple-800';
      bgColor = 'bg-purple-100';
      break;
    default:
      text = 'DESCONHECIDO';
      textColor = 'text-gray-800';
      bgColor = 'bg-gray-100';
  }

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full ${textColor} ${bgColor}`}
    >
      {text}
    </span>
  );
};

export default AdocaoStatusBadge;
