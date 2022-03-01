const assert = require('assert');

const timeUtility = require('../public/Shared/Optinal/TimeUtility.js');


describe('TimeUtility', function ()
{
	describe('MsConstValues', function ()
	{
		it('MsPerSecond: 1000ms = 1s', function () {
			assert.equal(timeUtility.MsPerSecond, 1000);
		});

		it('MsPerMinute: 60 * 1000ms = 1m', function () {
			assert.equal(timeUtility.MsPerMinute, 60 * 1000);
		});

		it('MsPerHour: 60 * 60 * 1000ms = 1h', function () {
			assert.equal(timeUtility.MsPerHour, 60 * 60 * 1000);
		});

		it('MsPerDay: 24 * 60 * 60 * 1000ms = 1d', function () {
			assert.equal(timeUtility.MsPerDay, 24 * 60 * 60 * 1000);
		});
	});

	describe('HourTo12Hour()', function ()
	{
		describe('int values', function ()
		{
			it('HourTo12Hour(-1)', function () {

				let output = timeUtility.HourTo12Hour(-1);
				assert.equal(output[0], 11);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(0)', function () {

				let output = timeUtility.HourTo12Hour(0);
				assert.equal(output[0], 0);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour(11)', function () {

				let output = timeUtility.HourTo12Hour(11);
				assert.equal(output[0], 11);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour(12)', function () {

				let output = timeUtility.HourTo12Hour(12);
				assert.equal(output[0], 0);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(13)', function () {

				let output = timeUtility.HourTo12Hour(13);
				assert.equal(output[0], 1);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(23)', function () {

				let output = timeUtility.HourTo12Hour(23);
				assert.equal(output[0], 11);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(24)', function () {

				let output = timeUtility.HourTo12Hour(24);
				assert.equal(output[0], 0);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(25)', function () {

				let output = timeUtility.HourTo12Hour(25);
				assert.equal(output[0], 1);
				assert.equal(output[1], false);
			});
		});

		describe('float values', function ()
		{
			it('HourTo12Hour(-0.5)', function () {

				let output = timeUtility.HourTo12Hour(-0.5);
				assert.equal(output[0], 11.5);
				assert.equal(output[1], true);
			});


			it('HourTo12Hour(0.5)', function () {

				let output = timeUtility.HourTo12Hour(0.5);
				assert.equal(output[0], 0.5);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour(11.5)', function () {

				let output = timeUtility.HourTo12Hour(11.5);
				assert.equal(output[0], 11.5);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour(12.5)', function () {

				let output = timeUtility.HourTo12Hour(12.5);
				assert.equal(output[0], 0.5);
				assert.equal(output[1], true);
			});

			it('HourTo12Hour(24.5)', function () {

				let output = timeUtility.HourTo12Hour(24.5);
				assert.equal(output[0], 0.5);
				assert.equal(output[1], false);
			});
		});

		describe('handling invalid values', function ()
		{
			it('HourTo12Hour()', function () {

				let output = timeUtility.HourTo12Hour();
				assert.equal(output[0], 0);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour("string")', function () {

				let output = timeUtility.HourTo12Hour("string");
				assert.equal(output[0], 0);
				assert.equal(output[1], false);
			});

			it('HourTo12Hour(null)', function () {

				let output = timeUtility.HourTo12Hour(null);
				assert.equal(output[0], 0);
				assert.equal(output[1], false);
			});
		});
	});
});