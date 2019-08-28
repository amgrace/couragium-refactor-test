import { getPromotionInstance as _getPromotionInstance } from '../exerciseFunctions';

export class PromotionsRepository {
	public getPromotionInstance(id: number) {
		return _getPromotionInstance(id);
	}
}
