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
				assert.equal(output.Hour, test.Expected.Hour);
				assert.equal(output.IsPm, test.Expected.IsPm);
			});
		});
	});
	describe('GetOrdinalString()', function ()
	{

		let tests = [
			{Input: 0, Expected: "0th"},
			{Input: 1, Expected: "1st"},
			{Input: 2, Expected: "2nd"},
			{Input: 3, Expected: "3rd"},
			{Input: 4, Expected: "4th"},
			{Input: 5, Expected: "5th"},
			{Input: 6, Expected: "6th"},
			{Input: 7, Expected: "7th"},
			{Input: 8, Expected: "8th"},
			{Input: 9, Expected: "9th"},
			{Input: 10, Expected: "10th"},
			{Input: 11, Expected: "11th"},
			{Input: 12, Expected: "12th"},
			{Input: 13, Expected: "13th"},
			{Input: 20, Expected: "20th"},
			{Input: 21, Expected: "21st"},
			{Input: 22, Expected: "22nd"},
			{Input: 23, Expected: "23rd"},
			{Input: 24, Expected: "24th"},
			];

		tests.forEach(test => {
			it(`GetOrdinalString(${test.Input})`, function () {

				let output = timeUtility.GetOrdinalString(test.Input);
				assert.equal(output, test.Expected);
			});
		});
	});

	describe('GetMonthString()', function ()
	{

		let tests = [
			{Input: -1, Expected: "invalid"},
			{Input: 0, Expected: "January"},
			{Input: 1, Expected: "February"},
			{Input: 2, Expected: "March"},
			{Input: 3, Expected: "April"},
			{Input: 4, Expected: "May"},
			{Input: 5, Expected: "June"},
			{Input: 6, Expected: "July"},
			{Input: 7, Expected: "August"},
			{Input: 8, Expected: "September"},
			{Input: 9, Expected: "October"},
			{Input: 10, Expected: "November"},
			{Input: 11, Expected: "December"},
			{Input: 12, Expected: "invalid"},
			{Input: undefined, Expected: "invalid"},
			{Input: null, Expected: "invalid"},
			{Input: "string", Expected: "invalid"},
			];

		tests.forEach(test => {
			it(`GetMonthString(${test.Input})`, function () {

				let output = timeUtility.GetMonthString(test.Input);
				assert.equal(output, test.Expected);
			});
		});
	});
});