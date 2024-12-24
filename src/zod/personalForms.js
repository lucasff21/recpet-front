import { z } from "zod";
import {validateCPF} from "../utils/validateCpf";

export const schemaForm = z.object({
    personalData: z.object({
        fullName: z.string().nonempty("Nome completo é obrigatório"),
        cpf: z.string().length(11, "CPF deve ter 11 dígitos")
            .refine(value => validateCPF(value), "CPF inválido"),
        gender: z.string().nonempty("Gênero é obrigatório"),
        birthDate: z.string().nonempty("Data de nascimento é obrigatória"),
        phone: z.string().min(10, "Celular deve ter pelo menos 10 dígitos"),
        email: z.string().nonempty("Email é obrigatório").email("Email inválido."),
        confirmEmail: z.string().nonempty("Email é obrigatório").email("Email inválido."),
        password: z.string().nonempty("Senha é obrigatório")
            .min(8, 'A senha deve ter pelo menos 8 caracteres')
            .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
            .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
            .regex(/[\W_]/, 'A senha deve conter pelo menos um símbolo'),
        confirmPassword: z.string().nonempty("Senha é obrigatório")
            .min(8, 'A senha deve ter pelo menos 8 caracteres')
            .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
            .regex(/[0-9]/, 'A senha deve conter pelo menos um número')
            .regex(/[\W_]/, 'A senha deve conter pelo menos um símbolo')

    })
    .refine(data => data.email === data.confirmEmail, {
        message: "Emails não coincidem",
        path: ["confirmEmail"],
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    }),
    address: z.object({
        zipCode: z.coerce
            .number({
                required_error: 'CEP é obrigatório',
                invalid_type_error: 'CEP deve conter apenas números',
            })
            .refine((val) => `${val}`.length === 8, 'CEP deve conter 8 dígitos'),
        street: z.string().nonempty("Logradouro é obrigatório"),
        complement: z.string().optional(),
        district: z.string().nonempty("Bairro é obrigatório"),
        city: z.string().nonempty("Cidade é obrigatória"),
        state: z.string().nonempty("Estado é obrigatório"),
    }),
});
