import { z } from 'zod';

export const petSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  idade: z.string().min(1, 'Idade é obrigatória'),
  sexo: z.enum(['MACHO', 'FEMEA']),
  porte: z.enum(['PEQUENO', 'MEDIO', 'GRANDE', 'GIGANTE']),
  pelagem: z.enum([
    'CURTA',
    'MEDIA',
    'LONGA',
    'ENCARACOLADA',
    'DURA',
    'SEDOSA',
    'LANOSA',
  ]),
  idealCasa: z.boolean().default(false),
  gostaCrianca: z.boolean().default(false),
  caoGuarda: z.boolean().default(false),
  brincalhao: z.boolean().default(false),
  necessidadeCorrer: z.boolean().default(false),
  quedaPelo: z.boolean().default(false),
  tendeLatir: z.boolean().default(false),
});
