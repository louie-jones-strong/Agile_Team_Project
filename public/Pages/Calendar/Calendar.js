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
	let currentDate = new Date();

	let now = new Date();
	now = AddMonthsOffset(now, CurrentMonthOffset);
	GetEventList(CurrentMonthOffset-1);
	GetEventList(CurrentMonthOffset);
	GetEventList(CurrentMonthOffset+1);

	let currentCalendar = document.getElementById("currentCalendar");
	currentCalendar.innerHTML = GetMonthString(now.getUTCMonth());

	let calendarHolder = document.getElementById("calendarHolder");

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

	let daysInPreviousMonth = GetDaysInMonth(now, -1);
	let firstDayOfMonth = GetFirstDayOfTheMonth(now);
	let daysInMonth = GetDaysInMonth(now, 0);


	let index = 0;
	let showingAllDaysOfMonth = false;
	while (!showingAllDaysOfMonth)
	{
		html += "<tr>";
		for (let days = 0; days < 7; days++)
		{
			let dayOfMonth = 0;
			let monthOffset = 0;

			let dayDate = AddDaysOffset(now, index - firstDayOfMonth);
			html += `<td class="day`;

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

			if (dayDate < currentDate)
			{
				html += " previousDay";
			}
			else if (IsSameDay(dayDate, currentDate))
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
			let events = JSON.parse(jsonText);
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
					html += `<div onclick="EditEventPopup(${event.EventId})" class="event fullDayEvent">${eventName}</div>`;
				}
				else
				{
					// part of day event
					html += `<div onclick="EditEventPopup(${event.EventId})" class="event partDayEvent">${eventTime} ${eventName}</div>`;
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
		date = new Date();
	}
	else
	{
		date = new Date(date);
	}

	let popupBodyHtml = `
		<h3 class="center">Create New Event</h3>
		<h4 class="center">Date: ${DateToString(date)}</h4>`
		popupBodyHtml += EventPopupBody();

		popupBodyHtml += `<button class="positive" onClick="CreateEvent()">Create</button>`

	OpenPopup(popupBodyHtml)
}

function EditEventPopup(eventId)
{
	let event = {};

	EventDataCache[0].forEach(item => {
		if (item.EventId == eventId)
		{
			event = item;
		}
	});

	let popupBodyHtml = `<h3 class="center">Edit Event</h3>`
	popupBodyHtml += EventPopupBody(event.EventName, event.EventDescription, event.EventColor);

	popupBodyHtml += `<button class="positive" onClick="CreateEvent()">Create</button>`

	OpenPopup(popupBodyHtml)
}

function EventPopupBody(eventName, eventDescription, colour)
{
	if (!eventName)
		eventName = "";

	if (!eventDescription)
		eventDescription = "";

	if (!colour)
		colour = 'red';

	let popupBodyHtml = `
		<div style="display:flex;">
			<div>
				<label for"eventName">Event Name:</label>
				<input type="text" id="eventName" name="EventName" value="${eventName}" required>
			</div>

			<div>
				<label for"eventColor">Colour:</label>
				<select id="eventColor" name="EventColor" required>
					<option value="red" ${ colour == 'red' ? "selected" : ""}>Red</option>
					<option value="green" ${ colour == 'green' ? "selected" : ""}>Green</option>
					<option value="blue" ${ colour == 'blue' ? "selected" : ""}>Blue</option>
					<option value="pink" ${ colour == 'pink' ? "selected" : ""}>Pink</option>

				</select>
			</div>
		</div>
		<div>
			<label for"eventDescription">Description:</label>
			<textarea type="text" id="eventDescription" name="EventDescription" value="${eventDescription}" required></textarea>
		</div>`

	return popupBodyHtml;
}