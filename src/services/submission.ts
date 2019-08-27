let {resizeImage, submitToGoogle, submitToFacebook, submitToYellowPages} = require('../exerciseFunctions');

var allDirectoriesList = "Google, Facebook, Yellow Pages";


module.exports = class Submitter {
	submitSpam(data: any, directories: any, allDirectories: any, extraData: any) {
		if(extraData.start_date) data.start_date = extraData.start_date;
		if(extraData.end_date) data.end_date = extraData.end_date;

		if(!data.end_date || !data.end_date) {
			data.type = "FOREVER";
		} else {
			data.type = "TEMPORARY";
		}

		if(allDirectories) {
			directories = allDirectoriesList.split(',').map(dir => dir.trim());
		}

		let submittingDirectories: any = {};

		return resizeImages(data)
		.then(() => {
			var promises: any = [];

			directories.filter((a: any) => a == "Google").map(() => submitToGoogle(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Google"] = promise});
			directories.filter((a: any) => a == "Facebook").map(() => submitToFacebook(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Facebook"] = promise});
			directories.filter((a: any) => a == "Yellow Pages").map(() => submitToYellowPages(data).catch((e: Error) => e)).forEach((promise: any) => {promises.push(promise); submittingDirectories["Yellow Pages"] = promise});	
		
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
}

async function resizeImages(data: any) {
	var index = 0;

	data.images.forEach(async (image: any) => {
		data.images[index++] = await resizeImage(image);
	});
}

