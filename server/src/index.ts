import app from './app.js';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import {generateOpenApiDocs} from "./docs/openapi.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// OPEN API
const openApiDocument = generateOpenApiDocs();
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));