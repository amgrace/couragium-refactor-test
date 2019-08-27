import * as express from 'express';
import { promotionsRouter } from './configuration';

const app = express();

app.use(promotionsRouter);

export default app;
