import {z} from "zod";

export const characterSchema = z.object({
    name: z.string().min(1).trim(),
    license_id: z.uuid(),
})

export type LicenseDTO = z.infer<typeof characterSchema>;