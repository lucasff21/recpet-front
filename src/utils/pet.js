export function calculateAge(birthDateStr) {
  const today = new Date();
  const birthDate = new Date(birthDateStr);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const daysInLastMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += daysInLastMonth;
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years > 0) {
    const yearText = `${years} ano${years > 1 ? 's' : ''}`;
    const monthText =
      months > 0 ? ` e ${months} ${months > 1 ? 'meses' : 'mês'}` : '';
    return `${yearText}${monthText}`;
  }

  if (months > 0) {
    return `${months} ${months > 1 ? 'meses' : 'mês'}`;
  }

  if (days >= 0) {
    return `${days} dia${days > 1 ? 's' : ''}`;
  }
}
