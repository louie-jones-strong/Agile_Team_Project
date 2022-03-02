
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

		let sanitizeUsername = req.sanitize(req.query.username);
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

		let sanitizeUsername = req.sanitize(req.query.username);
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

//#endregion Login flow


//#region events


	app.get("/eventList",function(req, res)
	{
		console.log("/eventList", req.query);

		let sanitizedUserID = req.sanitize(req.query.UserID);
		let sanitizedDateRangeStart = req.sanitize(req.query.dateRangeStart);
		let sanitizedDateRangeEnd = req.sanitize(req.query.dateRangeEnd);

		if (sanitizedUserID == null)
		{
			res.sendStatus(404);
			return;
		}

		let sqlQuery = `
			SELECT EventName, EventDateTime, EventCreator, EventDuration FROM Events WHERE (EventID IN (
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

//#endregion events

//user timezones
app.post("/EditUserLastTimezone",function(req, res)
{
	console.log("/EditUserLastTimezone", req.query);

	var sanitizedUserID = req.sanitize(req.query.UserID);
	var sanitizedTimeZoneOffset= req.sanitize(req.query.LastTimezone,
		);


	if (sanitizedUserID == null)
	{
		res.sendStatus(404);
		return;
	}
	if (isNaN(sanitizedTimeZoneOffset))
	{
		res.sendStatus(400);
		return;
	}

	let sqlQuery = `UPDATE Users SET LastTimezone
	= ${sanitizedTimeZoneOffset} WHERE UserID = ${sanitizedUserID}`

	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(400);
			return;
		}

		res.send(result);
	});
});
app.get("/UserTimezones",function(req, res)
{
	console.log("/UserTimezones", req.query);

	var sanitizedUserID = req.sanitize(req.query.UserID);

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
	console.log("/AddUserTimezone", req.query);

	var sanitizedUserID = req.sanitize(req.query.UserID);
	var sanitizedUserName = req.sanitize(req.query.UserName);
	var sanitizedTimeZoneOffset= req.sanitize(req.query.TimeZoneOffset);


	if (sanitizedUserID == null)
	{
		res.sendStatus(404);
		return;
	}

	let sqlQuery = `INSERT INTO UserTimezone
		(UserId, Username, TimeZoneOffset)
		VALUES
		(${sanitizedUserID}, '${sanitizedUserName}', '${sanitizedTimeZoneOffset}')`

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
	console.log("/EditUserTimezone", req.query);

	var sanitizedID = req.sanitize(req.query.ID);
	var sanitizedTimeZoneOffset= req.sanitize(req.query.TimeZoneOffset);


	if (sanitizedUserID == null)
	{
		res.sendStatus(404);
		return;
	}

	let sqlQuery = `UPDATE UserTimezone SET TimeZoneOffset = ${sanitizedTimeZoneOffset} WHERE ID = ${sanitizedID}`

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
	console.log("/DeleteUserTimezone", req.query);

	var sanitizedID = req.sanitize(req.query.ID);

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
//end user timezones
}