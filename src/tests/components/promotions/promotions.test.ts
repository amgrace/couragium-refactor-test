import spies = require("chai-spies");
const expect = require("chai").expect;
const chai = require("chai");

import { Functions, Promotion } from "../../../exerciseFunctions/types";
import { Promotions } from "../../../components/promotions";
import { Submissions } from "../../../services/submission";
import { Request, Response } from "express";
import { Dictionary } from "express-serve-static-core";
import { PromotionsRepository } from "repositories/PromotionsRepository";

chai.use(spies);

describe("Submit a promotion", function() {
	beforeEach(function() {
		chai.spy.restore();
	});

	it("that doesn't exists returns 400", async function() {
		let promotion = null;
		let { promotions } = mockPromotions(promotion);

		let req = mockRequest({ promotionId: "0" }, {});
		let res = mockResponse();
		let spyNext = chai.spy(mockNextFunction());

		await promotions.submit(req, res, spyNext);
		expect(spyNext).to.have.been.called();
	});

	it("that exists returns 200", async function() {
		let promotion = mockPromotion();
		let { promotions } = mockPromotions(promotion);

		let req = mockRequest({ promotionId: "42" }, {});
		let res = mockResponse();
		let spyNext = chai.spy(mockNextFunction());
		let spyResponse = chai.spy.on(res, 'json');

		await promotions.submit(req, res, spyNext);
		expect(spyNext).to.not.have.been.called();
		expect(spyResponse).to.have.been.called();
	});

});

function mockRequest(params: Dictionary<string>, query: any) {
	let req = {} as Request;
	req.params = params;
	req.query = query
	return req;
}

function mockResponse() {
	let res = {} as Response;
	res.status = (code: number) => res;
	res.json = (body?: any) => res;
	res.setHeader = (field: string, value?: string | number | string[]) => res;
	res.end = (body: any) => res;
	return res;
}

function mockNextFunction() {
	return (err?: any) => {};
}

function mockPromotion(): Promotion {
	return {
		start_date: new Date("2018-07-25"),
		end_date: new Date("2021-07-25"),
		type: "FOREVER",
		images: new Array(12).fill(Buffer.from("image1"))
	};
}

function mockRepository(promotion: Promotion | null): PromotionsRepository {
	return {
		getPromotionInstance: (id: number) => Promise.resolve(promotion)
	};
}

function mockFunctions(): Functions {
	return {
		resizeImage: (image: Buffer) => image,
		submitToGoogle: (data: Promotion) =>
			Promise.resolve({ message: "submitted" }),
		submitToFacebook: (data: Promotion) =>
			Promise.resolve({ message: "submitted" }),
		submitToYellowPages: (data: Promotion) =>
			Promise.resolve({ message: "submitted" })
	};
}

function mockPromotions(promotion: Promotion | null) {
	let repository = mockRepository(promotion);
	let functions = mockFunctions();
	let submissions = Submissions.getInstance(functions);
	let promotions: Promotions = Promotions.getInstance(repository, submissions);

	return { promotions };
}
