import { faker } from '@faker-js/faker';
import {UserService} from "../../../services/database/user/userService.js";

const service = new UserService();

export async function seedUsers(count: number) {
    console.log(`Seeding ${count} users...`);

    for (let i = 0; i < count; i++) {
        const name = faker.person.firstName();
        const email = faker.internet.email({ firstName: name }).toLowerCase();

        const slug = `@${faker.helpers.slugify(name).toLowerCase()}`;

        const existing_user = await service.getUserByEmail(email);

        if (!existing_user) {
            await service.createUser({
                email: email,
                password: 'password',
                slug: slug,
            });
        }
    }
}