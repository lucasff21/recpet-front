import { z } from 'zod';

// Helper para converter "true"/"false" (string de Radio) para boolean real
const stringToBoolean = z.preprocess((val) => {
  if (typeof val === 'boolean') return val;
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}, z.boolean());

// Helper para converter string numérica em int e validar range
const createScaleSchema = (min, max, label) =>
  z.coerce
    .number({ invalid_type_error: 'Selecione uma opção válida' })
    .int()
    .min(min, `O valor mínimo é ${min}`)
    .max(max, `O valor máximo é ${max}`);

export const questionarioSchema = z.object({
  // --- Preferências (Enums) ---
  preferenciaSexo: z.enum(['MACHO', 'FEMEA', 'INDIFERENTE'], {
    errorMap: () => ({ message: 'Selecione a preferência de sexo' }),
  }),

  temCriancas: z.enum(['NAO', 'CRIANCAS_PEQUENAS', 'CRIANCAS_MAIORES'], {
    errorMap: () => ({ message: 'Selecione sobre o convívio com crianças' }),
  }),

  // --- Escalas (Integers) ---
  preferenciaPorte: createScaleSchema(1, 3, 'Porte'),
  nivelEnergia: createScaleSchema(1, 5, 'Nível de Energia'),
  nivelQuedaPelo: createScaleSchema(1, 5, 'Tolerância a Pelo'),
  nivelLatido: createScaleSchema(1, 5, 'Tolerância a Latido'),
  instintoGuarda: createScaleSchema(1, 5, 'Instinto de Guarda'),

  moradia: z.enum(
    ['KITNET', 'APARTAMENTO_PEQUENO', 'APARTAMENTO_GRANDE', 'CASA_SEM_QUINTAL', 'CASA_COM_QUINTAL'],
    { errorMap: () => ({ message: 'Selecione um tipo de moradia válido' }) }
  ),
   tempoDisponivel: createScaleSchema(1, 5, 'Tempo Disponível'),
  experienciaPets: createScaleSchema(1, 5, 'Experiência'),

  // --- Booleanos de Contexto (Radio Groups ou Checkbox) ---
  possuiCaes: stringToBoolean,
  possuiGatos: stringToBoolean,
  disposicaoNecessidadesEspeciais: stringToBoolean,

  // --- Termos (Devem ser true) ---
  cienteCustos: stringToBoolean.refine((val) => val === true, {
    message: 'Você deve estar ciente dos custos',
  }),

  termoCompromissoLongoPrazo: z.boolean().refine((val) => val === true, {
    message: 'Aceite o compromisso de longo prazo',
  }),
  termoSaudeBemEstar: z.boolean().refine((val) => val === true, {
    message: 'Aceite o termo de saúde e bem-estar',
  }),
  termoPacienciaAdaptacao: z.boolean().refine((val) => val === true, {
    message: 'Aceite o termo de paciência',
  }),
  termoVistoria: z.boolean().refine((val) => val === true, {
    message: 'Aceite o termo de vistoria',
  }),
  termoDevolucaoNaoAbandono: z.boolean().refine((val) => val === true, {
    message: 'Aceite o termo de não abandono',
  }),
  termoLegislacaoPosseResponsavel: z.boolean().refine((val) => val === true, {
    message: 'Aceite o termo de legislação',
  }),
});

export const defaultValues = {
  preferenciaSexo: 'INDIFERENTE',
  temCriancas: 'NAO',
  preferenciaPorte: '2', 
  nivelEnergia: '3',
  nivelQuedaPelo: '3',
  nivelLatido: '3',
  instintoGuarda: '3',
  moradia: '3',
  tempoDisponivel: '3',
  experienciaPets: '1',
  possuiCaes: 'false',
  possuiGatos: 'false',
  disposicaoNecessidadesEspeciais: 'false',
  cienteCustos: 'false',
  termoCompromissoLongoPrazo: false,
  termoSaudeBemEstar: false,
  termoPacienciaAdaptacao: false,
  termoVistoria: false,
  termoDevolucaoNaoAbandono: false,
  termoLegislacaoPosseResponsavel: false,
};