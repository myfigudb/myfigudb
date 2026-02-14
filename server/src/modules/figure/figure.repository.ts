import { pclient } from "../../core/config/prisma.js";
import {Figure, Prisma} from "../../generated/prisma/client.js";


export class FigureRepository {

    /**
     * Retrieve a Figure by its unique ID.
     * Includes relationships: Images, Series, Editor, Characters, Tags.
     * @returns The Figure or null if not found.
     */
    async getById(id: string): Promise<Figure | null> {
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

    async getAll(): Promise<Figure[]> {
        return pclient.figure.findMany({
            include: {
                images: {
                    orderBy: { priority: 'desc' },
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
    async create(data: Prisma.FigureUncheckedCreateInput): Promise<Figure> {
        return pclient.figure.create({
            data: data
        });
    }

    /**
     * Update an existing Figure.
     */
    async update(id: string, data: Prisma.FigureUpdateInput): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Figure.
     */
    async delete(id: string): Promise<Figure> {
        return pclient.figure.delete({
            where: { id }
        });
    }

    /**
     * Check if a figure exists efficiently.
     */
    async exists(id: string): Promise<boolean> {
        const count = await pclient.figure.count({
            where: { id }
        });
        return count > 0;
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
    async getBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Figure[]> {
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

    async search(where_clause: Prisma.FigureWhereInput, meta: { limit: number, page: number }, skip: number): Promise<[number, any[]]> {
        return pclient.$transaction([
            pclient.figure.count({ where: where_clause }),
            pclient.figure.findMany({
                where: where_clause,
                take: meta.limit,
                skip: skip,
                include: {
                    editor: true,
                    images: {
                        orderBy: { priority: 'desc' },
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
    }
}