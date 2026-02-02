import app from './app.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import {generateOpenApiDocs} from "./docs/openapi.js";
import {initBloomFilter} from "./scripts/init_bloom_filter.js";


dotenv.config();

// REDIS SETUP
await initBloomFilter();

// OPEN API
const open_api_doc = generateOpenApiDocs();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(open_api_doc));
app.get('/openapi.json', (_req, res) => {
    res.json(open_api_doc);
});


// API
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

