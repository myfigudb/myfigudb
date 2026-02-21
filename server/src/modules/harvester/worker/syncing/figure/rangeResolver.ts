import { Range } from '@db/client.js';
import { EntityResolver } from '../entityResolver.js';
import { RangeService } from "../../../../catalog/range/range.service.js";
import { RangeScrapDTO } from "../../@core/dtos/scrap_dto.js";

import { EditorResolver } from "./editorResolver.js";

export class RangeResolver implements EntityResolver<Range, RangeScrapDTO> {

    private cache = new Map<string, Range>();

    constructor(
        private service: RangeService,
        private editor_resolver: EditorResolver
    ) {}

    async resolve(data: RangeScrapDTO): Promise<Range> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        let entity = await this.service.getRangeByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getRangeBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            const { editor, ...range_data } = data;

            const editor_entity = await this.editor_resolver.resolve(editor);

            entity = await this.service.createRange({
                ...range_data,
                name: clean_name,
                editor_id: editor_entity.id
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}