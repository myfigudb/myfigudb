import {pclient} from "../../config/prisma.js";
import {Figure, Prisma} from "../../generated/prisma/client.js";

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
                    orderBy: { priority: 'asc' }
                },
                series: true,
                editor: true,
            }
        });
    }

    async getAllFigures(): Promise<Figure[]> {
        return pclient.figure.findMany({
            include: {
                images: {
                    where: { priority: 0 },
                    take: 1
                },
                series: true,
                editor: true
            }
        });
    }

    /**
     * Create a new Figure.
     * Note: Relations (Series, Editor) should be connected via ID in the 'data' object.
     */
    async createFigure(data: Prisma.FigureCreateInput): Promise<Figure> {
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
     * Find Figures with similar names using trigram similarity (PostgreSQL pg_trgm).
     * @param name          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
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
    async attachImages(id: string, imagesData: { path: string, size: number, priority: number }[]): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data: {
                images: {
                    create: imagesData.map(img => ({
                        image_path: img.path,
                        size: img.size,
                        priority: img.priority
                    }))
                }
            },
            include: {
                images: true
            }
        });
    }
}