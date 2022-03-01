var chai = require('chai');
var chaiHttp = require('chai-http');
var assert = require('assert');

chai.use(chaiHttp);
const port = "8080";


describe('Page EndPoints', function() {

	let pages = [
		"",
		"about",
		"clocks",
		"timeline",
		"calendar"
		];


	pages.forEach(page => {

		it(`testing page: "/${page}"`, function (done) {

			chai.request(`http://localhost:${port}`)
			.get(`/${page}`)
			.end((err, res) => {

				assert.equal(res.status, 200);

				done();
			});
		});

	});
});