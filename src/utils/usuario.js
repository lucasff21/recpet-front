export const calculateHumanAge = (dataNascimento) => {
  if (!dataNascimento) return 'Não informada';

  const birthDate = new Date(dataNascimento + 'T00:00:00');
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return `${age} anos`;
};
