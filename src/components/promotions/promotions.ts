import { Request, Response, NextFunction } from "express";
import { Functions } from '../../exerciseFunctions/types';
import { Submissions } from '../../services/submission';
import { NotFoundException } from "../../exceptions/NotFoundException";

export class Promotions {

	private functions: Functions;
	private submissions: Submissions;

	protected constructor (functions: Functions, submissions: Submissions) {
		this.functions = functions;
		this.submissions = submissions;
	}

	submit = (req: Request, res: Response, next: NextFunction) => {
		return this.functions.getPromotionInstance(parseInt(req.params.promotionId))
		.then((promotion: any) => {
			if(!promotion) throw new NotFoundException("No promotion found");

			let extraData: any = {};

			if(promotion.start_date.getTime() < (new Date).getTime())
				extraData.start_date = new Date();

			var allDirectories = true;
			var directories = [];

			if(req.query.directories) {
				directories = req.query.directories.split(',').map((a: String) => a.trim());
				allDirectories = false;
			}

			return this.submissions.submitSpam(promotion, directories, allDirectories, extraData);
		})
		.then((result: any) => {
			res.status(200);
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(result));
		})
		.catch((e: Error) => {
			next(e);
		});
	}

	public static getInstance(functions: Functions, submissions: Submissions) {
		return new Promotions(functions, submissions);
	}

}
