import { resizeImage } from '../../exerciseFunctions/functions';

function resizeImageWithWorkers (image: Buffer, callback: (err: Error | null, image: Buffer) => void) {
	let resizedImage = resizeImage(image);
	callback(null, resizedImage);
}

export = resizeImageWithWorkers;
