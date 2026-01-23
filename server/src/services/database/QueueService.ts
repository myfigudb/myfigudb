import {redis_client} from "../../config/redis.js";
import {pclient} from "../../config/prisma.js";

export class QueueService {

    /**
     * Tries to add a URL to the queue.
     */
    static async enqueue(url: string): Promise<boolean> {
        const key = 'crawling:visited';

        try {
            const exists = await redis_client.bf.exists(key, url);
            if (exists) return false;

            await pclient.urlQueue.create({
                data: { url: url, status: 'PENDING' }
            });

            await redis_client.bf.add(key, url);
            return true;

        } catch (error: any) {
            if (error.code === 'P2002') {
                await redis_client.bf.add(key, url);
                return false;
            }
            console.error(`Failed to enqueue url ${url}:`, error);
            return false;
        }
    }

    /**
     * Fetch the next PENDING job and lock it to PROCESSING
     */
    static async dequeue() {
        const job = await pclient.urlQueue.findFirst({
            where: { status: 'PENDING' },
            orderBy: { id: 'asc' }
        });

        if (!job) return null;

        return pclient.urlQueue.update({
            where: { id: job.id },
            data: {
                status: 'PROCESSING',
                attempts: { increment: 1 }
            }
        });
    }

    /**
     * Mark job as DONE
     */
    static async completeJob(id: number) {
        await pclient.urlQueue.update({
            where: { id },
            data: { status: 'DONE', error: null }
        });
    }

    /**
     * Mark job as FAILED
     */
    static async failJob(id: number, error_message: string) {
        await pclient.urlQueue.update({
            where: { id },
            data: { status: 'FAILED', error: error_message }
        });
    }
}