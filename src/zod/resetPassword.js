import { z } from "zod";

export const resetPassword = z
  .object({
    password: z
      .string()
      .nonempty("Senha é obrigatória")
      .min(8, "A senha deve ter pelo menos 8 caracteres")
      .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
      .regex(/[0-9]/, "A senha deve conter pelo menos um número")
      .regex(/[\W_]/, "A senha deve conter pelo menos um símbolo"),
    confirmPassword: z.string().nonempty("Confirmação de senha é obrigatória"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
