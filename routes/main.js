
// this turns of the Analytics (we only want Analytics from users not dev)
const IsDevMode = true;


module.exports = function(app, port)
{

	app.get("/",function(req, res)
	{
		res.render("home.ejs", {PageData: {IsDevMode: IsDevMode}})
	});

	app.get("/about",function(req, res)
	{
		res.render("about.ejs", {PageData: {IsDevMode: IsDevMode}});
	});

	app.get("/calendar",function(req, res)
	{
		res.render("calendar.ejs", {PageData: {IsDevMode: IsDevMode}})
	});

	app.get("/clocks",function(req, res)
	{
		res.render("clocks.ejs", {PageData: {IsDevMode: IsDevMode}});
	});

	app.get("/timeline",function(req, res)
	{
		res.render("timeline.ejs", {PageData: {IsDevMode: IsDevMode}});
	});
}