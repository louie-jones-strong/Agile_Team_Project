let Clocks = [];

class Clock
{
	constructor(timezone) {

		this.Timezone = timezone;

		let clockHolder = document.getElementById("clockHolder");

		let clockCard = document.createElement("div");
		clockCard.id = `${this.Timezone.Id}_Clock`
		clockCard.classList = "card glass"
		clockCard.innerHTML =`
			<div class="clockTop">
				<div class="left">
					<button class="editButton topButton shaded" onclick='EditTimeZonePopup("${this.Timezone.Id}")'></button>
				</div>
				<div class="center">
				</div>
				<div class="right">
					<button class="removeButton topButton shaded" onclick='RemoveTimeZonePopup("${this.Timezone.Id}")'></button>
				</div>
			</div>

			<div style="display:flex; justify-content: center;">
				<h4 id='${this.Timezone.Id}_TimeTitle'>${this.Timezone.Name} </h4>
				<h4 id='${this.Timezone.Id}_Timezone'>${this.Timezone.Offset}</h4>
			</div>

			<div class='clock glass frosted'>
				<div id='${this.Timezone.Id}_SecondsHand' class="hand second"></div>
				<div id='${this.Timezone.Id}_MinutesHand' class="hand minute"></div>
				<div id='${this.Timezone.Id}_HoursHand' class="hand hour"></div>
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
			<h3 id='${this.Timezone.Id}_DigitalTime'>xx:xx:xx</h3>
			<h3 id='${this.Timezone.Id}_Date'>xx:xx:xx</h3>`

		clockHolder.appendChild(clockCard);
		this.Draw();
	}

	Draw() {
		UpdateClockFace(this.Timezone.Id, this.Timezone.Offset);
	}
}

RegularRefresh();

function RegularRefresh()
{
	for (let index = 0; index < Clocks.length; index++)
	{
		Clocks[index].Draw();
	}
	setTimeout(RegularRefresh, 250);
}

function UpdateTimeZoneVisuals(timeZones)
{

	let clockHolder = document.getElementById("clockHolder");
	clockHolder.innerHTML = "";

	Clocks = [];
	for (const key in timeZones)
	{
		const timeZone = timeZones[key];

		let newClock = new Clock(timeZone);
		Clocks.push(newClock);
	}
}
