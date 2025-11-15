import { z } from 'zod';

const stringToBoolean = z.preprocess((val) => {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}, z.boolean());

export const questionarioSchema = z.object({
  moradia: z.enum(
    [
      'CASA_QUINTAL_TOTALMENTE_FECHADO',
      'CASA_QUINTAL_ABERTO',
      'CASA_SEM_QUINTAL',
      'APARTAMENTO',
    ],
    {
      required_error: 'Selecione o tipo de moradia',
      invalid_type_error: 'Selecione um tipo de moradia válido',
    }
  ),
  telasProtecao: stringToBoolean,
  todosDeAcordo: stringToBoolean,
  qtdCaes: z
    .number({
      required_error: 'Informe a quantidade de cães',
      invalid_type_error: 'Digite um número válido',
    })
    .int('Deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa'),
  qtdGatos: z
    .number({
      required_error: 'Informe a quantidade de gatos',
      invalid_type_error: 'Digite um número válido',
    })
    .int('Deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa'),
  qtdOutros: z
    .number({
      required_error: 'Informe a quantidade de outros animais',
      invalid_type_error: 'Digite um número válido',
    })
    .int('Deve ser um número inteiro')
    .min(0, 'Quantidade não pode ser negativa'),
  cienteCustos: stringToBoolean,
  termoCompromissoLongoPrazo: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar o termo de compromisso de longo prazo',
  }),
  termoSaudeBemEstar: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar o termo de saúde e bem-estar',
  }),
  termoPacienciaAdaptacao: z.boolean().refine((val) => val === true, {
    message: 'Você deve aceitar o termo de paciência e adaptação',
  }),
});

export const defaultValues = {
  moradia: '',
  telasProtecao: false,
  todosDeAcordo: false,
  qtdCaes: 0,
  qtdGatos: 0,
  qtdOutros: 0,
  cienteCustos: false,
  termoCompromissoLongoPrazo: false,
  termoSaudeBemEstar: false,
  termoPacienciaAdaptacao: false,
};
