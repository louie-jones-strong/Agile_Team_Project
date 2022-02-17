
// this turns of the Analytics (we only want Analytics from users not dev)
const IsDevMode = true;


module.exports = function(app, port)
{

//#region Pages
	app.get("/health",function(req, res)
	{
		console.log("/health");
		res.send("healthy")
	});

	app.get("/",function(req, res)
	{
		console.log("/");

		res.render("home.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "home",
			}
		});
	});

	app.get("/about",function(req, res)
	{
		console.log("/about");

		res.render("about.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "about",
			}
		});
	});

	app.get("/calendar",function(req, res)
	{
		console.log("/calendar");


		res.render("calendar.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "calendar",
			}
		});
	});

	app.get("/clocks",function(req, res)
	{
		console.log("/clocks");

		res.render("clocks.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "clocks",
			}
		});
	});

	app.get("/timeline",function(req, res)
	{
		console.log("/timeline");

		res.render("timeline.ejs", {
			PageData: {
				IsDevMode: IsDevMode,
				PageName: "timeline",
			}
		});
	});
//#endregion pages

//#region Login flow

	app.get("/createAccount",function(req, res)
	{
		console.log("/createAccount", req.query);

		var sanitizeUsername = req.sanitize(req.query.username);
		let sqlQuery = `INSERT INTO Users (Username)VALUES('${sanitizeUsername}')`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
		});
	});

	app.get("/login",function(req, res)
	{
		console.log("/login", req.query);

		var sanitizeUsername = req.sanitize(req.query.username);
		let sqlQuery = `SELECT UserID FROM Users WHERE Username = '${sanitizeUsername}'`;

		db.query(sqlQuery, (err, result) => {
			if (err) {
				console.log(err);
				res.sendStatus(404);
				return;
			}

			res.send({UserID: result[0].UserID});
		});
	});

	app.get("/users", function(req, res)
	{
		console.log("/users");

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

	app.get("/eventList",function(req, res)
	{
		console.log("/eventList", req.query);

		var sanitizedUserID = req.sanitize(req.query.UserID);
		var sanitizedDateRangeStart = req.sanitize(req.query.dateRangeStart);
		var sanitizedDateRangeEnd = req.sanitize(req.query.dateRangeEnd);

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
				sqlQuery += ` AND EventDateTime >= ${sanitizedDateRangeStart}`

			if (sanitizedDateRangeEnd)
				sqlQuery += ` AND EventDateTime <= ${sanitizedDateRangeEnd}`

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
		console.log("/CreateEvent", req.query, req.body);

		var sanitizedUserID = req.sanitize(req.query.UserID);

		var sanitizedEventName= req.sanitize(req.query.EventName);
		var sanitizedEventDescription = req.sanitize(req.query.EventDescription);
		var sanitizedEventDateTime = req.sanitize(req.query.EventDateTime);
		var sanitizedEventDuration = req.sanitize(req.query.EventDuration);
		var sanitizedEventColor = req.sanitize(req.query.EventColor);

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
			${sanitizedEventDuration}, '${sanitizedEventColor}')`

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

	app.delete("/RemoveEvent",function(req, res)
	{
		console.log("/RemoveEvent", req.query);

		var sanitizedEventID = req.sanitize(req.query.EventID);

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
		console.log("/EditEvent", req.query, req.body);

		var sanitizedEventID = req.sanitize(req.query.EventID);
		var sanitizedEventName = req.sanitize(req.query.EventName);
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
}

function TryAddValueToEditSql(sqlQuery, req, value, valueNameStr, addQuotes=false)
{
	if (value == null)
	{
		return sqlQuery;
	}

	var sanitizedValue = req.sanitize(value);
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