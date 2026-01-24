import {pclient} from "../../config/prisma.js";

import {Character, Prisma} from "../../generated/prisma/client.js";


export class CharacterService {

    /**
     * Retrieve a Character by its unique ID.
     * @returns The Character or null if not found.
     */
    async getCharacterById(id: string): Promise<Character | null> {
        return pclient.character.findUnique({
            where: { id },
            include : {
                medias: true
            }
        });
    }

    async getAllCharacters(): Promise<Character[]> {
        return pclient.character.findMany();
    }

    /**
     * Retrieve a Character by its unique Name.
     * @returns The Character or null if not found.
     */
    async getCharacterByName(name: string): Promise<Character[] | null> {
        return pclient.character.findMany({
            where: { name },
            include : {
                medias: true
            }
        });
    }

    async createCharacter(data: Prisma.CharacterUncheckedCreateInput): Promise<Character> {
        return pclient.character.create({
            data: data
        });
    }

    /**
     * Update an existing Character.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async updateCharacter(id: string, data: Prisma.CharacterUpdateInput): Promise<Character> {
        return pclient.character.update({
            where: { id },
            data: data,
            include : {
                medias: true
            }
        });
    }

    /**
     * Delete a Character.
     * @throws {Prisma.PrismaClientKnownRequestError} If the ID does not exist.
     */
    async deleteCharacter(id: string): Promise<Character> {
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
    async existsCharacter(id: string): Promise<boolean> {
        const count = await pclient.character.count({
            where: { id }
        });
        return count > 0;
    }

    /**
     * Find Characters with exact name matching.
     * @param name
     */
    async getCharacterByExactName(name: string): Promise<Character| null> {
        return pclient.character.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
        });
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
    async getCharacterBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Character[]> {
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