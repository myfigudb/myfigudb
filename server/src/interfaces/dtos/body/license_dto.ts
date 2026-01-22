import {z} from "zod";

export const licenseSchema = z.object({
    name: z.string().min(1).trim(),
})

export type LicenseDTO = z.infer<typeof licenseSchema>;