import { Router } from "express";
import { Promotions } from './promotions';

export function routerFactory(promotions: Promotions) {
	let router = Router();
	router.post('/promotions/submit/:promotionId', promotions.submit);
	return router;
}
