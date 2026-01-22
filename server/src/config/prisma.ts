import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import {StorageService} from "../services/storageService.js";

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const base_client = new PrismaClient({
    adapter,
});



export const pclient = base_client.$extends({
    result: {
        media: {
            url: {
                needs: { hash: true, extension: true, folder: true },
                compute(media) {
                    return StorageService.getPublicUrl(media.hash, media.extension, media.folder);
                },
            },
        },
    },
});

