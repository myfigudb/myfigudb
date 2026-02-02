import { faker } from '@faker-js/faker';

import {EditorService} from "../../../services/database/figure/editorService.js";

const service = new EditorService();

export async function seedEditors(count: number) {
    console.log(`Seeding ${count} editors...`);

    for (let i = 0; i < count; i++) {
        const name = faker.science.chemicalElement().name + " Edi";

        const existing = await service.getEditorByName(name);
        if (!existing) {
            await service.createEditor({ name });
        }
    }
}

