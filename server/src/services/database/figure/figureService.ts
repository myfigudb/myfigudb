import {pclient} from "../../../config/prisma.js";
import {Figure, Prisma} from "../../../generated/prisma/client.js";
import {FigureSearchDTO} from "../../../interfaces/dtos/search_dto.js";


export class FigureService {

    /**
     * Retrieve a Figure by its unique ID.
     * Includes relationships: Images, Series, Editor, Characters, Tags.
     * @returns The Figure or null if not found.
     */
    async getFigureById(id: string): Promise<Figure | null> {
        return pclient.figure.findUnique({
            where: { id },
            include: {
                images: {
                    orderBy: { priority: 'desc' },
                    include: {
                        media: true
                    }
                },
                ranges: true,
                editor: true,
            }
        });
    }



    async getAllFigures(): Promise<Figure[]> {
        return pclient.figure.findMany({
            include: {
                images: {
                    orderBy: { priority: 'desc'},
                    take: 1,
                    include: {
                        media: true
                    }
                },
                ranges: true,
                editor: true,
            }
        });
    }

    /**
     * Create a new Figure.
     * Note: Relations (Series, Editor) should be connected via ID in the 'data' object.
     */
    async createFigure(data: Prisma.FigureUncheckedCreateInput): Promise<Figure> {
        return pclient.figure.create({
            data: data
        });
    }

    /**
     * Update an existing Figure.
     */
    async updateFigure(id: string, data: Prisma.FigureUpdateInput): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Figure.
     */
    async deleteFigure(id: string): Promise<Figure> {
        return pclient.figure.delete({
            where: { id }
        });
    }

    /**
     * Check if a figure exists efficiently.
     */
    async existsFigure(id: string): Promise<boolean> {
        const count = await pclient.figure.count({
            where: { id }
        });
        return count > 0;
    }


    /**
     * Find Figure with exact name matching.
     * @param name
     */
    async getFigureByExactName(name: string): Promise<Figure| null> {
        return pclient.figure.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
        });
    }

    /**
     * Find figure with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("figure"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("figure")
     *
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 1)
     */
    async getFigureBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Figure[]> {
        return pclient.$queryRaw<Figure[]>`
            SELECT *
            FROM "figure"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `;
    }

    /**
     * Attach images to a figure based on the FIGURE_IMAGE table structure.
     * @param id The Figure ID
     * @param imagesData Array of image objects containing path, priority, etc.
     */
    async attachImages(id: string, imagesData: { hash: string, priority: number }[]): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data: {
                images: {
                    create: imagesData.map(img => ({
                        priority: img.priority,
                        media: {
                            connect: { hash: img.hash }
                        }
                    }))
                }
            },
            include: {
                images: true
            }
        });
    }



    async searchFigure(dto: FigureSearchDTO) {
        const { meta, sorting, filters } = dto;

        const where_clause: Prisma.FigureWhereInput = { AND: [] };

        if (meta.query) {
            const search_term = meta.query.trim();
            (where_clause.AND as Prisma.FigureWhereInput[]).push({
                OR: [
                    { name: { contains: search_term, mode: 'insensitive' } },
                    { gtin13: { contains: search_term } },
                    { commentary: { contains: search_term, mode: 'insensitive' } },

                    { editor: { name: { contains: search_term, mode: 'insensitive' } } },
                    { characters: { some: { name: { contains: search_term, mode: 'insensitive' } } } }
                ]
            });
        }

        if (filters.editors?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({
                editor_id: { in: filters.editors }
            });
        }

        if (filters.series?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({
                range_id: { in: filters.series }
            });
        }

        if (filters.characters?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({
                characters: { some: { id: { in: filters.characters } } }
            });
        }

        if (filters.materials?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({
                materials: { some: { id: { in: filters.materials } } }
            });
        }

        //TODO IMPLEMENT PRICING LOGIC (using https://fxratesapi.com/)
        if (filters.pricing?.length) {
            const price_clause: Prisma.FigureWhereInput[] = [];

            //ex: ["EUR:10:50:auto","USD:20:100:strict"]
            for (const rule of filters.pricing) {
                price_clause.push({
                    listings: {
                        some: {
                            currency: rule.currency,
                            price: {
                                gte: rule.min,
                                lte: rule.max
                            }
                        }
                    }
                });
            }

            if (price_clause?.length) {
                (where_clause.AND as Prisma.FigureWhereInput[]).push({ OR: price_clause });
            }
        }

        //TODO SORTING LOGIC

        const skip = (meta.page - 1) * meta.limit;

        const [total_count, figures] = await pclient.$transaction([
            pclient.figure.count({ where: where_clause }),
            pclient.figure.findMany({
                where: where_clause,
                take: meta.limit,
                skip: skip,
                include: {
                    editor: true,
                    images: {
                        orderBy: { priority: 'desc'},
                        take: 1,
                        include: {
                            media: true
                        }
                    },
                    listings: {
                        select: { price: true, currency: true, url: true }
                    }
                }
            })
        ]);

        return {
            data: figures,
            meta: {
                total: total_count,
                page: meta.page,
                limit: meta.limit,
                last_page: Math.ceil(total_count / meta.limit)
            }
        };
    }
}