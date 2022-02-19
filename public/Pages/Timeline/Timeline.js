// Make the DIV element draggable:
let PredictedTimeRatio = 0.5;
let marker = document.getElementById("predictedTimeMarker");
MakeElementDraggable(marker);

function MakeElementDraggable(element)
{
	var xPos = 0, lastXPos = 0;

	element.onmousedown = DragStart;

	function DragStart(e) {
		e = e || window.event;
		e.preventDefault();

		// get the mouse cursor position at startup:
		lastXPos = e.clientX;

		document.onmouseup = DragEnd;
		// call a function whenever the cursor moves:
		document.onmousemove = Dragged;
	}

	function Dragged(e) {
		e = e || window.event;
		e.preventDefault();

		xPos = lastXPos - e.clientX;
		lastXPos = e.clientX;

		PredictedTimeRatio = (element.offsetLeft - xPos) / element.parentElement.clientWidth;

		PredictedTimeRatio = Math.max(0, Math.min(1, PredictedTimeRatio));

		element.style.left = (PredictedTimeRatio * 100) + "%";
		ForceRefresh();
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
	NumberOfDaysPerRow = 5;
	NumberOfVisibleDays = 4;

	constructor(name, timeOffset) {

		this.Key = `${TimeZones.length}`;
		this.TimeOffset = timeOffset;

		let timeZoneHolder = document.getElementById("timeZoneHolder");

		let timeZone = document.createElement("div");
		timeZone.id = `${this.Key}_TimeOffset`
		timeZone.classList = "timeZone"

		let html =`<h4 id='${this.Key}_TimeTitle'>${name} ${this.TimeOffset}</h4>
				<div id='${this.Key}_dayList' class="dayList">`;

		for (let index = 0; index < this.NumberOfDaysPerRow; index++)
		{
			html += `<div id='${this.Key}_day${index}' class="day shaded selected">date day${index}</div>`;
		}
		html += `</div>`;

		timeZone.innerHTML = html;
		timeZoneHolder.appendChild(timeZone);


		let timeLinesHolder = document.getElementById("timeLinesHolder");

		timeLinesHolder.style.setProperty('--number-TimeZones', TimeZones.length + 1);

		this.Draw();
	}

	Draw(predictedTimeRatio) {
		let dayList = document.getElementById(`${this.Key}_dayList`);

		let ratioPerDay = 1 / this.NumberOfVisibleDays;
		let ratioPerHour = ratioPerDay / 24;
		let ratioPerMinute = ratioPerHour / 60;
		let ratioPerSecond = ratioPerMinute / 60;

		let now = new Date();
		let offsetTime = AddHoursOffset(now, this.TimeOffset);

		let offsetRatio = offsetTime.getUTCHours() * ratioPerHour;
		offsetRatio += offsetTime.getUTCMinutes() * ratioPerMinute;
		offsetRatio += offsetTime.getUTCSeconds() * ratioPerSecond;

		let dayOffset = 1;
		offsetRatio -= ratioPerDay * dayOffset;
		dayList.style.left = (offsetRatio * 100) + "%";


		for (let dayIndex = 0; dayIndex < this.NumberOfDaysPerRow; dayIndex++)
		{
			const dayDiv = document.getElementById(`${this.Key}_day${dayIndex}`);

			let dayDate = AddDaysOffset(now, dayIndex - 2);
			dayDiv.innerHTML = DateToString(dayDate, false);

			// check if selected
			let dayStartRatio = offsetRatio + dayIndex * ratioPerDay;
			let dayEndRatio = offsetRatio + (dayIndex+1) * ratioPerDay;

			if (dayStartRatio < predictedTimeRatio &&
				dayEndRatio >= predictedTimeRatio)
			{
				dayDiv.classList.add("selected");
			}
			else
			{
				dayDiv.classList.remove("selected");
			}

		}
	}

	Remove(){
		let temp = document.getElementById(`${this.Key}_Timezone`);
		temp.parentNode.removeChild(temp);
	}
}

AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());
AddTimeZone("UTC", 0);
AddTimeZone("Eastern Time", -5);

RegularRefresh();

function RegularRefresh()
{
	ForceRefresh();

	setTimeout(RegularRefresh, 1000);
}

function ForceRefresh()
{
	for (let loop = 0; loop < TimeZones.length; loop++) {
		TimeZones[loop].Draw(PredictedTimeRatio);
	}
}

function AddTimeZone(name, timeOffset)
{
	let newTimeZone = new TimeZone(name, timeOffset);
	TimeZones.push(newTimeZone);
}