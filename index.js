const port = 8080;

const express = require ("express");
const mysql = require ("mysql");
const bodyParser = require ("body-parser");
const expressSanitizer = require('express-sanitizer');
const app = express();


const db = mysql.createConnection ({
	host: "localhost",
	user: "root",
	password: "",
	database: "welltimed"

});

// connect to database
db.connect((err) => {
	if (err) {
		throw err;
	}
	console.log("Connected to database");
});
global.db = db;




// setup static folder for page assets eg: css, images and icon
app.use(express.static('public'));

app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(LogRequest);

// logic for each end point
require("./routes/main")(app);


app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);
// html templates for each page
app.set("views",__dirname + "/views");



// start server
app.listen(port, () => {
	console.log(`Node server listening on port ${port}!`);
	console.log(`http://localhost:${port}/`);
});


function LogRequest(req, res, next)
{
	let startTime = performance.now();

	console.log();
	console.log(req.method, req._parsedUrl.pathname, req.query, req.body);
	next();

	console.log(res.statusCode, `took: ${performance.now() - startTime} ms`);
	if (res.statusCode >= 300)
	{
		console.log(res.statusMessage)
	}
}