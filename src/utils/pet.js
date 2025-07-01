export function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0 && months > 0) {
    return `${years} ano${years > 1 ? 's' : ''} e ${months} ano${months > 1 ? 's' : ''}`;
  } else if (years > 0) {
    return `${years} ano${years > 1 ? 's' : ''}`;
  } else {
    return `${months} ${months > 1 ? 'meses' : 'mês'}`;
  }
}
