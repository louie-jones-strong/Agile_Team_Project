const MsPerSecond = 1000;
const MsPerMinute = MsPerSecond * 60;
const MsPerHour = MsPerMinute * 60;
const MsPerDay = MsPerHour * 24;

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

function TimeToString(time, is12Hour)
{
	let hours = time.getUTCHours();
	let minutes = time.getUTCMinutes();
	let seconds = time.getUTCSeconds();

	if (is12Hour)
	{
		[hours, isPm] = HourTo12Hour(hours);
	}

	let hoursString = FixedCharCountNumber(hours, 2);

	let minutesString = FixedCharCountNumber(minutes, 2);

	let secondsString = FixedCharCountNumber(seconds, 2);

	let timeString = `${hoursString}:${minutesString}:${secondsString}`;

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

function HourTo12Hour(hour)
{
	let isPm = hour >= 12;
	hour = hour % 12;

	return [hour, isPm];
}

function FixedCharCountNumber(number, charCount)
{
	let numberString = `${number}`;

	let zerosToAdd = Math.max(0, (charCount - numberString.length));

	numberString = "0".repeat(zerosToAdd) + numberString;

	return numberString;
}

function DateToString(time, isNumbers)
{
	let years = time.getUTCFullYear();
	let months = time.getUTCMonth();
	let days = time.getDate();

	let dateString = "";

	if (isNumbers)
	{
		dateString = `${days}/${months}/${years}`;
	}
	else
	{
		let yearsString = `${years}`;
		let monthsString = GetMonthString(months);
		let daysString = GetOrdinalString(days);

		dateString = `${daysString} of ${monthsString} ${years}`;
	}
	return dateString;
}

/// 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th
function GetOrdinalString(number)
{
	let lastDigit = number % 10;

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
}

function GetUserTimeZone()
{
	return new Date().getTimezoneOffset() / -60;
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