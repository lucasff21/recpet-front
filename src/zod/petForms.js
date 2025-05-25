import { z } from 'zod';

export const basePetSchema = z.object({
  nome: z
    .string()
    .min(1, { message: 'Nome não pode ser vazio' })
    .max(100, { message: 'Nome deve ter no máximo 100 caracteres' }),

  idade: z.string().min(1, { message: 'Idade não pode ser vazia' }),

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

  idealCasa: z.boolean(),
  gostaCrianca: z.boolean(),
  caoGuarda: z.boolean(),
  brincalhao: z.boolean(),
  necessidadeCorrer: z.boolean(),
  quedaPelo: z.boolean(),
  tendeLatir: z.boolean(),
});

export const petSchema = basePetSchema.extend();

export const petUpdateSchema = basePetSchema
  .extend({
    novaImagem: z
      .instanceof(File)
      .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
        message: 'Apenas arquivos JPEG ou PNG são aceitos',
      })
      .optional(),
  })
  .partial();
