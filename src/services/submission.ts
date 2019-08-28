import {Functions} from '../exerciseFunctions/types';

const DIRECTORIES = ['Google', 'Facebook', 'Yellow Pages'];

export class Submissions {

	private functions: Functions;

	protected constructor (functions: Functions) {
		this.functions = functions;
	}

	submitSpam(data: any, directories: string[], extraData: any) {
		if(extraData.start_date) data.start_date = extraData.start_date;
		if(extraData.end_date) data.end_date = extraData.end_date;

		if(!data.end_date || !data.end_date) {
			data.type = "FOREVER";
		} else {
			data.type = "TEMPORARY";
		}

		let submittingDirectories: any = {};

		return resizeImages(this.functions, data)
		.then(() => {
			var promises: any = [];

			directories.filter((a: any) => a == "Google").map(() => this.functions.submitToGoogle(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Google"] = promise});
			directories.filter((a: any) => a == "Facebook").map(() => this.functions.submitToFacebook(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Facebook"] = promise});
			directories.filter((a: any) => a == "Yellow Pages").map(() => this.functions.submitToYellowPages(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Yellow Pages"] = promise});	
		
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
