import {faker} from "@faker-js/faker";
import {ResellerService} from "../../../services/database/figure/resellerService.js";

const service = new ResellerService();

export async function seedResellers(count: number) {
    console.log(`Seeding ${count} resellers...`);

    for (let i = 0; i < count; i++) {
        const name = faker.company.name();
        const domain = faker.internet.domainName();

        const existing = await service.getResellerByName(name);

        if (!existing) {
            await service.createReseller({
                name: name,
                domain: domain,
                url: `https://${domain}`,
            });
        }
    }
}