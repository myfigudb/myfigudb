import {z} from "zod";

export const licenseShema = z.object({
    name: z.string().min(1).trim(),
})

export type LicenseDTO = z.infer<typeof licenseShema>;