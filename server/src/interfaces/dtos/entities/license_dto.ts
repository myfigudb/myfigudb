import {z} from "zod";

import {extendZodWithOpenApi} from "@asteasolutions/zod-to-openapi";
extendZodWithOpenApi(z)

export const createLicenseSchema = z.object({
    name: z.string().min(1).trim(),
})

export type CreateLicenseDTO = z.infer<typeof createLicenseSchema>;