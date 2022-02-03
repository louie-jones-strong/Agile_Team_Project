let CurrentMonthOffset = 0;
let EventDataCache = {};

CurrentMonth();

function PreviousMonth()
{
	CurrentMonthOffset -= 1;
	DrawCalendar();
}

function NextMonth()
{
	CurrentMonthOffset += 1;
	DrawCalendar();
}

function CurrentMonth()
{
	CurrentMonthOffset = 0;
	DrawCalendar();
}

function DrawCalendar()
{
	var now = new Date();
	var currentDay = now.getDate();

	now = AddMonthsOffset(now, CurrentMonthOffset);
	GetEventList(CurrentMonthOffset-1);
	GetEventList(CurrentMonthOffset);
	GetEventList(CurrentMonthOffset+1);

	var currentCalendar = document.getElementById("currentCalendar");
	currentCalendar.innerHTML = DateToString(now);

	var calendarHolder = document.getElementById("calendarHolder");

	let html =
		`<tr>
			<th>Monday</th>
			<th>Tuesday</th>
			<th>Wednesday</th>
			<th>Thursday</th>
			<th>Friday</th>
			<th>Saturday</th>
			<th>Sunday</th>
		</tr>`;

	var daysInPreviousMonth = GetDaysInMonth(now, -1);
	var firstDayOfMonth = GetFirstDayOfTheMonth(now);
	var daysInMonth = GetDaysInMonth(now, 0);


	index = 1;
	let showingAllDaysOfMonth = false;
	while (!showingAllDaysOfMonth)
	{
		html += "<tr>";
		for (let days = 0; days < 7; days++)
		{
			let dayOfMonth = 0;
			let monthOffset = 0;

			let dayDate = AddDaysOffset(now, (index - (firstDayOfMonth - 1)) - currentDay);
			html += `<td  onClick="CreateEventPopup('${dayDate}')" class="day`;

			if (index < firstDayOfMonth) // previous month
			{
				monthOffset = -1;
				html += " otherMonth";
				dayOfMonth = daysInPreviousMonth - (firstDayOfMonth - (index+1) );
			}
			else if ((index+1 - firstDayOfMonth) > daysInMonth) // next month
			{
				monthOffset = 1;
				html += " otherMonth";
				dayOfMonth = index+1 - (daysInMonth + firstDayOfMonth);
				showingAllDaysOfMonth = true;
			}
			else
			{
				dayOfMonth = index - (firstDayOfMonth - 1)
			}

			if (index - (firstDayOfMonth - 1) < currentDay)
			{
				html += " previousDay";
			}
			else if (index - (firstDayOfMonth - 1) == currentDay)
			{
				html += " currentDay";
			}

			html += `">`
			html += `${dayOfMonth}`;
			html += GetDayEvents(monthOffset, dayDate);
			html += "</td>";
			index += 1;

		}
		html += "</tr>";
	}
	calendarHolder.innerHTML = html
}

function GetEventList(monthOffset)
{
	EventDataCache[monthOffset]
	if (EventDataCache[monthOffset])
	{
		return;
	}

	EventDataCache[monthOffset] = [];

	Get(`/eventList?UserID=${1}`, "", [], function(jsonText)
		{
			var events = JSON.parse(jsonText);
			EventDataCache[monthOffset] = events;

			if (CurrentMonthOffset-1 <= monthOffset &&
				CurrentMonthOffset+1 >= monthOffset)
			{
				DrawCalendar();
			}
		});
}

function GetDayEvents(monthOffset, date)
{
	let html = "";

	let monthData = EventDataCache[monthOffset];
	if (monthData)
	{
		// we have this data so lets show it
		monthData.forEach(event => {
			event.EventDateTime = new Date(event.EventDateTime);

			if (IsSameDay(event.EventDateTime, date))
			{
				let eventName = event.EventName;
				let eventTime = "12pm";
				if (event.EventDuration == null)
				{
					// full day event
					html += `<div class="event fullDayEvent">${eventName}</div>`;
				}
				else
				{
					// part of day event
					html += `<div class="event partDayEvent">${eventTime} ${eventName}</div>`;
				}
			}
		});
	}
	else
	{
		// we don't have this data yet should we show loader?
	}
	return html
}

function CreateEventPopup(date)
{
	if (date == null)
	{
		var date = new Date();
	}
	else
	{
		var date = new Date(date);
	}

	let popupBodyHtml = `
		<h3 class="center">Create New Event</h3>
		<h4 class="center">Date: ${DateToString(date)}</h4>
		<form>
			<button class="positive">Create</button>
		</form>

		`
	OpenPopup(popupBodyHtml)
}
