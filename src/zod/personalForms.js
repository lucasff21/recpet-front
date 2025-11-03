import { z } from 'zod';
import { validateCPF } from '../utils/validateCpf';

export const schemaForm = z
  .object({
    fullName: z.string().nonempty('Nome completo é obrigatório'),
    cpf: z.string().refine((value) => validateCPF(value), 'CPF inválido'),
    gender: z.string().nonempty('Gênero é obrigatório'),
    birthDate: z.string().nonempty('Data de nascimento é obrigatória'),
    phone: z
      .string({ invalid_type_error: 'Celular deve ser uma string' })
      .nonempty('Telefone é obrigatório'),
    email: z.string().nonempty('Email é obrigatório').email('Email inválido.'),
    confirmEmail: z
      .string()
      .nonempty('Email é obrigatório')
      .email('Email inválido.'),
    password: z
      .string()
      .nonempty('Senha é obrigatório')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[\W_]/, 'A senha deve conter pelo menos um símbolo'),
    confirmPassword: z
      .string()
      .nonempty('Senha é obrigatório')
      .min(8, 'A senha deve ter pelo menos 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
      .regex(/[\W_]/, 'A senha deve conter pelo menos um símbolo'),
    zipCode: z
      .string({
        required_error: 'CEP é obrigatório',
        invalid_type_error: 'CEP deve ser uma string',
      })
      .min(8, 'CEP deve conter pelo 8 caracteres'),
    street: z.string().nonempty('Logradouro é obrigatório'),
    complement: z.string().optional(),
    district: z.string().nonempty('Bairro é obrigatório'),
    city: z.string().nonempty('Cidade é obrigatória'),
    state: z.string().nonempty('Estado é obrigatório'),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: 'Emails não coincidem',
    path: ['confirmEmail'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });
