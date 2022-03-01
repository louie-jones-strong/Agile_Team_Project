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

		let tests = [
			// int values
			{Input: -1, Expected: {Hour:-1, IsPm:true}},
			{Input: 0, Expected: {Hour:0, IsPm:false}},
			{Input: 1, Expected: {Hour:1, IsPm:false}},
			{Input: 11, Expected: {Hour:11, IsPm:false}},
			{Input: 12, Expected: {Hour:0, IsPm:true}},
			{Input: 13, Expected: {Hour:1, IsPm:true}},
			{Input: 23, Expected: {Hour:11, IsPm:true}},
			{Input: 24, Expected: {Hour:0, IsPm:true}},
			{Input: 25, Expected: {Hour:1, IsPm:false}},
			// float values
			{Input: -0.5, Expected: {Hour:-0.5, IsPm:true}},
			{Input: 0.5, Expected: {Hour:0.5, IsPm:false}},
			{Input: 11.5, Expected: {Hour:11.5, IsPm:false}},
			{Input: 12.5, Expected: {Hour:0.5, IsPm:true}},
			{Input: 23.5, Expected: {Hour:11.5, IsPm:true}},
			{Input: 24.5, Expected: {Hour:0.5, IsPm:false}},
			// handling invalid values
			{Input: null, Expected: {Hour:0, IsPm:false}},
			{Input: "string", Expected: {Hour:0, IsPm:false}},
			{Input: undefined, Expected: {Hour:0, IsPm:false}},
			];

		tests.forEach(test => {
			it(`HourTo12Hour(${test.Input})`, function () {

				let output = timeUtility.HourTo12Hour(test.Input);
				assert.equal(output[0], test.Expected.Hour);
				assert.equal(output[1], test.Expected.IsPm);
			});
		});
	});
});