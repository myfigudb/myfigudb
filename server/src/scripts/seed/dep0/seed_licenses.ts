import { faker } from '@faker-js/faker';
import {LicenseService} from "../../../modules/catalog/license/license.service.js";

const service = new LicenseService();

export async function seedLicenses(count: number) {
    console.log(`Seeding ${count} licenses...`);

    for (let i = 0; i < count; i++) {
        const name = faker.science.chemicalElement().name + " Lic";

        const existing = await service.getLicenseByName(name);
        if (!existing) {
            await service.createLicense({ name });
        }
    }
}

