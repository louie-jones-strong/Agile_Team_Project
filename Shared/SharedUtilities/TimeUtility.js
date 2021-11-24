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
	var isPm = hour > 12;
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