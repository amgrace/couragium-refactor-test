import { Application } from "express";
import { Promotions } from './promotions';

var promotions = Promotions.getInstanceDefault();

export function route(app: Application) {
	app.post('/promotions/submit/:promotionId', promotions.submit);
}

export { Promotions } from './promotions';
