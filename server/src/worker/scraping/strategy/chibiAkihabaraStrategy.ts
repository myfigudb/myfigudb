import * as cheerio from 'cheerio';
import { z } from 'zod';
import { ScraperStrategy } from "./scraperStrategy.js";

import {
    FigurePageScrapSchema,
    FigurePageScrapDTO
} from "../../../interfaces/dtos/scrap_dto.js";

export class ChibiStrategy implements ScraperStrategy {

    domain = 'chibi-akihabara.com'

    canHandle(domain: string): boolean {
        return domain.includes(this.domain);
    }

    extract(url: string, raw_html: string): FigurePageScrapDTO | null {
        let html = raw_html;

        if (raw_html.trim().startsWith('{')) {
            try {
                const json = JSON.parse(raw_html);
                html = json.rendered_products || raw_html;
            } catch (e) { /* ignore */ }
        }

        const $ = cheerio.load(html);

        // Helper pour extraire les données du tableau technique
        const explore_dt = (label: string): string | undefined => {
            const val = $(`.data-sheet span.vlsfeature_title:contains("${label}")`)
                .parent()
                .contents()
                .filter((_, el) => el.type === 'text')
                .text()
                .trim();
            return val.length > 0 ? val : undefined;
        };


        const title = $('h1.h1').first().text().trim();
        //const gtin13 = url.match(/(\d{13})\.html/)?.[1] || null; // GTIN PAS VIABLE SUR CHIBI
        const ref = explore_dt('Référence');

        const price_str = $('#vlsproduct_priceamount').attr('value') || '0';
        const price = parseFloat(price_str);

        const editor_name = explore_dt('Editeur');
        const range_name = explore_dt('Collection');

        const licences_str = explore_dt('Licences') || explore_dt('Licence');
        const licenses_list = licences_str ? licences_str.split(',').map(s => s.trim()) : [];

        const characters_str = explore_dt('Personnages') || explore_dt('Personnage');
        const characters_list = characters_str ? characters_str.split(',').map(s => s.trim()) : [];

        const materials_str = explore_dt('Matières') || explore_dt('Matière');
        const materials_list = materials_str ? materials_str.split(',').map(s => s.trim()) : [];

        const height_str = explore_dt('Taille');
        let height: number | undefined;
        if (height_str) {
            height = parseInt(height_str.replace(/\D/g, ''));
        }

        // Description
        const $desc = $('[itemprop="description"]');
        $desc.find('a').contents().unwrap();
        $desc.find('*').removeAttr('class').removeAttr('style').removeAttr('id').removeAttr('itemprop');
        const description = $desc.html()?.trim() || undefined;

        // Images
        const images = $('.thumb-container img').map((_, el) => {
            return $(el).attr('data-image-large-src') || $(el).attr('src');
        }).get().filter(u => u && u.startsWith('http'));


        const editor_obj = editor_name ? { name: editor_name } : undefined;

        let range_obj = undefined;
        if (range_name) {
            range_obj = {
                name: range_name,
                editor: editor_obj
            };
        }

        //TODO repair
        const mainLicenseObj = licenses_list.length > 0 ? { name: licenses_list[0] } : undefined;

        const charactersObjs = characters_list.map(name => ({
            name: name,
            license: mainLicenseObj
        }));

        const raw_data = {
            listing: {
                url: url,
                scraped_at: new Date(),
                scraped_on: this.domain,
                ref: ref,
                price: isNaN(price) ? 0 : price,
                currency: 'EUR',
                in_stock: true,
                images_urls: images,
                description: description
            },
            figure: {
                name: title,

                editor: editor_obj,
                range: range_obj,

                characters: charactersObjs,

                materials: materials_list.map(name => ({ name })),

                height: height,
            }
        };

        try {
            return FigurePageScrapSchema.parse(raw_data);
        } catch (error) {
            console.error(`[ChibiStrategy] Zod Validation Failed for ${url}`);

            if (error instanceof z.ZodError) {
                console.error(JSON.stringify(error.issues, null, 2));
            }
            return null;
        }
    }
}