import { PromotionsRouterFactory } from './components/promotions'
import * as functionsService from './exerciseFunctions';
import { Submissions } from './services/submission';
import { Promotions } from './components/promotions';
import {DIRECTORY, DirectoryHub } from './services/directories';

// Initialize Directory Hub
let directoryHub = DirectoryHub.getInstance()
.addSubmitFunction(DIRECTORY.GOOGLE, functionsService.submitToGoogle)
.addSubmitFunction(DIRECTORY.FACEBOOK, functionsService.submitToFacebook)
.addSubmitFunction(DIRECTORY.YELLOW_PAGES, functionsService.submitToYellowPages);

// Initialize services
const submissionsService = Submissions.getInstance(directoryHub);

// Initialize components
const promotionsComponent = Promotions.getInstance(functionsService, submissionsService);

// Initialize routing
export const promotionsRouter = PromotionsRouterFactory(promotionsComponent)
