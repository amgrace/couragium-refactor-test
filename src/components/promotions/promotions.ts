import { Request, Response, NextFunction } from "express";
import { Functions } from '../../exerciseFunctions/types';
import { Submissions } from '../../services/submission';
import { NotFoundException } from "../../exceptions/NotFoundException";
import { DIRECTORIES } from '../../services/directories'

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

			let directories = this.parseDirectories(req.query.directories);

			return this.submissions.submitSpam(promotion, directories, extraData);
		})
		.then((result: any) => {
			res.json(result);
		})
		.catch((e: Error) => {
			next(e);
		});
	}

	private parseDirectories(directories: string) {
		if(directories) {
			return directories.split(',').map((a: String) => a.trim());
		} else {
			return DIRECTORIES;
		}
	}

	public static getInstance(functions: Functions, submissions: Submissions) {
		return new Promotions(functions, submissions);
	}

}
