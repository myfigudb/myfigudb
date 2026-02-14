import { pclient } from "../../core/config/prisma.js";
import { Tag, FigureTag, FigureTagVote, Prisma } from "../../generated/prisma/client.js";

export class TagRepository {
    async findById(id: string): Promise<Tag | null> {
        return pclient.tag.findUnique({ where: { id } });
    }

    async findByLabel(label: string): Promise<Tag | null> {
        return pclient.tag.findFirst({
            where: {
                label: { equals: label, mode: 'insensitive' }
            }
        });
    }

    async findAll(): Promise<Tag[]> {
        return pclient.tag.findMany({ orderBy: { label: 'asc' } });
    }

    async create(data: Prisma.TagUncheckedCreateInput): Promise<Tag> {
        return pclient.tag.create({ data });
    }

    async update(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
        return pclient.tag.update({ where: { id }, data });
    }

    async delete(id: string): Promise<Tag> {
        return pclient.tag.delete({ where: { id } });
    }


    async findStartingWith(prefix: string, limit: number = 10): Promise<Tag[]> {
        return pclient.tag.findMany({
            where: {
                label: { startsWith: prefix, mode: 'insensitive' }
            },
            take: limit,
            orderBy: { label: 'asc' }
        });
    }

    async findBySimilarityLabel(label: string, threshold: number = 0.3, limit: number = 10): Promise<Tag[]> {
        return pclient.$queryRaw<Tag[]>`
            SELECT *
            FROM "tag"
            WHERE similarity(label, ${label}) > ${threshold}
            ORDER BY similarity(label, ${label}) DESC
            LIMIT ${limit};
        `;
    }



    // FIGURE TAG SURVEY

    async countPendingForUser(userId: string): Promise<number> {
        return pclient.figureTag.count({
            where: {
                status: 'PENDING',
                addedBy: { not: userId }, // Pas ses propres tags
                votes: {
                    none: { votedBy: userId } // Pas ceux déjà votés
                }
            }
        });
    }

    async findRandomPendingForUser(userId: string, skip: number): Promise<FigureTag | null> {
        return pclient.figureTag.findFirst({
            where: {
                status: 'PENDING',
                addedBy: { not: userId },
                votes: {
                    none: { votedBy: userId }
                }
            },
            skip: skip,
            include: {
                tag: true,
                figure: true
            }
        });
    }

    async upsertVote(data: { figureTagId: string, userId: string, weight: number }): Promise<FigureTagVote> {
        return pclient.figureTagVote.upsert({
            where: {
                figureTagId_votedBy: {
                    figureTagId: data.figureTagId,
                    votedBy: data.userId
                }
            },
            update: {
                weight: data.weight
            },
            create: {
                figureTagId: data.figureTagId,
                votedBy: data.userId,
                weight: data.weight
            }
        });
    }
}