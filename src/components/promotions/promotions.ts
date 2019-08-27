import { Request, Response } from "express";
import { Functions } from '../../exerciseFunctions/types';
import * as functionsService from '../../exerciseFunctions';
import { Submissions } from '../../services/submission';

export class Promotions {

	private functions: Functions;
	private submissions: Submissions;

	protected constructor (functions: Functions, submissions: Submissions) {
		this.functions = functions;
		this.submissions = submissions;
	}

	submit = (req: Request, res: Response) => {
		return this.functions.getPromotionInstance(parseInt(req.params.promotionId))
		.then((promotion: any) => {
			if(!promotion) throw new Error("No promotion found");

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
			console.log(e)
			if(e && e.message && e.message === "No promotion found") {
				res.status(400);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({message: "Not found"}));
			} else {
				res.status(500);
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({message: "Internal Error"}));
			}
		})
		.catch((e: Error) => console.log(e));
	}

	public static getInstance(functions: Functions, submissions: Submissions) {
		return new Promotions(functions, submissions);
	}

}
