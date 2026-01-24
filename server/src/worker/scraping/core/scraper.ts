import axios from 'axios';

import {ScraperFactory} from "./scraperFactory.js";
import {FigurePageScrapDTO} from "../../../interfaces/dtos/scrap_dto.js";

/**
 * Transform encapsulated HTML in JSON into HTML
 * @param raw
 */
function getHtml(raw: any): string {
    if (typeof raw === 'object' && raw.rendered_products) {
        return raw.rendered_products;
    }

    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
        try {
            return JSON.parse(raw).rendered_products || raw;
        } catch {
            return raw;
        }
    }

    return String(raw);
}

/**
 * Fetch an url to get data into a FigurePageScrapDTO
 * @see FigurePageScrapDTO
 * @param url
 */
export async function scrapPage(url: string): Promise<FigurePageScrapDTO | null> {
    try {
        const strategy = ScraperFactory.getStrategy(url);

        const {data: raw_data} = await axios.get(url, {
            headers: {
                'User-Agent': 'mfdb-scraper/0.1',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
            },
            timeout: 10000,
            responseType: 'text'
        });

        const html = getHtml(raw_data);

        return strategy.extract(url, html);
    } catch (error: any) {
        console.error(`ERREUR : ${error.message}`);
    }
    return null;
}
