import { pclient } from '../../../config/prisma.js'
import { Figure, Prisma } from '../../../generated/prisma/client.js'

const figureDetailsInclude = {
    images: {
        orderBy: { priority: 'desc' as const },
        include: {
            media: true,
        },
    },
    ranges: true,
    editor: true,
    characters: {
        include: {
            license: true,
        },
    },
    materials: true,
    listings: {
        include: {
            reseller: true,
        },
    },
}

export class FigureService {
    async getFigureById(id: string): Promise<Figure | null> {
        return pclient.figure.findUnique({
            where: { id },
            include: figureDetailsInclude,
        })
    }

    async getAllFigures(): Promise<Figure[]> {
        return pclient.figure.findMany({
            include: {
                images: {
                    orderBy: { priority: 'desc' },
                    take: 1,
                    include: {
                        media: true,
                    },
                },
                ranges: true,
                editor: true,
            },
        })
    }

    async createFigure(data: Prisma.FigureUncheckedCreateInput): Promise<Figure> {
        return pclient.figure.create({
            data,
        })
    }

    async updateFigure(id: string, data: Prisma.FigureUpdateInput): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data,
        })
    }

    async deleteFigure(id: string): Promise<Figure> {
        return pclient.figure.delete({
            where: { id },
        })
    }

    async existsFigure(id: string): Promise<boolean> {
        const count = await pclient.figure.count({
            where: { id },
        })

        return count > 0
    }

    async getFigureByExactName(name: string): Promise<Figure | null> {
        return pclient.figure.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive',
                },
            },
        })
    }

    async getFigureBySimilarityName(
        name: string,
        threshold = 0.3,
        limit = 5
    ): Promise<Figure[]> {
        return pclient.$queryRaw<Figure[]>`
            SELECT *
            FROM "figure"
            WHERE similarity(name, ${name}) > ${threshold}
            ORDER BY similarity(name, ${name}) DESC
            LIMIT ${limit};
        `
    }

    async attachImages(
        id: string,
        imagesData: Array<{ hash: string; priority: number }>
    ): Promise<Figure> {
        return pclient.figure.update({
            where: { id },
            data: {
                images: {
                    create: imagesData.map((image) => ({
                        priority: image.priority,
                        media: {
                            connect: { hash: image.hash },
                        },
                    })),
                },
            },
            include: {
                images: true,
            },
        })
    }
}
