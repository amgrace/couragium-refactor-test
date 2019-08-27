import { Router } from "express";
import { Promotions } from './promotions';

var promotions = Promotions.getInstanceDefault();

export const router = Router();
router.post('/promotions/submit/:promotionId', promotions.submit);
