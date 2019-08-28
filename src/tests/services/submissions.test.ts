import spies = require("chai-spies");
const expect = require("chai").expect;
const chai = require("chai");

import { Functions, Promotion } from '../../exerciseFunctions/types';
import { Submissions } from '../../services/submission';
import { DIRECTORIES, DirectoryHub } from '../../services/directories'

chai.use(spies);

describe("Submit span", function() {
	it("without end_date overwrites type to FOREVER", async function() {
		let promotion = mockPromotion();
		let data: Partial<Promotion> = promotion;
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		data.end_date = undefined;
		data.type = 'TEMPORARY';
		let expected = Object.assign({}, data);
		expected.start_date = new Date();
		expected.type = 'FOREVER';

		await submissions.submitSpam(data, ['Google']);
		expect(spyGoogle).to.have.been.called();
	});

	it("with end_date overwrites type to TEMPORARY", async function() {
		let promotion = mockPromotion();
		let data: Partial<Promotion> = promotion;
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		data.type = 'FOREVER';
		let expected = Object.assign({}, data);
		expected.start_date = new Date();
		expected.type = 'TEMPORARY';

		await submissions.submitSpam(data, ['Google']);
		expect(spyGoogle).to.have.been.called();
	});

	it("to all directories, sends promotion to all", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		let response = await submissions.submitSpam(promotion, DIRECTORIES);
		expect(spyGoogle).to.have.been.called();
		expect(spyFacebook).to.have.been.called();
		expect(spyYellowPages).to.have.been.called();
	});

	it("to any directories, doesn't send the promotion", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		let response = await submissions.submitSpam(promotion, []);
		expect(spyGoogle).to.not.have.been.called();
		expect(spyFacebook).to.not.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Google directory, sends only to Google", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		let response = await submissions.submitSpam(promotion, ['Google']);
		expect(spyGoogle).to.have.been.called();
		expect(spyFacebook).to.not.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Facebook directory, sends only to Facebook", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		let response = await submissions.submitSpam(promotion, ['Facebook']);
		expect(spyGoogle).to.not.have.been.called();
		expect(spyFacebook).to.have.been.called();
		expect(spyYellowPages).to.not.have.been.called();
	});

	it("to Yellow Pages directory, sends only to Yellow Pages", async function() {
		let promotion = mockPromotion();
		let { submissions, spyGoogle, spyFacebook, spyYellowPages } = mockSubmissions();
		let response = await submissions.submitSpam(promotion, ['Yellow Pages']);
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
		images: new Array(1).fill(Buffer.from('image1')),
	};
}

function mockFunctions(): Functions {
	return {
		resizeImage: (image: Buffer) => image,
		submitToGoogle: (data: Promotion) => Promise.resolve({message: 'submitted'}),
		submitToFacebook: (data: Promotion) => Promise.resolve({message: 'submitted'}),
		submitToYellowPages: (data: Promotion) => Promise.resolve({message: 'submitted'}),
	}
}

function mockSubmissions() {
	let functions = mockFunctions();
	let spyGoogle = chai.spy.on(functions, 'submitToGoogle');
	let spyFacebook = chai.spy.on(functions, 'submitToFacebook');
	let spyYellowPages = chai.spy.on(functions, 'submitToYellowPages');
	let directoryHub = DirectoryHub.getInstance()
	.addSubmitFunction('Google', functions.submitToGoogle)
	.addSubmitFunction('Facebook', functions.submitToFacebook)
	.addSubmitFunction('Yellow Pages', functions.submitToYellowPages)

	let submissions = Submissions.getInstance(directoryHub);

	return { submissions, spyGoogle, spyFacebook, spyYellowPages };
}
