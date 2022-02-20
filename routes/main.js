const admin = require("../firebase-services");
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

	app.post("/register", admin.register)
	app.post("/logout", admin.checkIfAuthenticated, admin.logout);

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
}