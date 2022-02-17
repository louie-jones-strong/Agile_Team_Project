let CurrentMonthOffset = 0;
let EventDataCache = {};
let UserList = {};
let Attendees = [];

GetUserList();
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
	Attendees = [];
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

	let firstDayOfMonth = GetFirstDayOfTheMonth(now);


	let index = 0;
	let showingAllDaysOfMonth = false;
	while (!showingAllDaysOfMonth)
	{
		html += "<tr>";
		for (let days = 0; days < 7; days++)
		{
			let dayDate = AddDaysOffset(now, index - (firstDayOfMonth - 1));
			let monthOffset = GetMonthOffset(dayDate, now);

			html += `<td class="day`;

			if (monthOffset != 0) // not this month
			{
				html += " otherMonth";

				if (monthOffset > 0) // next month
				{
					showingAllDaysOfMonth = true;
				}
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
			html += `${dayDate.getDate()}`;
			html += GetEventsHtml(monthOffset, dayDate);
			html += "</td>";
			index += 1;
		}
		html += "</tr>";
	}
	calendarHolder.innerHTML = html
}

function GetEventsHtml(monthOffset, date)
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

function GetEventList(monthOffset)
{
	EventDataCache[monthOffset]
	if (EventDataCache[monthOffset])
	{
		return;
	}

	EventDataCache[monthOffset] = [];

	// set start date range
	let dateRangeStart = new Date();
	dateRangeStart = AddMonthsOffset(dateRangeStart, monthOffset);
	dateRangeStart.setDate(1);
	// convert to iso standard
	let startIsoStr = dateRangeStart.toISOString();
	dateRangeStart = startIsoStr.substring(0,startIsoStr.length-1)

	// set end date range
	let dateRangeEnd = new Date();
	dateRangeEnd = AddMonthsOffset(dateRangeEnd, monthOffset + 1);
	dateRangeEnd = AddDaysOffset(dateRangeEnd, -1);
	// convert to iso standard
	let endIsoStr = dateRangeEnd.toISOString();
	dateRangeEnd = endIsoStr.substring(0,endIsoStr.length-1)



	// todo get user id
	Get(`/eventList?UserID=${1}&dateRangeStart=${dateRangeStart}&dateRangeEnd=${dateRangeEnd}`,
		"", [], function(response)
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
function GetUserList()
{
	Get(`/users`, "", [], function(response)
		{
			UserList = JSON.parse(response.responseText);
		});
}

//#region Popups
function CreateEventPopup()
{
	let popupBodyHtml = `
		<h3 class="center">Create New Event</h3>`;
		popupBodyHtml += EventPopupBody();

		popupBodyHtml += `<button class="positive rounded" onClick="CreateEvent()">Create</button>`;

	OpenPopup(popupBodyHtml);

	Attendees = [];
	UpdateAttendeeSuggestions();
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
			<button class="negative rounded" onClick="RemoveEventPopup('${eventId}')">Remove</button>
			<button class="positive rounded" onClick="EditEvent(${eventId})">Save</button>
		</div>`;

	OpenPopup(popupBodyHtml);


	Attendees = [];
	UpdateAttendeeSuggestions();
}

function RemoveEventPopup(eventId)
{
	let popupBodyHtml = `<h3 class="center">Remove Event</h3>`;
	popupBodyHtml += `
		<p class="center">Are you sure you want to remove this event?</p>
		<div style="display:flex; justify-content:center;">
			<button class="positive rounded" onClick="RemoveEvent('${eventId}')">Remove</button>
			<button class="negative rounded" onClick="ClosePopup()">Cancel</button>
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

	if (!event.EventDateTime)
		event.EventDateTime = new Date();
	else
		event.EventDateTime = new Date(event.EventDateTime);

	let isoStr = event.EventDateTime.toISOString();
	event.EventDateTime = isoStr.substring(0,isoStr.length-1)

	let popupBodyHtml = `
		<div id="errorHolder" class="hide center negative rounded" style="padding: 1em;">
		</div>
		<div style="display:flex;">
			<div>
				<label for="eventName">Event Name:</label>
				<input type="text" id="eventName" name="EventName" value="${event.EventName}" required>
			</div>

			<div>
				<label for="eventColor">Colour:</label>
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
				<label for="eventDate">Event Date:</label>
				<input type="datetime-local" id="eventDate" name="EventDateTime" value="${event.EventDateTime}" required>
			</div>

			<div>
				<label for="duration">Duration:</label>
				<input type="number" id="duration" name="EventDuration" value="${event.EventDuration}" required>
			</div>
		</div>

		<label>Attendees:</label>
		<label for="eventAttendeeInput" id="eventAttendeesHolder">
			<input type="text" id="eventAttendeeInput" oninput="UpdateAttendeeSuggestions()">

			<div id="eventAttendeesToolTip">
			</div>
		</label>

		<div>
			<label for="eventDescription">Description:</label>
			<textarea type="text" id="eventDescription" name="EventDescription" value="${event.EventDescription}" required></textarea>
		</div>`

	return popupBodyHtml;
}
//#endregion Popups

//#region Attendee
function RemoveAttendeeFromPopup(userId)
{
	let attendee = document.getElementById(`eventAttendee_${userId}`);
	attendee.remove();
	Attendees.splice(Attendees.indexOf(userId), 1);
	UpdateAttendeeSuggestions();
}

function AddAttendeeToPopup(userId)
{
	let holder = document.getElementById(`eventAttendeesHolder`);

	let userName = "Unknown";

	for (let index = 0; index < UserList.length; index++)
	{
		const user = UserList[index];
		if (user.UserID == userId)
		{
			userName = user.Username;
			break;
		}
	}

	Attendees.push(userId);

	let attendeeHtml = `
		<div class="eventAttendee" id="eventAttendee_${userId}" value="${userId}">
			${userName}
			<button onclick="RemoveAttendeeFromPopup(${userId})">X</button>
		</div>`;

	holder.insertAdjacentHTML('afterbegin', attendeeHtml);

	let input = document.getElementById(`eventAttendeeInput`);
	input.value = "";
	UpdateAttendeeSuggestions();
}

function UpdateAttendeeSuggestions()
{
	let input = document.getElementById(`eventAttendeeInput`);

	let holder = document.getElementById(`eventAttendeesToolTip`);
	let html = "";

	if (UserList && UserList.length > 0)
	{
		html = `<h4>Suggested Attendees</h4>
					<hr>`;

		let suggestedCount = 0;
		for (let index = 0; index < UserList.length; index++)
		{
			const user = UserList[index];

			//todo check not current user
			if (user.Username.includes(input.value))
			{
				let isInAttendees = false;
				for (let index = 0; index < Attendees.length; index++)
				{
					if (Attendees[index] == user.UserID)
					{
						isInAttendees = true;
						break;
					}
				}
				if (isInAttendees)
				{
					continue;
				}


				html += `<button onclick="AddAttendeeToPopup(${user.UserID})">${user.Username}</button>`;
				suggestedCount += 1;
			}

			if (suggestedCount >= 5)
			{
				break;
			}
		};
	}

	holder.innerHTML = html;
}
//#endregion

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
		EventColor=${bodyData["EventColor"]}&
		Attendees=${Attendees}`,
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

function EditEvent(eventID)
{
	let bodyData = {
		EventName: document.getElementById("eventName").value,
		EventColor: document.getElementById("eventColor").value,
		EventDescription: document.getElementById("eventDescription").value,
		EventDateTime: document.getElementById("eventDate").value,
		EventDuration: document.getElementById("duration").value,
	};


	Post(`/EditEvent?
		EventID=${eventID}&
		EventName=${bodyData["EventName"]}&
		EventDescription=${bodyData["EventDescription"]}&
		EventDateTime=${bodyData["EventDateTime"]}&
		EventDuration=${bodyData["EventDuration"]}&
		EventColor=${bodyData["EventColor"]}&
		Attendees=${Attendees}`,
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