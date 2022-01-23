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
	for (let rows = 0; rows < 5; rows++)
	{
		html += "<tr>";
		for (let days = 0; days < 7; days++)
		{
			html += `<td class="day`;
			var dayOfMonth = index;

			if (index < firstDayOfMonth)
			{
				html += " otherMonth";
				dayOfMonth = daysInPreviousMonth - (firstDayOfMonth - (index+1) );
			}
			else if ((index+1 - firstDayOfMonth) > daysInMonth)
			{
				html += " otherMonth";
				dayOfMonth = index+1 - (daysInMonth + firstDayOfMonth);
			}
			else
			{
				dayOfMonth -= firstDayOfMonth - 1
			}

			if (index - (firstDayOfMonth - 1) == currentDay)
			{
				html += " currentDay";
			}

			html += `">${dayOfMonth}</td>`;
			index += 1;

		}
		html += "</tr>";
	}
	calendarHolder.innerHTML = html
}

DrawCalendar();