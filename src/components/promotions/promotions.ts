import { Request, Response, NextFunction } from "express";
import { Submissions } from '../../services/submission';
import { NotFoundException } from "../../exceptions/NotFoundException";
import { DIRECTORIES } from '../../services/directories'
import { PromotionsRepository } from "repositories/PromotionsRepository";

export class Promotions {

	private promotionsRepository: PromotionsRepository;
	private submissions: Submissions;

	protected constructor (promotionsRepository: PromotionsRepository, submissions: Submissions) {
		this.promotionsRepository = promotionsRepository;
		this.submissions = submissions;
	}

	submit = (req: Request, res: Response, next: NextFunction) => {
		return this.promotionsRepository.getPromotionInstance(parseInt(req.params.promotionId))
		.then((promotion: any) => {
			if(!promotion) throw new NotFoundException("No promotion found");

			let directories = this.parseDirectories(req.query.directories);

			return this.submissions.submitSpam(promotion, directories);
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

	public static getInstance(repository: PromotionsRepository, submissions: Submissions) {
		return new Promotions(repository, submissions);
	}

}
