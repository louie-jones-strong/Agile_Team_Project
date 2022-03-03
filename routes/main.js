// this turns of the Analytics (we only want Analytics from users not dev)
const IsDevMode = true;

module.exports = function(app, auth)
{

//#region Pages
	app.get("/health",function(req, res)
	{
		res.send("healthy")
	});

	app.get("/",function(req, res)
	{
		res.render("home.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "home",
			}
		});
	});

	app.get("/about",function(req, res)
	{
		res.render("about.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "about",
			}
		});
	});

	app.get("/calendar",function(req, res)
	{
		res.render("calendar.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "calendar",
			}
		});
	});

	app.get("/clocks",function(req, res)
	{
		res.render("clocks.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "clocks",
			}
		});
	});

	app.get("/timeline",function(req, res)
	{
		res.render("timeline.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "timeline",
			}
		});
	});
//#endregion pages

//#region Login flow

	app.post("/register", auth.Register, function(req, res)
	{
		let sanitizedUsername = req.sanitize(req.query.Username);
		let sanitizedTimeZoneOffset = req.sanitize(req.query.TimeZoneOffset);

		let sqlQuery = `INSERT INTO Users (Username, LastTimezone)VALUES('${sanitizedUsername}', ${sanitizedTimeZoneOffset})`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}

			// get last id added
			db.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}

				userId = result[0]['LAST_INSERT_ID()'];


				// get user data
				let sqlQuery = `SELECT * FROM Users WHERE UserID =${userId}`;

				db.query(sqlQuery, (err, result) => {
					if (err) {
						console.log(err);
						res.sendStatus(400);
						return;
					}

					res.send(result);
				});
			});
		});
	}, );

	app.post("/login", auth.Login, function(req, res)
	{

		let sanitizedUserID = req.sanitize(req.query.UserID);
		console.log("login UserID: ", sanitizedUserID);

		if (sanitizedUserID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `SELECT * FROM Users WHERE UserID='${sanitizedUserID}'`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}
			if (result.length != 1)
			{
				res.sendStatus(400);
			}

			// update last TimeZoneOffset
			let sanitizedTimeZoneOffset = req.sanitize(req.query.TimeZoneOffset);
			console.log("sanitizedTimeZoneOffset: ", sanitizedTimeZoneOffset);

			if (sanitizedTimeZoneOffset)
			{
				let sqlQuery = `UPDATE Users SET LastTimezone = ${sanitizedTimeZoneOffset} WHERE UserID='${sanitizedUserID}'`

				db.query(sqlQuery, (err, result) => {
					if (err) {
						console.log(err);
						return;
					}

				});
			}

			res.send(result[0]);
		});
	});

	app.post("/logout", auth.CheckIfAuthenticated, auth.Logout);

	app.delete("/user", auth.CheckIfAuthenticated, auth.Delete, function(req, res)
	{
		let sanitizedUserID = req.sanitize(req.query.UserID);

		// remove EventAttendees
		let sqlQuery = `DELETE FROM EventAttendees WHERE (UserID = ${sanitizedUserID} OR
		EventID IN (SELECT EventID FROM Events WHERE EventCreator=${sanitizedUserID}))`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(500);
				return;
			}

			// remove event
			let sqlQuery = `DELETE FROM Events WHERE EventCreator = ${sanitizedUserID}`;
			db.query(sqlQuery, (err, result) => {
				if (err) {
					console.log(err);
					res.sendStatus(500);
					return;
				}
				
				// remove userTimezones
				let sqlQuery = `DELETE FROM UserTimezone WHERE UserID = ${sanitizedUserID}`;
				db.query(sqlQuery, (err, result) => {
					if (err) {
						console.log(err);
						res.sendStatus(500);
						return;
					}
					
					// remove user
					let sqlQuery = `DELETE FROM Users WHERE UserID = ${sanitizedUserID}`;
					db.query(sqlQuery, (err, result) => {
						if (err) {
							console.log(err);
							res.sendStatus(500);
							return;
						}

						res.send(200);
					});
				});	
			});
		});
	});

	app.get("/users", function(req, res)
	{
		let sqlQuery = `SELECT UserID, Username FROM Users`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(500);
				return;
			}
			res.send(result);
		});
	});

