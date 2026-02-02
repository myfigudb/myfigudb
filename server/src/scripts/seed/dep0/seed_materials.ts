import { faker } from '@faker-js/faker';

import {MaterialService} from "../../../services/database/figure/materialService.js";

const service = new MaterialService();

export async function seedMaterials(count: number) {
    console.log(`Seeding ${count} materials...`);

    for (let i = 0; i < count; i++) {
        const name = faker.science.chemicalElement().name + " Mat";

        const existing = await service.getMaterialByExactName(name);
        if (!existing) {
            await service.createMaterial({ name });
        }
    }
}

