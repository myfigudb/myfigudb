import { pclient } from '@core/config/prisma.js';

import {seedUsers} from "./seed/dep0/seed_users.js";
import {seedLicenses} from "./seed/dep0/seed_licenses.js";
import {seedEditors} from "./seed/dep0/seed_editors.js";
import {seedMaterials} from "./seed/dep0/seed_materials.js";
import {seedCharacters} from "./seed/dep1/seed_characters.js";
import {seedRanges} from "./seed/dep1/seed_ranges.js";
import {seedTags} from "./seed/dep1/seed_tags.js";
import {seedFigures, seedListings} from "./seed/dep2/seed_figures.js";
import {seedResellers} from "./seed/dep0/seed_resellers.js";


async function main() {
    console.log('Start global seeding...');

    // await pclient.figure.deleteMany();
    // await pclient.user_profile.deleteMany();

    // dep lvl 0
    await seedUsers(10);
    await seedLicenses(10);
    await seedEditors(10);
    await seedMaterials(10);
    await seedResellers(10);

    // dep lvl 1
    await seedCharacters(100)
    await seedRanges(100)
    await seedTags(100)

    //dep lvl 2
    await seedFigures(200)
    await seedListings(500)

    console.log('Global seeding finished.');
}

main()
    .then(async () => {
        await pclient.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await pclient.$disconnect();

        process.exit(1);
    });