//#endregion Login flow


//#region events

	app.get("/events",function(req, res)
	{
		let sanitizedUserID = req.sanitize(req.query.UserID);
		let sanitizedDateRangeStart = req.sanitize(req.query.dateRangeStart);
		let sanitizedDateRangeEnd = req.sanitize(req.query.dateRangeEnd);

		if (sanitizedUserID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `
			SELECT * FROM Events WHERE (EventID IN (
				SELECT EventID FROM EventAttendees WHERE UserID=${sanitizedUserID}
			) OR EventCreator=${sanitizedUserID})`

			if (sanitizedDateRangeStart)
				sqlQuery += ` AND EventDateTime >= '${sanitizedDateRangeStart}'`

			if (sanitizedDateRangeEnd)
				sqlQuery += ` AND EventDateTime <= '${sanitizedDateRangeEnd}'`

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}

			res.send(result);
		});
	});

	app.get("/attendees",function(req, res)
	{
		let sanitizedEventID = req.sanitize(req.query.EventID);

		if (sanitizedEventID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `SELECT UserID FROM EventAttendees WHERE EventID=${sanitizedEventID}`

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}

			res.send(result);
		});
	});

	app.post("/CreateEvent",function(req, res)
	{

		let sanitizedUserID = req.sanitize(req.query.UserID);

		let sanitizedEventName= req.sanitize(req.query.EventName);
		let sanitizedEventDescription = req.sanitize(req.query.EventDescription);
		let sanitizedEventDateTime = req.sanitize(req.query.EventDateTime);
		let sanitizedEventDuration = req.sanitize(req.query.EventDuration);
		let sanitizedEventColor = req.sanitize(req.query.EventColor);

		let attendeesStrings = req.query.Attendees.split(",");
		let attendeeIds = [];
		attendeesStrings.forEach(attendee => {
			try {
				attendeeIds.push(parseInt(attendee));
			} catch (error) {

			}
		});

		if (sanitizedUserID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `INSERT INTO Events
			(EventCreator, EventName, EventDescription, EventDateTime,
			EventDuration, EventColor)
			VALUES
			(${sanitizedUserID}, '${sanitizedEventName}', '${sanitizedEventDescription}', '${sanitizedEventDateTime}',
			${sanitizedEventDuration}, '${sanitizedEventColor}')`;

		// add event
		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}

			if (attendeeIds.length > 0)
			{
				// get last id added
				db.query(`SELECT LAST_INSERT_ID()`, (err, result) => {
					if (err) {
						console.log(err);
						res.sendStatus(500);
						return;
					}

					eventID = result[0]['LAST_INSERT_ID()'];


					// add EventAttendees
					let sqlQuery = `INSERT INTO EventAttendees
					(EventID, UserID)
					VALUES`;
					for (let index = 0; index < attendeeIds.length; index++)
					{
						const attendee = attendeeIds[index];
						sqlQuery += `(${eventID}, ${attendee})`;
						if (index < attendeeIds.length -1)
						{
							sqlQuery += `,`;
						}
					}

					console.log(sqlQuery);
					db.query(sqlQuery, (err, result) => {
						if (err) {
							console.log(err);
						}

						res.sendStatus(200);
					});
				});
			}
		});
	});

	app.delete("/RemoveEvent",function(req, res)
	{

		let sanitizedEventID = req.sanitize(req.query.EventID);

		if (sanitizedEventID == null)
		{
			res.sendStatus(404);
			return;
		}


		// remove EventAttendees
		let sqlQuery = `DELETE FROM EventAttendees WHERE EventID = ${sanitizedEventID}`;
		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}

			// remove event
			let sqlQuery = `DELETE FROM Events WHERE EventID = ${sanitizedEventID}`;
			db.query(sqlQuery, (err, result) => {
				if (err) {
					console.log(err);
					res.sendStatus(400);
					return;
				}

				res.send(result);
			});
		});
	});

	app.post("/EditEvent",function(req, res)
	{
		let sanitizedEventID = req.sanitize(req.query.EventID);
		let sanitizedEventName = req.sanitize(req.query.EventName);
		if (sanitizedEventID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `UPDATE Events SET EventName = '${sanitizedEventName}'`
		sqlQuery = TryAddValueToEditSql(sqlQuery, req, req.query.EventDescription, "EventDescription", true);
		sqlQuery = TryAddValueToEditSql(sqlQuery, req, req.query.EventDateTime, "EventDateTime", true);
		sqlQuery = TryAddValueToEditSql(sqlQuery, req, req.query.EventDuration, "EventDuration", true);
		sqlQuery = TryAddValueToEditSql(sqlQuery, req, req.query.EventColor, "EventColor", true);
		sqlQuery += ` WHERE EventID = ${sanitizedEventID}`;

		console.log(sqlQuery);

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(400);
				return;
			}

			res.send(result);
		});
	});

