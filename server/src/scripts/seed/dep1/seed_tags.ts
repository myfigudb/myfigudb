import {pclient} from "@core/config/prisma.js";
import {faker} from "@faker-js/faker";
import TagService from "../../../modules/tag/tag.service.js";

const service = new TagService();

export async function seedTags(count: number) {
    console.log(`Seeding ${count} tags...`);

    const users = await pclient.user.findMany({ select: { id: true } });
    if (users.length === 0) return console.log("No users found for tags.");

    for (let i = 0; i < count; i++) {
        const label = faker.word.adjective();
        const random_user = faker.helpers.arrayElement(users);

        const existing = await service.getTagByLabel(label);
        if (!existing) {
            await service.createTag({
                label: label,
                created_by: random_user.id,
                status: 'VERIFIED'
            });
        }
    }
}