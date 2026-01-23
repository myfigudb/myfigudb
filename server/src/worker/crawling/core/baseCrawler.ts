import axios from 'axios';
import {QueueService} from "../../../services/database/QueueService.js";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export abstract class BaseCrawler {

    /**
     * Main method to crawl a category and its pagination
     */
    async crawl(start_url: string) {
        let current_url: string | null = start_url;
        let page_count = 1;

        console.log(`Starting crawl process on: ${start_url}`);

        while (current_url) {
            console.log(`Processing Page ${page_count}: ${current_url}`);

            try {
                const { data: raw_data } = await axios.get(current_url, {
                    headers: {
                        'User-Agent': 'mfdb-crawler/0.1',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
                    },
                    timeout: 10000,
                    responseType: 'text'
                });

                // extract figures urls from page
                const urls = this.extractFiguresUrls(raw_data);
                let new_figures_count = 0;

                for (const url of urls) {
                    const added = await QueueService.enqueue(url);
                    if (added) new_figures_count++;
                }

                console.log(`Page ${page_count} done. Found ${urls.length} links (${new_figures_count} new).`);

                // next url scrap
                const next_url = this.extractNextPageUrl(raw_data);

                if (next_url && next_url !== current_url) {
                    current_url = next_url;
                    page_count++;

                    await sleep(parseInt(process.env.REDIS_BF_CRAWL_SLEEP || '2000'));
                } else {
                    console.log("No next page found. Stopping.");
                    current_url = null;
                }

            } catch (error: any) {
                console.error(`Error processing page ${current_url}:`, error.message);
                // stopping
                current_url = null;
            }
        }
    }

    protected abstract extractFiguresUrls(html: string): string[];

    protected abstract extractNextPageUrl(html: string): string | null;
}