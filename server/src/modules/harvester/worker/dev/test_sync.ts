import {FigureService} from "../../../figure/figure.service.js";
import {ListingService} from "../../../figure/listing/listing.service.js";
import {ResellerService} from "../../../catalog/reseller/reseller.service.js";
import {LicenseService} from "../../../catalog/license/license.service.js";
import {EditorService} from "../../../catalog/editor/editor.service.js";
import {RangeService} from "../../../catalog/range/range.service.js";
import {CharacterService} from "../../../catalog/character/character.service.js";
import {MaterialService} from "../../../catalog/material/material.service.js";
import {QueueService} from "../../queueService.js";
import {LicenseResolver} from "../syncing/figure/licenseResolver.js";
import {EditorResolver} from "../syncing/figure/editorResolver.js";
import {MaterialResolver} from "../syncing/figure/materialResolver.js";
import {RangeResolver} from "../syncing/figure/rangeResolver.js";
import {CharacterResolver} from "../syncing/figure/characterResolver.js";
import {FigureResolver} from "../syncing/figure/figureResolver.js";
import {Sync} from "../syncing/sync.js";
import {scrapPage} from "../scraping/core/scraper.js";


console.log("🚀 Starting Worker Initialization...");

const figureService = new FigureService();
const listingService = new ListingService();
const resellerService = new ResellerService();
const licenseService = new LicenseService();
const editorService = new EditorService();
const rangeService = new RangeService();
const characterService = new CharacterService();
const materialService = new MaterialService();

const queueService = new QueueService();

const licenseResolver = new LicenseResolver(licenseService);
const editorResolver = new EditorResolver(editorService);
const materialResolver = new MaterialResolver(materialService);


const rangeResolver = new RangeResolver(rangeService, editorResolver);
const characterResolver = new CharacterResolver(characterService, licenseResolver);


const figureResolver = new FigureResolver(
    figureService,
    materialResolver,
    characterResolver,
    rangeResolver,
    editorResolver
);


const syncWorkflow = new Sync(
    figureResolver,
    listingService
);

console.log("✅ Worker Initialized. Ready to process queue.");



async function runWorker() {
    let is_running = true;

    process.on('SIGINT', () => {
        console.log("\nStopping worker gracefully...");
        is_running = false;
    });

    while (is_running) {
        const job = await queueService.dequeue();

        if (!job) {
            console.log("Queue empty. Waiting 5s...");
            await new Promise(r => setTimeout(r, 5000));
            continue;
        }


        const { id: job_id, url } = job;
        console.log(`\n-----------------------------------`);
        console.log(`📥 Processing Job #${job_id}: ${url}`);

        try {
            console.time("Scraping");
            const scrapResult = await scrapPage(url);
            console.timeEnd("Scraping");

            console.log("Scrap result:" + scrapResult)

            if (!scrapResult) {
                throw new Error("Scraping returned null (Anti-bot or 404?)");
            }

            // 3. INGESTION
            console.time("Ingestion");
            await syncWorkflow.sync(scrapResult);
            console.timeEnd("Ingestion");

            await queueService.completeJob(job_id);
            console.log("Job Done");

        } catch (error: any) {
            console.error(`Job Failed: ${error.message}`);
            // console.error(error);

            await queueService.failJob(job_id, error.message);
        }

        await new Promise(r => setTimeout(r, 1000));
    }

    console.log("Worker stopped.");
    process.exit(0);
}

runWorker().catch(e => {
    console.error("Fatal Worker Error:", e);
    process.exit(1);
});