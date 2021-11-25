function AddOffset(time, hourOffset)
{
	const msPreHour = 60*60*1000;

	var timeMs = time.getTime();


	timeMs += msPreHour * hourOffset;

	return new Date(timeMs);
}

function TimeToString(time, is12Hour)
{
	var hours = time.getUTCHours();
	var minutes = time.getUTCMinutes();
	var seconds = time.getUTCSeconds();

	if (is12Hour)
	{
		[hours, isPm] = HourTo12Hour(hours);
	}

	var hoursString = FixedCharCountNumber(hours, 2);

	var minutesString = FixedCharCountNumber(minutes, 2);

	var secondsString = FixedCharCountNumber(seconds, 2);

	var timeString = `${hoursString}:${minutesString}:${secondsString}`;

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
	var isPm = hour >= 12;
	hour = hour % 12;

	return [hour, isPm];
}

function FixedCharCountNumber(number, charCount)
{
	var numberString = `${number}`;

	var zerosToAdd = Math.max(0, (charCount - numberString.length));

	numberString = "0".repeat(zerosToAdd) + numberString;

	return numberString;
}

function DateToString(time, isNumbers)
{
	var years = time.getUTCFullYear();
	var months = time.getUTCMonth();
	var days = time.getDate();

	if (isNumbers)
	{
		var dateString = `${days}/${months}/${years}`;
	}
	else
	{
		var yearsString = `${years}`;
		var monthsString = GetMonthString(months);
		var daysString = GetOrdinalString(days);

		var dateString = `${daysString} of ${monthsString} ${years}`;
	}
	return dateString;
}

/// 1 -> 1st, 2 -> 2nd, 3 -> 3rd, 4 -> 4th
function GetOrdinalString(number)
{
	var lastDigit = number % 10;

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
