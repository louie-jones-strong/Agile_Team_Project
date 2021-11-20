var Clocks = [];
var ClockCount = 0;
const ClockHolder = document.getElementById("clockHolder");

class Clock
{
	constructor(name, timezone) {
		this.Timezone = timezone;

		this.Id = ClockCount;

		ClockHolder.innerHTML +=
		`<div class='clock'>
			<div class='clockFace glass'>
				<div id='${this.Id}_SecondsHand' class="hand second"></div>
				<div id='${this.Id}_MinutesHand' class="hand minute"></div>
				<div id='${this.Id}_HoursHand' class="hand hour"></div>
			</div>
			<h3 id='${this.Id}_TimeTitle'>title</h3>
			<h3 id='${this.Id}_DigitalTime'>xx:xx:xx</h3>
		</div>`

		this.HandSeconds =	document.getElementById(`${this.Id}_SecondsHand`);
		this.HandMinutes =	document.getElementById(`${this.Id}_MinutesHand`);
		this.HandHours	 =	document.getElementById(`${this.Id}_HoursHand`);

		this.DigitalTime =	document.getElementById(`${this.Id}_DigitalTime`);

		var title = document.getElementById(`${this.Id}_TimeTitle`);
		title.innerHTML = name;

		Clocks.push(this);
		ClockCount += 1;
		this.Draw();
	}

	Draw() {
		var now = new Date();

		var seconds = now.getUTCSeconds();
		var minutes = now.getUTCMinutes();
		var hours = now.getUTCHours() + this.Timezone;

		var drawSeconds = ((seconds / 60) * 360);
		var drawMinutes = ((minutes / 60) * 360);
		var drawHours = ((hours / 12) * 360);

		this.HandSeconds.style.transform = `rotate(${drawSeconds}deg)`;
		this.HandMinutes.style.transform = `rotate(${drawMinutes}deg)`;
		this.HandHours.style.transform = `rotate(${drawHours}deg)`;

		this.DigitalTime.innerHTML = `${hours}:${minutes}:${seconds}`;

		// fix for animation bump on when clock hands hit zero
		if (drawSeconds === 354 || drawSeconds === 0) {
			this.HandSeconds.style.transition = "all 0s ease 0s";
		} else {
			this.HandSeconds.style.transition = "all 0.05s cubic-bezier(0, 0, 0.52, 2.51) 0s";
		}
	}
}

new Clock("UTC", 0);
new Clock("London", 0);
new Clock("Eastern Time", -5);

setTimeout(UpdateClocks, 500);

function UpdateClocks()
{
	for (let loop = 0; loop < Clocks.length; loop++) {
		Clocks[loop].Draw();
	}

	setTimeout(UpdateClocks, 500);
}