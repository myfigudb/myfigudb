import { z } from 'zod';

export const VoteSchema = z.object({
    token: z.jwt(),
    vote: z.boolean(), // true: Tag valid, false: Tag refused
});
export type VoteDTO = z.infer<typeof VoteSchema>;