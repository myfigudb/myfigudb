import { pclient } from "../../../core/config/prisma.js";
import { Character, Prisma } from "../../../generated/prisma/client.js";

export class CharacterRepository {

    /**
     * Retrieve a Character by its unique ID.
     * @returns The Character or null if not found.
     */
    async getById(id: string): Promise<Character | null> {
        return pclient.character.findUnique({
            where: { id },
            include: {
                medias: true
            }
        });
    }

    async getAll(): Promise<Character[]> {
        return pclient.character.findMany({
            include: {
                medias: {
                    take: 1,
                }
            }
        });
    }

    /**
     * Retrieve a Character by its unique Name.
     * @returns The Character or null if not found.
     */
    async getByName(name: string): Promise<Character[] | null> {
        return pclient.character.findMany({
            where: { name },
            include: {
                medias: true
            }
        });
    }

    async create(data: Prisma.CharacterUncheckedCreateInput): Promise<Character> {
        return pclient.character.create({
            data: data
        });
    }

    /**
     * Update an existing Character.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async update(id: string, data: Prisma.CharacterUpdateInput): Promise<Character> {
        return pclient.character.update({
            where: { id },
            data: data,
            include: {
                medias: true
            }
        });
    }

    /**
     * Delete a Character.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async delete(id: string): Promise<Character> {
        return pclient.character.delete({
            where: { id }
        });
    }

    /**
     * Check if a Character exists by its ID.
     *
     * NOTE: To use with parsimony to prevent double queries.
     * @param id
     */
    async exists(id: string): Promise<boolean> {
        const count = await pclient.character.count({
            where: { id }
        });
        return count > 0;
    }


    /**
     * Find Characters with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("character"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("Character")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 1)
     */
    async getBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Character[]> {
        return pclient.$queryRaw<Character[]>`
            SELECT *
            FROM "character"
            WHERE similarity(name, ${name}) > ${threshold}
            LIMIT ${limit};
        `;
    }

    async attachMedias(id: string, media_hashes: string[]): Promise<Character> {
        return pclient.character.update({
            where: { id },
            data: {
                medias: {
                    connect: media_hashes.map(hash => ({ hash }))
                }
            },
            include: {
                medias: true
            }
        });
    }
}