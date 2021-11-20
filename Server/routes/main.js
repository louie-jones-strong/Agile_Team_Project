module.exports = function(app, port) {

	console.log(`http://localhost:${port}/`);
	app.get("/",function(req, res){
	});



	console.log(`http://localhost:${port}/health`);
	app.get("/health",function(req, res){
		res.send("Healthy")
	});

}