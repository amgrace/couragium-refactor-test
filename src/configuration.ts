import { PromotionsRouterFactory } from './components/promotions'
import * as functionsService from './exerciseFunctions';
import { Submissions } from './services/submission';
import { Promotions } from './components/promotions';
import { DirectoryHub } from './services/directories';

// Initialize Directory Hub
let directoryHub = DirectoryHub.getInstance()
.addSubmitFunction('Google', functionsService.submitToGoogle)
.addSubmitFunction('Facebook', functionsService.submitToFacebook)
.addSubmitFunction('Yellow Pages', functionsService.submitToYellowPages);

// Initialize services
const submissionsService = Submissions.getInstance(directoryHub);

// Initialize components
const promotionsComponent = Promotions.getInstance(functionsService, submissionsService);

// Initialize routing
export const promotionsRouter = PromotionsRouterFactory(promotionsComponent)
