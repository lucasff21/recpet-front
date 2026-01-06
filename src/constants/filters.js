export const filterStatus = {
  TODOS: 'TODOS',
  PENDENTE: 'PENDENTE',
  EM_ANALISE: 'EM_ANALISE',
  APROVADO: 'APROVADO',
  RECUSADO: 'RECUSADO',
  FINALIZADO: 'FINALIZADO',
};

export const filterStatusOptions = [
  { value: filterStatus.TODOS, label: 'Todos' },
  { value: filterStatus.PENDENTE, label: 'Pendente' },
  { value: filterStatus.EM_ANALISE, label: 'Em Análise' },
  { value: filterStatus.APROVADO, label: 'Aprovado' },
  { value: filterStatus.RECUSADO, label: 'Recusado' },
  { value: filterStatus.FINALIZADO, label: 'Finalizado' },
];
