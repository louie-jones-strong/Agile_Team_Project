var Clocks = [];
var ClockCount = 0;

class Clock
{
	constructor(name, timezone) {

		this.Key = `${ClockCount}`;

		var clockHolder = document.getElementById("clockHolder");

		var clockCard = document.createElement("div");
		clockCard.id = `${this.Key}_Clock`
		clockCard.classList = "card glass"
		clockCard.innerHTML =
			`<input id='${this.Key}_TimeTitle' type="text" value="Test">
			<input id='${this.Key}_Timezone' type="number" value="0">
			<button class="removeButton" onclick='RemoveClock("${this.Key}")'>X</button>
			<div class='clock glass'>
				<div id='${this.Key}_SecondsHand' class="hand second"></div>
				<div id='${this.Key}_MinutesHand' class="hand minute"></div>
				<div id='${this.Key}_HoursHand' class="hand hour"></div>
				<div class="hand dot"></div>
			</div>
			<h3 id='${this.Key}_DigitalTime'>xx:xx:xx</h3>`

		clockHolder.appendChild(clockCard);

		var titleInput = document.getElementById(`${this.Key}_TimeTitle`);
		var timezoneInput = document.getElementById(`${this.Key}_Timezone`);

		titleInput.value = name;


		timezoneInput.value = timezone;
		this.Draw();
	}

	Draw() {
		var handSeconds =	document.getElementById(`${this.Key}_SecondsHand`);
		var handMinutes =	document.getElementById(`${this.Key}_MinutesHand`);
		var handHours	 =	document.getElementById(`${this.Key}_HoursHand`);
		var digitalTime =	document.getElementById(`${this.Key}_DigitalTime`);

		var timezoneInput = document.getElementById(`${this.Key}_Timezone`);
		var timezone = parseInt(timezoneInput.value);

		var now = new Date();
		var offsetTime = AddOffset(now, timezone);

		var seconds = offsetTime.getUTCSeconds();
		var minutes = offsetTime.getUTCMinutes();
		var hours = offsetTime.getUTCHours();

		this.UpdateHandAngle(handSeconds, (seconds / 60) * 360);
		this.UpdateHandAngle(handMinutes, (minutes / 60) * 360);
		this.UpdateHandAngle(handHours, (hours / 12) * 360);

		digitalTime.innerHTML = TimeToString(offsetTime, true);
	}

	UpdateHandAngle(hand, angle)
	{
		hand.style.transform = `rotate(${angle}deg)`;

		// fix for animation bump on when clock hands hit zero
		if (angle === 354 || angle === 0) {
			hand.style.transition = "all 0s ease 0s";
		} else {
			hand.style.transition = "all 0.05s cubic-bezier(0, 0, 0.52, 2.51) 0s";
		}
	}

	Remove(){
		var temp = document.getElementById(`${this.Key}_Clock`);
		temp.parentNode.removeChild(temp);
	}
}

AddClock("UTC", 0);
AddClock("London", 0);
AddClock("Eastern Time", -5);

UpdateClocks();

function UpdateClocks()
{
	for (let loop = 0; loop < Clocks.length; loop++) {
		Clocks[loop].Draw();
	}

	setTimeout(UpdateClocks, 250);
}

function AddClock(name, timeOffset)
{
	var newClock = new Clock(name, timeOffset);
	Clocks.push(newClock);
	ClockCount += 1;
}

function RemoveClock(clockKey)
{
	for (let loop = 0; loop < Clocks.length; loop++)
	{
		const item = Clocks[loop];
		if ( item.Key === clockKey)
		{
			item.Remove();
			Clocks.splice(loop, 1);
			break;
		}
	}
}
