
//#region public
const Register = (req, res, next) => {

	req.query.Username = req.query.email;

	console.log("user created");
	next();
};

const Login = (req, res, next) => {

	let sanitizedEmail = req.sanitize(req.query.email);
	let sqlQuery = `SELECT UserID FROM Users WHERE Username='${sanitizedEmail}'`;

	db.query(sqlQuery, (err, result) => {
		if (err) {
			console.log(err);
			res.sendStatus(301);
			return;
		}
		if (result.length != 1)
		{
			console.log(`couldn't find any users with username: ${sanitizedEmail}`);
			res.sendStatus(301);
			return;
		}

		req.query.UserID = parseInt(result[0].UserID);
		console.log("user logged in");
		next();
	});
};

const Logout = (req, res) => {
	// we don't need to do anything here
};

const Delete = (req, res, next) => {
	// we don't need to do anything here
	next();
};

const CheckIfAuthenticated = (req, res, next) => {
	if (!req.query.UserID)
	{
		return res
			.status(401)
			.json({ error: "You are not authorized to make this request" });
	}

	next();
};

//#endregion

module.exports = {
	Register,
	Login,
	Logout,
	Delete,
	CheckIfAuthenticated
};