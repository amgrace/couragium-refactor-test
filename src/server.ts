import { PromotionsRouter } from './components/promotions'

const express = require('express');
const app = express();

app.use(PromotionsRouter);

export default app;
