import { z } from 'zod';

export const schemaForm = z.object({
  personalData: z.object({
    fullName: z.string().nonempty('Nome completo é obrigatório'),
    email: z.string().nonempty('Email é obrigatório').email('Email inválido.'),
    role: z.string().nonempty('Tipo é obrigatório'),
    password: z
      .string()
      .nonempty('Senha é obrigatório')
      .min(8, 'A senha deve ter pelo menos 8 caracteres'),
  }),
});
