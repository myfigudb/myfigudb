import {faker} from "@faker-js/faker";
import {pclient} from "@core/config/prisma.js";

import {CharacterService} from "../../../modules/catalog/character/character.service.js";


const service = new CharacterService();

export async function seedCharacters(count: number) {
    console.log(`Seeding ${count} characters...`);

    const licenses = await pclient.license.findMany({ select: { id: true } });
    if (licenses.length === 0) return console.log("No licenses found, skipping characters.");

    for (let i = 0; i < count; i++) {
        const random_license = faker.helpers.arrayElement(licenses);
        const name = faker.commerce.productAdjective() + " Cha";

        await service.createCharacter({
            name: name,
            license_id: random_license.id
        });
    }
}