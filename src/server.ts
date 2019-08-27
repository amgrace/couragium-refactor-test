let promotionsComponent = require('./components/promotions');

const express = require('express');
const app = express();

promotionsComponent.route(app);

export default app;
