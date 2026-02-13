import { RangeRepository } from "./range.repository.js";
import { CreateRangeDTO, UpdateRangeDTO } from "./range.dto.js";
import { Range } from "../../../generated/prisma/client.js";

export class RangeService {

    private repo = new RangeRepository();

    async getRangeById(id: string): Promise<Range | null> {
        return this.repo.getById(id);
    }

    async getRangeByName(name: string): Promise<Range | null> {
        return this.repo.getByName(name);
    }

    async getRangesByEditorId(editorId: string): Promise<Range[]> {
        return this.repo.getByEditorId(editorId);
    }

    async getAllRanges(): Promise<Range[]> {
        return this.repo.getAll();
    }

    async createRange(dto: CreateRangeDTO): Promise<Range> {
        return this.repo.create({
            name: dto.name,
            editorId: dto.editorId
        });
    }

    async updateRange(id: string, dto: UpdateRangeDTO): Promise<Range> {
        return this.repo.update(id, dto);
    }

    async deleteRange(id: string): Promise<Range> {
        return this.repo.delete(id);
    }

    async getRangeBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Range[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }
}