import { License } from '../../../../../generated/prisma/client.js';
import { EntityResolver } from '../entityResolver.js';
import { LicenseService } from "../../../../catalog/license/license.service.js";
import { LicenseScrapDTO } from "../../../../../core/dtos/scrap_dto.js";

export class LicenseResolver implements EntityResolver<License, LicenseScrapDTO> {

    private cache = new Map<string, License>();

    constructor(private service: LicenseService) {}

    async resolve(data: LicenseScrapDTO): Promise<License> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        let entity = await this.service.getLicenseByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getLicenseBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            entity = await this.service.createLicense({
                ...data,
                name: clean_name
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}