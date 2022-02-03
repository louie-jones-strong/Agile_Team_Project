
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

//#endregion Login flow

}