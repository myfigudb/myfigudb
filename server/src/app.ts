import express from 'express';
import routes from "./routes/index.js";

const app = express();

app.use(express.json());

// http://localhost:3000/api/
app.use('/api', routes);

export default app;