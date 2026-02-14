import {closeRedis, connectRedis, redis_client} from "../core/config/redis.js";

export const delBloomFilter = async () => {
    const filter_key = process.env.REDIS_BF_CRAWL_KEY || 'crawling:visited';
    const capacity = parseInt(process.env.REDIS_BF_CRAWL_CAPACITY || '10000000');
    const error_rate = parseFloat(process.env.REDIS_BF_CRAWL_ERROR || '0.001');

    try {
        await connectRedis();

        const filter_exists = await redis_client.exists(filter_key);

        if (filter_exists) {
            await redis_client.del(filter_key);
            console.log(`DF Deleted`);
        }

    } catch (error) {
        console.error('An error occurred during Bloom Filter initialization:', error);
    }
}

delBloomFilter();