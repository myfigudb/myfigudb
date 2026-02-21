import { faker } from '@faker-js/faker';

import {FigureService} from "../../../modules/figure/figure.service.js";
import {ListingService} from "../../../modules/figure/listing/listing.service.js";
import {pclient} from "@core/config/prisma.js";

const figure_service = new FigureService();
const listing_service = new ListingService();

export async function seedFigures(count: number) {
    console.log(`Seeding ${count} figures...`);

    const editors = await pclient.editor.findMany({ select: { id: true } });
    const ranges = await pclient.range.findMany({ select: { id: true } });


    if (editors.length === 0) return;

    for (let i = 0; i < count; i++) {
        const random_editor = faker.helpers.arrayElement(editors);
        const random_range = ranges.length > 0 ? faker.helpers.arrayElement(ranges) : null;

        const gtin = faker.datatype.boolean() ? faker.commerce.isbn(13).replace(/-/g, '') : undefined;

        await figure_service.createFigure({
            name: faker.commerce.productName(),
            editor_id: random_editor.id,
            range_id: random_range?.id,
            scale: "1/7",
            height: faker.number.int({ min: 100, max: 400 }),
            unit: "mm",
            gtin13: gtin,
            release_date: faker.date.past(),
            color: faker.color.rgb(),
            commentary: faker.lorem.paragraph(),
        });
    }
}

export async function seedListings(count: number) {
    console.log(`Seeding ${count} listings...`);

    const figures = await pclient.figure.findMany({ select: { id: true } });
    const resellers = await pclient.reseller.findMany({ select: { id: true } });

    if (figures.length === 0 || resellers.length === 0) return;

    for (let i = 0; i < count; i++) {
        const fig = faker.helpers.arrayElement(figures);
        const res = faker.helpers.arrayElement(resellers);

        await listing_service.createListing({
            figure_id: fig.id,
            reseller_id: res.id,
            price: parseFloat(faker.commerce.price({ min: 50, max: 500 })),
            currency: "EUR",
            url: faker.internet.url(),
            description: faker.commerce.productDescription(),
            images_urls: [faker.image.url(), faker.image.url()],
            raw: {}
        });
    }
}