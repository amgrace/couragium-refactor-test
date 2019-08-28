import { Functions, Promotion } from "../exerciseFunctions/types";
import { promisify } from 'util';
const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./workers/resizeImage'));

export class Submissions {
	private functions: Functions;

	protected constructor(functions: Functions) {
		this.functions = functions;
	}

	submitSpam(promotion: Partial<Promotion>, directories: string[]) {
		let promotionToSend = this.preparePromotion(promotion);

		return resizeImages(promotionToSend).then(() => {
			let promises = []
			if (directories.indexOf('Google') > -1) {
				promises.push(this.mapPromiseToStatus("Google", this.functions.submitToGoogle(promotionToSend)));
			}
			if (directories.indexOf('Facebook') > -1) {
				promises.push(this.mapPromiseToStatus("Facebook", this.functions.submitToFacebook(promotionToSend)));
			}
			if (directories.indexOf('Yellow Pages') > -1) {
				promises.push(this.mapPromiseToStatus("Yellow Pages", this.functions.submitToYellowPages(promotionToSend)));
			}
		
			return Promise.all(promises);
		});
	}

	private preparePromotion(promotion: Partial<Promotion>): Promotion {
		let promotionToSend: any = Object.assign({}, promotion);

		if (
			!promotionToSend.start_date ||
			promotionToSend.start_date.getTime() < new Date().getTime()
		) {
			promotionToSend.start_date = new Date();
		}

		if (!promotionToSend.end_date) {
			promotionToSend.type = "FOREVER";
		} else {
			promotionToSend.type = "TEMPORARY";
		}
		return promotionToSend;
	}

	private mapPromiseToStatus(directory: string, promise: Promise<any>) {
		return promise
			.catch((error: any) => error)
			.then((status: any) => this.formatDirectoryResponse(directory, status));
	}
	private formatDirectoryResponse(directory: string, status: any) {
		return { directory, status };
	}

	public static getInstance(functions: Functions) {
		return new Submissions(functions);
	}
}

async function resizeImages(promotion: Promotion) {
	let resizeImageAsync = promisify(workers);

	let images = await Promise.all(promotion.images.map(image => resizeImageAsync(image)));
	promotion.images = images;
}
