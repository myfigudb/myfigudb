import { FigureRepository } from "./figure.repository.js";
import { CreateFigureDTO, UpdateFigureDTO } from "./figure.dto.js";
import {Figure, Prisma} from "../../generated/prisma/client.js";
import {FigureSearchDTO} from "../../interfaces/dtos/search_dto.js";

export class FigureService {

    private repo = new FigureRepository();

    async getFigureById(id: string): Promise<Figure | null> {
        return this.repo.getById(id);
    }

    async getAllFigures(): Promise<Figure[]> {
        return this.repo.getAll();
    }

    async createFigure(dto: CreateFigureDTO): Promise<Figure> {
        return this.repo.create({
            name: dto.name,
            scale: dto.scale,
            height: dto.height,
            rangeId: dto.rangeId,
            editorId: dto.editorId,
            gtin13: dto.gtin13,
            commentary: dto.commentary
        });
    }

    async updateFigure(id: string, dto: UpdateFigureDTO): Promise<Figure> {
        return this.repo.update(id, dto);
    }

    async deleteFigure(id: string): Promise<Figure> {
        return this.repo.delete(id);
    }

    async existsFigure(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getFigureBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Figure[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }

    async attachImages(id: string, imagesData: { hash: string, priority: number }[]): Promise<Figure> {
        return this.repo.attachImages(id, imagesData);
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
            (where_clause.AND as Prisma.FigureWhereInput[]).push({ editorId: { in: filters.editors } });
        }

        if (filters.series?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({ rangeId: { in: filters.series } });
        }

        if (filters.characters?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({ characters: { some: { id: { in: filters.characters } } } });
        }

        if (filters.materials?.length) {
            (where_clause.AND as Prisma.FigureWhereInput[]).push({ materials: { some: { id: { in: filters.materials } } } });
        }

        //TODO IMPLEMENT PRICING LOGIC
        if (filters.pricing?.length) {
            const price_clause: Prisma.FigureWhereInput[] = [];
            for (const rule of filters.pricing) {
                price_clause.push({
                    listings: {
                        some: {
                            currency: rule.currency,
                            price: { gte: rule.min, lte: rule.max }
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
        const [total_count, figures] = await this.repo.search(where_clause, meta, skip);

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