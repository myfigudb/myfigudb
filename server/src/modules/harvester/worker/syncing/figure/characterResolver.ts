import { Character } from '@db/client.js';
import { EntityResolver } from '../entityResolver.js';
import { CharacterService } from "../../../../catalog/character/character.service.js";
import { CharacterScrapDTO } from "../../@core/dtos/scrap_dto.js";

import { LicenseResolver } from "./licenseResolver.js";

export class CharacterResolver implements EntityResolver<Character, CharacterScrapDTO> {

    private cache = new Map<string, Character>();

    constructor(
        private service: CharacterService,
        private license_resolver: LicenseResolver //License can't be null
    ) {}

    async resolve(data: CharacterScrapDTO): Promise<Character> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        let entity = await this.service.getCharacterByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getCharacterBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            const { license, ...char_data } = data;

            const license_entity = await this.license_resolver.resolve(license);

            entity = await this.service.createCharacter({
                ...char_data,
                name: clean_name,
                license_id: license_entity.id
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}