//#endregion events

//#region user timezones
app.get("/UserTimezones",function(req, res)
{

	let sanitizedUserID = req.sanitize(req.query.UserID);

		if (sanitizedUserID == null) {
			res.sendStatus(404);
			return;
		}

	let sqlQuery = `SELECT * FROM UserTimezone WHERE UserId = ${sanitizedUserID}`


	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
			return;
		}

		res.send(result);
	});
});
app.post("/AddUserTimezone",function(req, res)
{

	let sanitizedUserID = req.sanitize(req.query.UserID);
	let sanitizedTimezoneName = req.sanitize(req.query.TimezoneName);
	let sanitizedTimeZoneOffset= req.sanitize(req.query.TimeZoneOffset);


	if (sanitizedUserID == null)
	{
		res.sendStatus(404);
		return;
	}

	let sqlQuery = `INSERT INTO UserTimezone
		(UserId, timezoneName, TimeZoneOffset)
		VALUES
		(${sanitizedUserID}, '${sanitizedTimezoneName}', '${sanitizedTimeZoneOffset}')`

	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
			return;
		}

		res.send(result);
	});
});
app.post("/EditUserTimezone",function(req, res)
{

	let sanitizedID = req.sanitize(req.query.ID);
	let sanitizedTimeZoneOffset= req.sanitize(req.query.TimeZoneOffset);
	let sanitizedTimezoneName = req.sanitize(req.query.TimezoneName);


	if (sanitizedUserID == null)
	{
		res.sendStatus(404);
		return;
	}

	let sqlQuery = `UPDATE UserTimezone SET TimeZoneOffset = ${sanitizedTimeZoneOffset}, timezoneName = ${sanitizedTimezoneName} WHERE ID = ${sanitizedID}`

	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
			return;
		}

		res.send(result);
	});
});
app.post("/DeleteUserTimezone",function(req, res)
{

	let sanitizedID = req.sanitize(req.query.ID);

	if (sanitizedUserID == null || sanitizedID == null)
	{
		res.sendStatus(404);
		return;
	}

	let sqlQuery = `DELETE FROM UserTimezone WHERE ID = ${sanitizedID}`

	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
			return;
		}

		res.send(result);
	});
});
//#endregion user timezones
}

function TryAddValueToEditSql(sqlQuery, req, value, valueNameStr, addQuotes=false)
{
	if (value == null)
	{
		return sqlQuery;
	}

	let sanitizedValue = req.sanitize(value);
	if (sanitizedValue == null)
	{
		return sqlQuery;
	}

	if (addQuotes)
	{
		sqlQuery += `, ${valueNameStr} = '${sanitizedValue}'`;
	}
	else
	{
		sqlQuery += `, ${valueNameStr} = ${sanitizedValue}`;
	}

	return sqlQuery;
}