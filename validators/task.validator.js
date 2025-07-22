import z from "zod";

export const taskValidator = z.object({
    title: z.string().min(1).max(32),
    description: z.string().max(512).optional()
});