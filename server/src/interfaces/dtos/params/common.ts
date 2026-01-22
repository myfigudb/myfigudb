import { z } from "zod";

export const paramsIdSchema = z.object({
    id: z.uuid({ message: "Format UUID invalide" })
});

export const paramsNameSchema = z.object({
    name: z.string({ message: "Format String invalide" }).min(1).trim(),
})


