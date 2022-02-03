DrawCalendar();

function DrawCalendar()
{

	var now = new Date();


	var currentCalendar = document.getElementById("currentCalendar");
	currentCalendar.innerHTML = DateToString(now);

	var calendarHolder = document.getElementById("calendarHolder");

	html =
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
	var currentDay = now.getDate();


	index = 1;
	let showingAllDaysOfMonth = false;
	while (!showingAllDaysOfMonth)
	{
		html += "<tr>";
		for (let days = 0; days < 7; days++)
		{
			var dayOfMonth = 0;

			var dayDate = AddDaysOffset(now, (index - (firstDayOfMonth - 1)) - currentDay);
			html += `<td  onClick="CreateEvent('${dayDate}')" class="day`;

			if (index < firstDayOfMonth) // previous month
			{
				html += " otherMonth";
				dayOfMonth = daysInPreviousMonth - (firstDayOfMonth - (index+1) );
			}
			else if ((index+1 - firstDayOfMonth) > daysInMonth) // next month
			{
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
			html += GetDayEvents();
			html += "</td>";
			index += 1;

		}
		html += "</tr>";
	}
	calendarHolder.innerHTML = html
}

function GetDayEvents(day)
{
	html = "";

	eventName = "Test event Name";
	eventTime = "12pm";

	// full day event
	html += `<div class="event fullDayEvent">${eventName}</div>`;

	// part of day event
	html += `<div class="event partDayEvent">${eventTime} ${eventName}</div>`;

	return html
}

function CreateEvent(date)
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
