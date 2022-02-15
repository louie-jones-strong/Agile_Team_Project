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

function ForceUpdatePage()
{
	EventDataCache = {};
	DrawCalendar();
	ClosePopup();
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

	Get(`/eventList?UserID=${1}`, "", [], function(response)
		{
			let events = JSON.parse(response.responseText);
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

				if (event.EventDuration == null ||
					event.EventDuration < 0)
				{
					// full day event
					html += `<div
								onclick="EditEventPopup(${event.EventID})"
								class="event fullDayEvent ${event.EventColor}Event">
							${eventName}
						</div>`;
				}
				else
				{
					// part of day event
					html += `<div
								onclick="EditEventPopup(${event.EventID})"
								class="event partDayEvent ${event.EventColor}Event">
						${eventTime} ${eventName}
					</div>`;
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
		<h3 class="center">Create New Event</h3>`;
		popupBodyHtml += EventPopupBody();

		popupBodyHtml += `<button class="positive rounded" onClick="CreateEvent()">Create</button>`;

	OpenPopup(popupBodyHtml)
}

function EditEventPopup(eventId)
{
	let event = {};

	EventDataCache[0].forEach(item => {
		if (item.EventID == eventId)
		{
			event = item;
		}
	});

	let popupBodyHtml = `<h3 class="center">Edit Event</h3>`;
	popupBodyHtml += EventPopupBody(event);

	popupBodyHtml += `
		<div style="display:flex; justify-content:center;">
			<button class="negative rounded" onClick="RemoveEvent('${eventId}')">Remove</button>
			<button class="positive rounded" onClick="CreateEvent()">Save</button>
		</div>`;

	OpenPopup(popupBodyHtml);
}

function EventPopupBody(event)
{
	if (!event)
		event = {}

	if (!event.EventName)
		event.EventName = "";

	if (!event.EventDescription)
		event.EventDescription = "";

	if (!event.EventColor)
		event.EventColor = 'red';

	let popupBodyHtml = `
		<div id="errorHolder" class="hide center negative rounded" style="padding: 1em;">
		</div>
		<div style="display:flex;">
			<div>
				<label for"eventName">Event Name:</label>
				<input type="text" id="eventName" name="EventName" value="${event.EventName}" required>
			</div>

			<div>
				<label for"eventColor">Colour:</label>
				<select id="eventColor" name="EventColor" required>
					<option value="red" ${ event.EventColor == 'red' ? "selected" : ""}>Red</option>
					<option value="green" ${ event.EventColor == 'green' ? "selected" : ""}>Green</option>
					<option value="blue" ${ event.EventColor == 'blue' ? "selected" : ""}>Blue</option>
					<option value="pink" ${ event.EventColor == 'pink' ? "selected" : ""}>Pink</option>

				</select>
			</div>
		</div>

		<div style="display:flex;">
			<div>
				<label for"eventDate">Event Date:</label>
				<input type="datetime-local" id="eventDate" name="EventDateTime" value="${event.EventDateTime}" required>
			</div>

			<div>
				<label for"duration">Duration:</label>
				<input type="number" id="duration" name="EventDuration" value="${event.EventDuration}" required>
			</div>
		</div>

		<div>
			<label for"eventDescription">Description:</label>
			<textarea type="text" id="eventDescription" name="EventDescription" value="${event.EventDescription}" required></textarea>
		</div>`

	return popupBodyHtml;
}

function CreateEvent()
{
	let bodyData = {
		UserID: 1, //todo from login
		EventName: document.getElementById("eventName").value,
		EventColor: document.getElementById("eventColor").value,
		EventDescription: document.getElementById("eventDescription").value,
		EventDateTime: document.getElementById("eventDate").value,
		EventDuration: document.getElementById("duration").value,
	};


	Post(`/CreateEvent?
		UserID=${1}&
		EventName=${bodyData["EventName"]}&
		EventDescription=${bodyData["EventDescription"]}&
		EventDateTime=${bodyData["EventDateTime"]}&
		EventDuration=${bodyData["EventDuration"]}&
		EventColor=${bodyData["EventColor"]}
		`,
		"", [], function(response)
		{
			if (response.status == 200)
			{
				ForceUpdatePage();
			}
			else
			{
				let errorHolder = document.getElementById("errorHolder");
				errorHolder.classList.remove("hide");
				errorHolder.innerHTML = response.responseText
			}
		});
}

function RemoveEvent(eventId)
{
	Delete(`/RemoveEvent?
		EventID=${eventId}`,
		"", [], function(response)
		{
			if (response.status == 200)
			{
				ForceUpdatePage();
			}
			else
			{
				let errorHolder = document.getElementById("errorHolder");
				errorHolder.classList.remove("hide");
				errorHolder.innerHTML = response.responseText
			}
		});
}