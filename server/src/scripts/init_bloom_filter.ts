import {closeRedis, connectRedis, redis_client} from "../config/redis.js";

export const initBloomFilter = async () => {
    const filter_key = process.env.REDIS_BF_CRAWL_KEY || 'crawling:visited';
    const capacity = parseInt(process.env.REDIS_BF_CRAWL_CAPACITY || '10000000');
    const error_rate = parseFloat(process.env.REDIS_BF_CRAWL_ERROR || '0.001');

    try {
        await connectRedis();

        const filter_exists = await redis_client.exists(filter_key);

        if (filter_exists) {
            console.log(`Filter "${filter_key}" already exists.`);
            console.log('No changes made.');
        } else {
            console.log(`Creating Bloom Filter (Capacity: ${capacity}, Error Rate: ${error_rate})...`);

            await redis_client.bf.reserve(filter_key, error_rate, capacity);

            console.log(`Bloom Filter "${filter_key}" successfully created.`);
        }

    } catch (error) {
        console.error('An error occurred during Bloom Filter initialization:', error);
    }
}