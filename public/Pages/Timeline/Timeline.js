// Make the DIV element draggable:
let marker = document.getElementById("predictedTimeMarker");
MakeElementDraggable(marker, true, false);

function MakeElementDraggable(element, xDraggable, yDraggable)
{
	var xPos = 0, yPos = 0, lastXPos = 0, lastYPos = 0;

	element.onmousedown = DragStart;

	function DragStart(e) {
		e = e || window.event;
		e.preventDefault();

		// get the mouse cursor position at startup:
		lastXPos = e.clientX;
		lastYPos = e.clientY;

		document.onmouseup = DragEnd;
		// call a function whenever the cursor moves:
		document.onmousemove = Dragged;
	}

	function Dragged(e) {
		e = e || window.event;
		e.preventDefault();

		if (xDraggable) {
			xPos = lastXPos - e.clientX;
			lastXPos = e.clientX;

			let ratio = (element.offsetLeft - xPos) / element.parentElement.clientWidth;

			ratio = Math.max(0, Math.min(1, ratio));

			element.style.left = (ratio * 100) + "%";
		}

		if (yDraggable) {
			yPos = lastYPos - e.clientY;
			lastYPos = e.clientY;

			let ratio = (element.offsetTop - yPos) / element.parentElement.clientHeight;
			ratio = Math.max(0, Math.min(1, ratio));

			element.style.top = (ratio * 100) + "%";
		}
	}

	function DragEnd() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}

let TimeZones = [];

class TimeZone
{
	constructor(name, timezone) {

		this.Key = `${TimeZones.length}`;

		let timeZoneHolder = document.getElementById("timeZoneHolder");

		let clockCard = document.createElement("div");
		clockCard.id = `${this.Key}_TimeOffset`
		clockCard.classList = "timeZone"
		clockCard.innerHTML =`
				<h4 id='${this.Key}_TimeTitle'>${name} ${timezone}</h4>
				<div class="dayList">
					<div class="day shaded">date day1</div>
					<div class="day shaded">date day2</div>
					<div class="day shaded selected">date day3</div>
					<div class="day shaded">date day4</div>
					<div class="day shaded">date day5</div>
				</div>`

		timeZoneHolder.appendChild(clockCard);


		let timeLinesHolder = document.getElementById("timeLinesHolder");

		timeLinesHolder.style.setProperty('--number-TimeZones', TimeZones.length + 1);

		this.Draw();
	}

	Draw() {

	}

	Remove(){
		let temp = document.getElementById(`${this.Key}_Timezone`);
		temp.parentNode.removeChild(temp);
	}
}

AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());
AddTimeZone("UTC", 0);
AddTimeZone("Eastern Time", -5);

UpdateTimeZones();

function UpdateTimeZones()
{
	for (let loop = 0; loop < TimeZones.length; loop++) {
		TimeZones[loop].Draw();
	}

	setTimeout(UpdateTimeZones, 250);
}

function AddTimeZone(name, timeOffset)
{
	let newTimeZone = new TimeZone(name, timeOffset);
	TimeZones.push(newTimeZone);
}