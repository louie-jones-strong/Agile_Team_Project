let Clocks = {};

class Clock
{
	constructor(name, timezone) {

		this.Key = `${Object.keys(Clocks).length}`;

		let clockHolder = document.getElementById("clockHolder");

		let clockCard = document.createElement("div");
		clockCard.id = `${this.Key}_Clock`
		clockCard.classList = "card glass"
		clockCard.innerHTML =`
			<div class="clockTop">
				<div class="left">
					<button class="editButton topButton shaded" onclick='EditClock("${this.Key}")'></button>
				</div>
				<div class="center">
				</div>
				<div class="right">
					<button class="removeButton topButton shaded" onclick='RemoveClockPopup("${this.Key}")'></button>
				</div>
			</div>

			<input id='${this.Key}_TimeTitle' type="text" value="Test">
			<input id='${this.Key}_Timezone' type="number" step="0.25" value="0">

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

		let titleInput = document.getElementById(`${this.Key}_TimeTitle`);
		let timezoneInput = document.getElementById(`${this.Key}_Timezone`);

		titleInput.value = name;


		timezoneInput.value = timezone;
		this.Draw();
	}

	Draw() {
		let timezoneInput = document.getElementById(`${this.Key}_Timezone`);
		let timezone = parseFloat(timezoneInput.value);

		UpdateClockFace(this.Key, timezone);
	}

	Remove(){
		let temp = document.getElementById(`${this.Key}_Clock`);
		temp.parentNode.removeChild(temp);
	}
}

AddClock(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());
AddClock("UTC", 0);
AddClock("Eastern Time", -5);

UpdateClocks();

function UpdateClocks()
{
	for (const key in Clocks)
	{
		Clocks[key].Draw();
	}

	setTimeout(UpdateClocks, 250);
}


function RemoveClockPopup(clockKey)
{
	let popupBodyHtml = `<h3 class="center">Remove Timezone</h3>
		<p class="center">Are you sure you want to remove this Timezone?</p>
		<div style="display:flex; justify-content:center;">
			<button class="positive shaded rounded" onClick="RemoveClock('${clockKey}')">Remove</button>
			<button class="negative shaded rounded" onClick="ClosePopup()">Cancel</button>
		</div>`;


	OpenPopup(popupBodyHtml);
}

function RemoveClock(clockKey)
{
	Clocks[clockKey].Remove();
	delete Clocks[clockKey];
	ClosePopup();
}
function AddClock(name, timeOffset)
{
	let newClock = new Clock(name, timeOffset);
	Clocks[newClock.Key] = newClock;
}
