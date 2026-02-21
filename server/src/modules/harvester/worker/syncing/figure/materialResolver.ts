import {Material} from '@db/client.js';
import {EntityResolver} from '../entityResolver.js';
import {MaterialScrapDTO} from "../../@core/dtos/scrap_dto.js";
import {MaterialService} from "../../../../catalog/material/material.service.js";

export class MaterialResolver implements EntityResolver<Material, MaterialScrapDTO> {

    private cache = new Map<string, Material>();

    constructor(private service: MaterialService) {}

    async resolve(data: MaterialScrapDTO): Promise<Material> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        let entity = await this.service.getMaterialByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getMaterialBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            entity = await this.service.createMaterial({
                ...data,
                name: clean_name
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}