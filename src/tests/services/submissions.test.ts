import spies = require("chai-spies");
const expect = require("chai").expect;
const chai = require("chai");

import { Functions, Promotion } from '../../exerciseFunctions/types';
import { Submissions } from '../../services/submission';

chai.use(spies);

describe("Submit span", function() {
	it("without end_date overwrites type to FOREVER", async function() {
		let promotion = mockPromotion();
		let data: Partial<Promotion> = promotion;
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		data.end_date = undefined;
		data.type = 'TEMPORARY';
		let expected = Object.assign({}, data);
		expected.type = 'FOREVER';

		let response = await submissions.submitSpam(data, ['Google'], false, {});
		expect(spyGoogle).to.have.been.called.with(expected);
	});

	it("with end_date overwrites type to TEMPORARY", async function() {
		let promotion = mockPromotion();
		let data: Partial<Promotion> = promotion;
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		data.type = 'FOREVER';
		let expected = Object.assign({}, data);
		expected.type = 'TEMPORARY';

		let response = await submissions.submitSpam(data, ['Google'], false, {});
		expect(spyGoogle).to.have.been.called.with(expected);
	});

	it("to all directories, sends promotion to all", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		let response = await submissions.submitSpam(promotion, [], true, {});
		expect(spyGoogle).to.have.been.called();
		expect(spyFacebook).to.have.been.called();
		expect(spyYellowPages).to.have.been.called();
	});

	it("to any directories, doesn't send the promotion", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		let response = await submissions.submitSpam(promotion, [], false, {});
		expect(spyGoogle).to.not.have.been.called();
		expect(spyFacebook).to.not.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Google directory, sends only to Google", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		let response = await submissions.submitSpam(promotion, ['Google'], false, {});
		expect(spyGoogle).to.have.been.called();
		expect(spyFacebook).to.not.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Facebook directory, sends only to Facebook", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		let response = await submissions.submitSpam(promotion, ['Facebook'], false, {});
		expect(spyGoogle).to.not.have.been.called();
		expect(spyFacebook).to.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Yellow Pages directory, sends only to Yellow Pages", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions(promotion);
		let response = await submissions.submitSpam(promotion, ['Yellow Pages'], false, {});
		expect(spyGoogle).to.not.have.been.called();
		expect(spyFacebook).to.not.have.been.called();
		expect(spyYellowPages).to.have.been.called();
	});

});

function mockPromotion(): Promotion {
	return {
		start_date: new Date('2018-07-25'),
		end_date: new Date('2021-07-25'),
		type: 'FOREVER',
		images: new Array(12).fill(Buffer.from('image1')),
	};
}

function mockFunctions(promotion: Promotion): Functions {
	return {
		getPromotionInstance: (id: number) => Promise.resolve(promotion),
		resizeImage: (image: Buffer) => image,
		submitToGoogle: (data: Promotion) => Promise.resolve({message: 'submitted'}),
		submitToFacebook: (data: Promotion) => Promise.resolve({message: 'submitted'}),
		submitToYellowPages: (data: Promotion) => Promise.resolve({message: 'submitted'}),
	}
}

function mockSubmissions(promotion: Promotion) {
	let functions = mockFunctions(promotion);
	let spyGoogle = chai.spy.on(functions, 'submitToGoogle');
	let spyFacebook = chai.spy.on(functions, 'submitToFacebook');
	let spyYellowPages = chai.spy.on(functions, 'submitToYellowPages');

	let submissions = Submissions.getInstance(functions);

	return { submissions, spyGoogle, spyFacebook, spyYellowPages };
}
