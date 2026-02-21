import 'dotenv/config';

import {connectRedis} from "../@core/config/redis.js";
import {ChibiAkihabaraCrawler} from "../crawling/providers/chibiAkihabaraCrawler.js";

async function main() {
    console.log("Starting Service...");

    await connectRedis();

    const crawler = new ChibiAkihabaraCrawler();
    const target = 'https://chibi-akihabara.com/fr/103-figurines';

    await crawler.crawl(target);
}

main().catch((err) => {
    console.error("Fatal Error:", err);
});