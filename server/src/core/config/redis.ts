import { createClient } from 'redis';

export const redis_client = createClient({
    url: process.env.REDIS_URL
});

redis_client.on('error', (err: any) => console.error('Redis Client Error', err));

/**
 * Ensures the connection is open
 */
export async function connectRedis() {
    if (!redis_client.isOpen) {
        await redis_client.connect();

        console.log('Connected to Redis.');
    }
}

/**
 * Closes the connection gracefully
 */
export async function closeRedis() {
    if (redis_client.isOpen) {
        await redis_client.quit();
        console.log('Redis connection closed.');
    }
}