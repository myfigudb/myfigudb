import { z } from "zod";

export const paramsIdSchema = z.object({
    id: z.uuid({ message: "Format UUID invalide" })
});

