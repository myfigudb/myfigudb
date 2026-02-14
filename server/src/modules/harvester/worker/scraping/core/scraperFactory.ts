import { ScraperStrategy } from "../strategy/scraperStrategy.js";
import { ChibiStrategy } from "../strategy/chibiAkihabaraStrategy.js";

export class ScraperFactory {
    private static strategies: ScraperStrategy[] = [
        new ChibiStrategy(),
        // new ShinSekaiStrategy(),
    ];

    static getStrategy(url: string): ScraperStrategy {
        let domain: string;


        try {
            domain = new URL(url).hostname;
        } catch (error) {
            console.error(`Invalid URL format: ${url}`);

            throw new Error(`Invalid URL format: ${url}`);
        }

        const strategy = this.strategies.find(s => s.canHandle(domain));

        if (!strategy) {
            console.warn(`No strategy found for domain: ${domain}`);
            throw new Error(`No strategy found for domain: ${domain}`);
        }

        return strategy;
    }
}