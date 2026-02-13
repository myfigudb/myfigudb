import {EditorRepository} from "./editor.repository.js";
import {Editor} from "../../../generated/prisma/client.js";

import {CreateEditorDTO, UpdateEditorDTO} from "./editor.dto.js";

export class EditorService {
    private repo = new EditorRepository();

    async getAllEditors(): Promise<Editor[]> {
        return this.repo.findAll();
    }

    async getEditorById(id: string): Promise<Editor | null> {
        return this.repo.findById(id);
    }

    async createEditor(dto: CreateEditorDTO): Promise<Editor> {
        return this.repo.create({
            name: dto.name
        });
    }

    async updateEditor(id: string, dto: UpdateEditorDTO): Promise<Editor> {
        return this.repo.update(id,dto);
    }

    async deleteEditor(id: string): Promise<Editor> {
        return this.repo.delete(id);
    }

    async searchSimilarEditors(name: string): Promise<Editor[]> {
        if (name.length < 2) return [];
        return this.repo.findBySimilarityName(name);
    }
}