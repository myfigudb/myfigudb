import { z } from "zod";

export const paramsIdSchema = z.object({
    id: z.uuid({ message: "Format UUID invalide" })
});
export type ParamsIdDTO = z.infer<typeof paramsIdSchema>;


export const paramsNameSchema = z.object({
    name: z.string({ message: "Format String invalide" }).min(1).trim(),
})
export type ParamsNameDTO = z.infer<typeof paramsNameSchema>;


