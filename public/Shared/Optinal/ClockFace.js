function UpdateClockFace(faceKey, timezone)
{
	let handSeconds =	document.getElementById(`${faceKey}_SecondsHand`);
	let handMinutes =	document.getElementById(`${faceKey}_MinutesHand`);
	let handHours	 =	document.getElementById(`${faceKey}_HoursHand`);
	let digitalTime =	document.getElementById(`${faceKey}_DigitalTime`);
	let date =	document.getElementById(`${faceKey}_Date`);



	let now = new Date();
	let offsetTime = AddHoursOffset(now, timezone);

	let seconds = offsetTime.getUTCSeconds();
	let minutes = offsetTime.getUTCMinutes();
	let hours = offsetTime.getUTCHours();

	UpdateHandAngle(handSeconds, (seconds / 60) * 360);
	UpdateHandAngle(handMinutes, (minutes / 60) * 360);
	UpdateHandAngle(handHours, (hours / 12) * 360);

	if (digitalTime != null)
	{
		digitalTime.innerHTML = TimeToString(offsetTime, true);
	}

	if (date != null)
	{
		date.innerHTML = DateToString(offsetTime, true);
	}
}

function UpdateHandAngle(hand, angle)
{
	hand.style.transform = `rotate(${angle}deg)`;

	// fix for animation bump on when clock hands hit zero
	if (angle === 354 || angle === 0) {
		hand.style.transition = "all 0s ease 0s";
	} else {
		hand.style.transition = "all 0.05s cubic-bezier(0, 0, 0.52, 2.51) 0s";
	}
}