export type PromotionType = 'FOREVER' | 'TEMPORARY';

export type Promotion = {
	start_date: Date,
	end_date: Date,
	type: PromotionType,
	images: Buffer[],
};

export interface Functions {
	resizeImage(image: Buffer): Buffer;
	submitToGoogle(data: Promotion): Promise<{message: 'submitted'}>;
 	submitToFacebook(data: Promotion): Promise<{message: 'submitted'}>;
 	submitToYellowPages(data: Promotion): Promise<{message: 'submitted'}>;
}
