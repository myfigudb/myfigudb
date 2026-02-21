import { Editor } from '../../../../../generated/prisma/client.js';
import { EntityResolver } from '../entityResolver.js';
import { EditorService } from "../../../../catalog/editor/editor.service.js";
import { EditorScrapDTO } from "../../@core/dtos/scrap_dto.js";

export class EditorResolver implements EntityResolver<Editor, EditorScrapDTO> {

    private cache = new Map<string, Editor>();

    constructor(private service: EditorService) {}

    async resolve(data: EditorScrapDTO): Promise<Editor> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        let entity = await this.service.getEditorByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getEditorBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            entity = await this.service.createEditor({
                ...data,
                name: clean_name
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}