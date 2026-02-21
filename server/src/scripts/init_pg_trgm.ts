import {pclient} from "@core/config/prisma.js";


async function main() {
    await pclient.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS pg_trgm;');
}

main()
    .catch(e => console.error(e))
    .finally(async () => await pclient.$disconnect());