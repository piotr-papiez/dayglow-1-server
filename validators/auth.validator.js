import z from "zod";

export const registerValidator = z.object({
    name: z.string().min(2).max(16),
    mail: z.email(),
    password: z.string().min(5).max(32)
});

export const loginValidator = z.object({
    mail: z.email(),
    password: z.string().min(5).max(32)
});