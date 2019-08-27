import { PromotionsRouterFactory } from './components/promotions'
import * as functionsService from './exerciseFunctions';
import { Submissions } from './services/submission';
import { Promotions } from './components/promotions';

// Initialize services
const submissionsService = Submissions.getInstance(functionsService);

// Initialize components
const promotionsComponent = Promotions.getInstance(functionsService, submissionsService);

// Initialize routing
export const promotionsRouter = PromotionsRouterFactory(promotionsComponent)
