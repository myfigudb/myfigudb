import { TagRepository } from "./tag.repository.js";

import {CreateTagDTO, UpdateTagDTO} from "./tag.dto.js";
import {Tag} from "@db/client.js";


export class TagService {

    private repo = new TagRepository();

    async getAllTags(): Promise<Tag[]> {
        return this.repo.findAll();
    }
    async getTagById(id: string): Promise<Tag | null> {
        return this.repo.findById(id);
    }

    async createTag(dto: CreateTagDTO, userId: string): Promise<Tag> {
        const existing = await this.repo.findByLabel(dto.label);
        if (existing) {
            throw new Error(`Tag '${dto.label}' already exists.`);
        }

        return this.repo.create({
            label: dto.label,
            createdBy: userId
        });
    }

    async updateTag(id: string, dto: UpdateTagDTO): Promise<Tag> {
        if (dto.label) {
            const existing = await this.repo.findByLabel(dto.label);
            if (existing && existing.id !== id) {
                throw new Error(`Tag '${dto.label}' already exists.`);
            }
        }

        return this.repo.update(id, dto);
    }

    async deleteTag(id: string): Promise<Tag> {
        return this.repo.delete(id);
    }

    async searchTags(query: string): Promise<Tag[]> {
        if (!query || query.length < 2) return [];

        const startsWith = await this.repo.findStartingWith(query);
        if (startsWith.length > 0) return startsWith;

        return this.repo.findBySimilarityLabel(query);
    }
}


