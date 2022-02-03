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
		clockCard.innerHTML =`
			<div class="clockTop">
				<div class="center">
					<input id='${this.Key}_TimeTitle' type="text" value="Test">
					<input id='${this.Key}_Timezone' type="number" step="0.25" value="0">
				</div>
				<div class="right">
					<button class="removeButton" onclick='RemoveClock("${this.Key}")'>X</button>
				</div>
			</div>


			<div class='clock glass frosted'>
				<div id='${this.Key}_SecondsHand' class="hand second"></div>
				<div id='${this.Key}_MinutesHand' class="hand minute"></div>
				<div id='${this.Key}_HoursHand' class="hand hour"></div>
				<div class="hand dot"></div>
				<div class="markers">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			<h3 id='${this.Key}_DigitalTime'>xx:xx:xx</h3>
			<h3 id='${this.Key}_Date'>xx:xx:xx</h3>`

		clockHolder.appendChild(clockCard);

		var titleInput = document.getElementById(`${this.Key}_TimeTitle`);
		var timezoneInput = document.getElementById(`${this.Key}_Timezone`);

		titleInput.value = name;


		timezoneInput.value = timezone;
		this.Draw();
	}

	Draw() {
		var timezoneInput = document.getElementById(`${this.Key}_Timezone`);
		var timezone = parseFloat(timezoneInput.value);

		UpdateClockFace(this.Key, timezone);
	}

	Remove(){
		var temp = document.getElementById(`${this.Key}_Clock`);
		temp.parentNode.removeChild(temp);
	}
}

AddClock(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());
AddClock("UTC", 0);
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
