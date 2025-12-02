import { z } from 'zod';

const imageSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, { message: 'Imagem é obrigatória' })
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    // Limite de 5MB
    message: 'Imagem deve ter no máximo 5MB',
  })
  .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
    message: 'Apenas arquivos JPEG ou PNG são aceitos',
  });

export const basePetSchema = z.object({
  nome: z
    .string()
    .min(1, { message: 'Nome não pode ser vazio' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),
  tipo: z.enum(['CACHORRO', 'GATO'], {
    errorMap: () => ({ message: 'Tipo inválido' }),
  }),
  dataNascimentoAproximada: z
    .string()
    .min(1, { message: 'Idade não pode ser vazia' }),
  sexo: z.enum(['MACHO', 'FEMEA'], {
    errorMap: () => ({ message: 'Sexo deve ser MACHO ou FEMEA' }),
  }),
  porte: z.enum(['PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE'], {
    errorMap: () => ({ message: 'Porte inválido' }),
  }),
  pelagem: z.enum(
    ['CURTA', 'MEDIA', 'LONGA', 'ENCARACOLADA', 'DURA', 'SEDOSA', 'LANOSA'],
    {
      errorMap: () => ({ message: 'Pelagem inválida' }),
    }
  ),
  descricao: z
    .string()
    .max(1000, { message: 'Descrição deve ter no máximo 1000 caracteres' })
    .optional()
    .nullable(),
  caracteristicasIds: z
    .array(z.string().transform(Number))
    .optional()
    .nullable(),
  disponivelParaAdocao: z.string().transform((str) => {
    return str.toLowerCase() !== 'false';
  }),

  castrado: z.string().transform((str) => {
    return str.toLowerCase() !== 'false';
  }),
  dataUltimaVermifugacao: z.string().optional().nullable(),
  dataUltimaVacinaAntirrabica: z.string().optional().nullable(),
  dataUltimaVacinaMultipla: z.string().optional().nullable(),
  tipoVacinaMultipla: z
    .string()
    .max(10, { message: 'Tipo da vacina deve ter no máximo 10 caracteres' })
    .optional()
    .nullable(),
  observacoesMedicas: z
    .string()
    .max(2000, { message: 'Observações deve ter no máximo 2000 caracteres' })
    .optional()
    .nullable(),
  raca: z
    .string()
    .max(20, { message: 'Raça deve ter no máximo 20 caracteres' })
    .optional()
    .nullable(),
  rgAnimal: z
    .string()
    .max(20, { message: 'RG do animal deve ter no máximo 20 caracteres' })
    .optional()
    .nullable(),
  microchipId: z
    .string()
    .max(20, { message: 'Microchip deve ter no máximo 20 caracteres' })
    .optional()
    .nullable(),
  privateInfo: z
    .string()
    .max(2000, {
      message: 'Informações privadas deve ter no máximo 2000 caracteres',
    })
    .optional()
    .nullable(),
});

export const petSchema = basePetSchema.extend({
  imagem: imageSchema.optional(),
});

export const petUpdateSchema = basePetSchema
  .extend({
    novaImagem: imageSchema.optional(),
  })
  .partial();
