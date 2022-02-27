
//#region public
const Register = (req, res, next) => {
	console.log("user created");
	next();
};

const Login = (req, res, next) => {

	req.query.UserID = req.query.password;
	console.log("user logged in");
	next();
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