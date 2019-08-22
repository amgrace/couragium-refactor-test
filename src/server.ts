let promotionsComponent = require('./legacy/components/promotions');

const express = require('express');
const app = express();

promotionsComponent.route(app);

export default app;
