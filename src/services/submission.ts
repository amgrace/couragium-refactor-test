import {Functions, Promotion} from '../exerciseFunctions/types';

export class Submissions {

	private functions: Functions;

	protected constructor (functions: Functions) {
		this.functions = functions;
	}

	submitSpam(promotion: Partial<Promotion>, directories: string[]) {
		let promotionToSend = this.preparePromotion(promotion);

		let submittingDirectories: any = {};

		return resizeImages(this.functions, promotionToSend)
		.then(() => {
			var promises: any = [];

			directories.filter((a: any) => a == "Google").map(() => this.functions.submitToGoogle(promotionToSend).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Google"] = promise});
			directories.filter((a: any) => a == "Facebook").map(() => this.functions.submitToFacebook(promotionToSend).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Facebook"] = promise});
			directories.filter((a: any) => a == "Yellow Pages").map(() => this.functions.submitToYellowPages(promotionToSend).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Yellow Pages"] = promise});	
		
			return Promise.all(promises);
		})
		.then(() => {
			return Promise.all(Object.keys(submittingDirectories).map(key => submittingDirectories[key].then((result: any) => submittingDirectories[key] = result)));
		})
		.then(() => {
			return Object.keys(submittingDirectories).map(key => {
				return {
					directory: key,
					status: submittingDirectories[key],
				}
			});
		});
	}

	private preparePromotion(promotion: Partial<Promotion>): Promotion {
		let promotionToSend: any = Object.assign({}, promotion);

		if(!promotionToSend.start_date || promotionToSend.start_date.getTime() < (new Date).getTime()) {
			promotionToSend.start_date = new Date();
		}

		if(!promotionToSend.end_date) {
			promotionToSend.type = "FOREVER";
		} else {
			promotionToSend.type = "TEMPORARY";
		}
		return promotionToSend;
	}

	public static getInstance(functions: Functions) {
		return new Submissions(functions);
	}

}

async function resizeImages(functions: Functions, data: any) {
	var index = 0;

	data.images.forEach(async (image: any) => {
		data.images[index++] = await functions.resizeImage(image);
	});
}
