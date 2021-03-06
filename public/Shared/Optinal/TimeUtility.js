const MsPerSecond = 1000;
const MsPerMinute = MsPerSecond * 60;
const MsPerHour = MsPerMinute * 60;
const MsPerDay = MsPerHour * 24;

function GetUserTimeZone()
{
	return new Date().getTimezoneOffset() / -60;
}

function AddHoursOffset(time, hourOffset)
{

	let timeMs = time.getTime();


	timeMs += MsPerHour * hourOffset;

	return new Date(timeMs);
}

function AddDaysOffset(time, dayOffset)
{

	let timeMs = time.getTime();


	timeMs += MsPerDay * dayOffset;

	return new Date(timeMs);
}

function AddMonthsOffset(time, monthOffset)
{
	let newTime = new Date(time.valueOf());

	let month = time.getMonth();
	newTime.setUTCMonth(month + monthOffset, 1);
	return newTime;
}

function TimeToString(time, is12Hour, showSeconds)
{
	let hours = time.getUTCHours();
	let minutes = time.getUTCMinutes();
	let seconds = time.getUTCSeconds();
	let isPm = false;

	if (is12Hour)
	{
		let temp = HourTo12Hour(hours);
		hours = temp.Hour;
		isPm = temp.IsPm;
	}

	let hoursString = FixedCharCountNumber(hours, 2, 0);

	let minutesString = FixedCharCountNumber(minutes, 2, 0);

	let secondsString = FixedCharCountNumber(seconds, 2, 0);

	let timeString = `${hoursString}:${minutesString}`;
	if (showSeconds)
	{
		timeString += `:${secondsString}`;
	}

	if (is12Hour)
	{
		timeString += " ";
		if (isPm)
		{
			timeString += "PM";
		}
		else
		{
			timeString += "AM";
		}
	}

	return timeString;
}

function GetFirstDayOfTheMonth(time)
{
	let newTime = new Date(time.valueOf());

	//offset back to the start of the month
	newTime.setDate(1);
	return newTime.getDay();
}

function GetDaysInMonth(time, monthOffset)
{
	let newTime = AddMonthsOffset(time, monthOffset)

	let ms = newTime.valueOf();
	newTime = new Date(ms - MsPerDay);

	return newTime.getDate();
}

function IsSameDay(now1, now2)
{

	return now1.getUTCFullYear() == now2.getUTCFullYear() &&
		now1.getUTCMonth() == now2.getUTCMonth() &&
		now1.getDate() == now2.getDate();
}

function GetMonthOffset(now1, now2)
{
	let monthOffset = (now1.getUTCFullYear() - now2.getUTCFullYear()) * 12;

	monthOffset += now1.getUTCMonth() - now2.getUTCMonth()

	return monthOffset;
}

function DateToString(time, isNumbers, showDay=true, showYear=true)
{
	let years = time.getUTCFullYear();
	let months = time.getUTCMonth();
	let days = time.getDate();

	let dateString = "";

	if (isNumbers)
	{
		if (showDay)
		{
			dateString += `${days}/`;
		}

		dateString += `${months}`;

		if (showYear)
		{
			dateString += `/${years}`;
		}
	}
	else
	{
		let yearsString = `${years}`;
		let monthsString = GetMonthString(months);
		let daysString = GetOrdinalString(days);

		if (showDay)
		{
			dateString += `${daysString} of `;
		}

		dateString += `${monthsString}`;

		if (showYear)
		{
			dateString += ` ${years}`;
		}
	}
	return dateString;
}

//#region formatting funcs
function HourTo12Hour(hour)
{
	hour = parseFloat(hour);
	if (isNaN(hour))
	{
		hour = 0;
	}

	if (hour > 24)
	{
		hour %= 24;
	}

	if (hour < 0)
	{
		hour = 24 + hour;
	}

	let isPm = hour >= 12;
	hour = hour % 12;

	return {Hour:hour, IsPm:isPm};
}

function FixedCharCountNumber(number, minLeadingChars, minTrailingChars)
{
	let leadingString = `${Math.round(number)}`;
	let trailingString = `${number}`;
	trailingString = trailingString.substring(leadingString.length + 1);

	let leadingZerosToAdd = Math.max(0, (minLeadingChars - leadingString.length));
	let trailingZerosToAdd = Math.max(0, (minTrailingChars - trailingString.length));
	let addDecimalPoint = trailingString.length == 0 && minTrailingChars > 0;

	let numberString = "0".repeat(leadingZerosToAdd);
	numberString += number;
	if (addDecimalPoint)
	{
		numberString += ".";
	}
	numberString += "0".repeat(trailingZerosToAdd);

	return numberString;
}

/// 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th
function GetOrdinalString(number)
{
	let lastDigit = number % 10;

	if (!(10 < number && number <= 20))
	{
		if (lastDigit == 1)
		{
			return `${number}st`;
		}
		else if (lastDigit == 2)
		{
			return `${number}nd`;
		}
		else if (lastDigit == 3)
		{
			return `${number}rd`;
		}
	}
	return `${number}th`;
}

function GetMonthString(month)
{
	if (month == 0)
		return "January";
	if (month == 1)
		return "February";
	if (month == 2)
		return "March";
	if (month == 3)
		return "April";
	if (month == 4)
		return "May";
	if (month == 5)
		return "June";
	if (month == 6)
		return "July";
	if (month == 7)
		return "August";
	if (month == 8)
		return "September";
	if (month == 9)
		return "October";
	if (month == 10)
		return "November";
	if (month == 11)
		return "December";

	return "invalid";
}
//#endregion

// for testing
if (typeof exports != 'undefined')
{
	module.exports = {
		//const
		MsPerSecond,
		MsPerMinute,
		MsPerHour,
		MsPerDay,

		//formatting funcs
		HourTo12Hour,
		FixedCharCountNumber,
		GetOrdinalString,
		GetMonthString,
	};
}