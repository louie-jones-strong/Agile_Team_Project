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
const NumberOfDaysPerRow = 5;
const NumberOfVisibleDays = 4;

const RatioPerDay = 1 / NumberOfVisibleDays;
const RatioPerHour = RatioPerDay / 24;
const RatioPerMinute = RatioPerHour / 60;
const RatioPerSecond = RatioPerMinute / 60;

class TimeZone
{

	constructor(name, timeOffset) {

		this.Key = `${TimeZones.length}`;
		this.TimeOffset = timeOffset;

		let timeZoneHolder = document.getElementById("timeZoneHolder");

		let timeZone = document.createElement("div");
		timeZone.id = `${this.Key}_TimeOffset`
		timeZone.classList = "timeZone"

		let html =`<h4 id='${this.Key}_TimeTitle'>${name} ${this.TimeOffset}</h4>
				<h4 id='${this.Key}_Time' class="dayTimeLabel">12:12</h4>
				<div id='${this.Key}_dayList' class="dayList">`;

		for (let index = 0; index < NumberOfDaysPerRow; index++)
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

		let now = new Date();
		let offsetTime = AddHoursOffset(now, this.TimeOffset);

		let offsetRatio = offsetTime.getUTCHours() * RatioPerHour;
		offsetRatio += offsetTime.getUTCMinutes() * RatioPerMinute;
		offsetRatio += offsetTime.getUTCSeconds() * RatioPerSecond;

		offsetRatio *= -1;

		dayList.style.left = (offsetRatio * 100) + "%";


		for (let dayIndex = 0; dayIndex < NumberOfDaysPerRow; dayIndex++)
		{
			const dayDiv = document.getElementById(`${this.Key}_day${dayIndex}`);

			let dayDate = AddDaysOffset(now, dayIndex - 2);
			dayDiv.innerHTML = DateToString(dayDate, false);

			// check if selected
			let dayStartRatio = offsetRatio + dayIndex * RatioPerDay;
			let dayEndRatio = offsetRatio + (dayIndex+1) * RatioPerDay;

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

		// offset labelTime by predictedTimeRatio
		let labelTime = AddHoursOffset(offsetTime, predictedTimeRatio / RatioPerHour);

		// draw label
		let timeDayLabel = document.getElementById(`${this.Key}_Time`);
		timeDayLabel.style.left = (predictedTimeRatio * 100) + "%";
		timeDayLabel.innerHTML = TimeToString(labelTime, false, false);
	}

	Remove(){
		let temp = document.getElementById(`${this.Key}_Timezone`);
		temp.parentNode.removeChild(temp);
	}
}

AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());

for (let index = 0; index < 25; index++)
{
	AddTimeZone("Time", index - 12);
}

RegularRefresh();

function RegularRefresh()
{
	ForceRefresh();

	setTimeout(RegularRefresh, 1000);
}

function ForceRefresh()
{

	let now = new Date();

	let currentTimeMarker = document.getElementById(`currentTime`);
	currentTimeMarker.innerHTML = TimeToString(now, false, false);

	let predictedTime = AddHoursOffset(now, PredictedTimeRatio / RatioPerHour);

	let predictedTimeMarker = document.getElementById(`predictedTime`);
	predictedTimeMarker.innerHTML = TimeToString(predictedTime, false, false);

	for (let loop = 0; loop < TimeZones.length; loop++) {
		TimeZones[loop].Draw(PredictedTimeRatio);
	}
}

function AddTimeZone(name, timeOffset)
{
	let newTimeZone = new TimeZone(name, timeOffset);
	TimeZones.push(newTimeZone);
}