import { Promotion } from "../exerciseFunctions/types";
import { promisify } from 'util';
import { DirectoryHub } from "./directories";
const workerFarm = require('worker-farm');
const workers = workerFarm(require.resolve('./workers/resizeImage'));

export class Submissions {
	private directoryHub: DirectoryHub;

	protected constructor(directoryHub: DirectoryHub) {
		this.directoryHub = directoryHub;
	}

	async submitSpam(promotion: Partial<Promotion>, directories: string[]) {
		let promotionToSend = this.preparePromotion(promotion);

		let submitFunctions = this.getSubmitFunctions(directories);
		if (submitFunctions.length == 0) {
			return [];
		}

		await resizeImages(promotionToSend);
		return Promise.all(
			submitFunctions
			.map (directory => 
				this.mapPromiseToStatus(directory.name, directory.submitFunction(promotionToSend)))
		);
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

	private getSubmitFunctions(directories: string[]) {
		return directories.map((directory: string) => { 
			return {
				name: directory,
				submitFunction: this.directoryHub.getSubmitFunction(directory) as (data: Promotion) => Promise<any>
			}
		})
		.filter( directory => !!directory.submitFunction);
	}

	private mapPromiseToStatus(directory: string, promise: Promise<any>) {
		return promise
			.catch((error: any) => error)
			.then((status: any) => this.formatDirectoryResponse(directory, status));
	}
	private formatDirectoryResponse(directory: string, status: any) {
		return { directory, status };
	}

	public static getInstance(directoryHub: DirectoryHub) {
		return new Submissions(directoryHub);
	}
}

async function resizeImages(promotion: Promotion) {
	let resizeImageAsync = promisify(workers);

	let images = await Promise.all(promotion.images.map(image => resizeImageAsync(image)));
	promotion.images = images;
}
