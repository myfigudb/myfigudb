import {faker} from "@faker-js/faker";
import {pclient} from "../../../config/prisma.js";

import {RangeService} from "../../../services/database/figure/rangeService.js";


const service = new RangeService();

export async function seedRanges(count: number) {
    console.log(`Seeding ${count} ranges...`);

    const editors = await pclient.editor.findMany({ select: { id: true } });
    if (editors.length === 0) return console.log("No editors found, skipping ranges.");

    for (let i = 0; i < count; i++) {
        const random_editor = faker.helpers.arrayElement(editors);
        const name = faker.commerce.productAdjective() + " Ran";

        await service.createRange({
            name: name,
            editor_id: random_editor.id
        });
    }
}