import chaiHttp = require("chai-http");
const expect = require("chai").expect;
import server from "../server";
const chai = require("chai");

chai.use(chaiHttp);

describe("Server", () => {
	it("is reachable and gets 404 for root", done => {
		chai
			.request(server)
			.post("/")
			.end((_: any, res: any) => {
				expect(res).to.have.status(404);
				done();
			});
	});
});
