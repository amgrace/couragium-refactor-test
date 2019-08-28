import chaiHttp = require("chai-http");
const expect = require("chai").expect;
import server from "../server";
const chai = require("chai");
import { DIRECTORY } from '../services/directories';

chai.use(chaiHttp);

describe("[Regression] Submit a promotion", function() {
	this.timeout(7000);
	it("that doesn't exists returns 400", function(done) {
		chai
			.request(server)
			.post("/promotions/submit/0")
			.end((_: any, response: any) => {
				expect(response).to.have.status(400);
				expect(response).to.be.json;
				done();
			});
	});

	it("that exists returns 200", done => {
		chai
			.request(server)
			.post("/promotions/submit/42")
			.end((_: any, response: any) => {
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				done();
			});
	});

	it("with a directory that doesn't exists doesn't fail and doesn't send the promotion", done => {
		chai
			.request(server)
			.post("/promotions/submit/42?directories=Unknown")
			.end((_: any, response: any) => {
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				const body = JSON.parse(response.text)
				expect(body.length).to.eq(0);
				done();
			});
	});

	it("with directory Google selected only sends to Google", done => {
		chai
			.request(server)
			.post("/promotions/submit/42?directories=Google")
			.end((_: any, response: any) => {
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				const body = JSON.parse(response.text)
				expect(body.length).to.eq(1);
				expect(body[0].directory).to.eq(DIRECTORY.GOOGLE);
				done();
			});
	});

	it("with directory Facebook selected only sends to Facebook", done => {
		chai
			.request(server)
			.post("/promotions/submit/42?directories=Facebook")
			.end((_: any, response: any) => {
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				const body = JSON.parse(response.text)
				expect(body.length).to.eq(1);
				expect(body[0].directory).to.eq(DIRECTORY.FACEBOOK);
				done();
			});
	});

	it("with directory Yellow Pages selected only sends to Yellow Pages", done => {
		chai
			.request(server)
			.post("/promotions/submit/42?directories=Yellow Pages")
			.end((_: any, response: any) => {
				expect(response).to.have.status(200);
				expect(response).to.be.json;
				const body = JSON.parse(response.text)
				expect(body.length).to.eq(1);
				expect(body[0].directory).to.eq(DIRECTORY.YELLOW_PAGES);
				done();
			});
	});

});
