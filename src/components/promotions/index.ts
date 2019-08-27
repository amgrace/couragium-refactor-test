import { Application } from "express";

var promotions = require('./promotions').getInstance();

export function route(app: Application) {
	app.post('/promotions/submit/:promotionId', promotions.submit);
}
