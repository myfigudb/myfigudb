import express from 'express';
import cors from 'cors';
import routes from "./apps/api/routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());

// http://localhost:3000/api/
app.use('/api', routes);

export default app;