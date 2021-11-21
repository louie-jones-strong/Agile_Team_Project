var Clocks = [];
var ClockCount = 0;
const ClockHolder = document.getElementById("clockHolder");

class Clock
{
	constructor(name, timezone) {
		this.Timezone = timezone;

		this.Id = ClockCount;

		ClockHolder.innerHTML +=
		`<div id='${this.Id}_Clock' class='card glass'>
			<h3 id='${this.Id}_TimeTitle'>title</h3>
			<div class='clockFace glass'>
				<div id='${this.Id}_SecondsHand' class="hand second"></div>
				<div id='${this.Id}_MinutesHand' class="hand minute"></div>
				<div id='${this.Id}_HoursHand' class="hand hour"></div>
				<div class="hand dot"></div>
			</div>
			<h3 id='${this.Id}_DigitalTime'>xx:xx:xx</h3>
		</div>`

		var title = document.getElementById(`${this.Id}_TimeTitle`);
		title.innerHTML = `${name} `;

		if (this.Timezone >= 0){
			title.innerHTML += "+";
		}
		title.innerHTML += this.Timezone;

		Clocks.push(this);
		ClockCount += 1;
		this.Draw();
	}

	Draw() {
		var handSeconds =	document.getElementById(`${this.Id}_SecondsHand`);
		var handMinutes =	document.getElementById(`${this.Id}_MinutesHand`);
		var handHours	 =	document.getElementById(`${this.Id}_HoursHand`);
		var digitalTime =	document.getElementById(`${this.Id}_DigitalTime`);

		var now = new Date();

		var seconds = now.getUTCSeconds();
		var minutes = now.getUTCMinutes();
		var hours = now.getUTCHours() + this.Timezone;

		var drawSeconds = ((seconds / 60) * 360);
		var drawMinutes = ((minutes / 60) * 360);
		var drawHours = ((hours / 12) * 360);

		handSeconds.style.transform = `rotate(${drawSeconds}deg)`;
		handMinutes.style.transform = `rotate(${drawMinutes}deg)`;
		handHours.style.transform = `rotate(${drawHours}deg)`;

		digitalTime.innerHTML = `${hours}:${minutes}:${seconds}`;

		// fix for animation bump on when clock hands hit zero
		if (drawSeconds === 354 || drawSeconds === 0) {
			handSeconds.style.transition = "all 0s ease 0s";
		} else {
			handSeconds.style.transition = "all 0.05s cubic-bezier(0, 0, 0.52, 2.51) 0s";
		}
	}
}

new Clock("UTC", 0);
new Clock("London", 0);
new Clock("Eastern Time", -5);

UpdateClocks();

function UpdateClocks()
{
	for (let loop = 0; loop < Clocks.length; loop++) {
		Clocks[loop].Draw();
	}

	setTimeout(UpdateClocks, 250);
}