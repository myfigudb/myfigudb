import * as cheerio from 'cheerio';
import {BaseCrawler} from "@core/baseCrawler.js";
// @ts-ignore
// import * as fs from "node:fs";

export class ChibiAkihabaraCrawler extends BaseCrawler {

    private getHtml(raw: string): string {
        if (raw.trim().startsWith('{')) {
            try { return JSON.parse(raw).rendered_products || raw; } catch { return raw; }
        }
        return raw;
    }

    protected extractFiguresUrls(raw_data: string): string[] {
        // fs.writeFileSync('debug_page.html', raw_data);

        const html = this.getHtml(raw_data);

        const $ = cheerio.load(html);
        const urls: string[] = [];

        $('.product-miniature').each((_, element) => {
            const href = $(element).find('a').first().attr('href');
            if (href) {
                urls.push(href);
            }
        });

        return [...new Set(urls)];
    }

    protected extractNextPageUrl(raw_data: string): string | null {
        const html = this.getHtml(raw_data);
        const $ = cheerio.load(html);

        return $('a[rel="next"]').attr('href') || null;
    }
}