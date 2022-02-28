//#region popups

function LoginPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">Login</h3>
		<form class="center" onsubmit="return Login();">
			<label for"email">Email:</label>
			<input class="center" type="email" id="email" required><br>

			<label for="password">Password:</label>
			<input class="center" type="password" id="password" required><br>
			<a href="">Forgot Password</a><br>

			<button class="positive rounded shaded sheen">Login</button>
		</form>
		<button class="center" onclick="RegisterPopup()">Create Account</button>`

	OpenPopup(popupBodyHtml)
}

function RegisterPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">Create Account</h3>
		<form class="center" onsubmit="return Register();">
			<label for"username">Username:</label>
			<input class="center" id="username" required><br>

			<label for"email">Email:</label>
			<input class="center" type="email" id="email" required><br>

			<label for="password">Password:</label>
			<input class="center" type="password" id="password" minlength="6" required><br>

			<label id="passwordConfirmLabel" for="passwordConfirm">Password Confirmation:</label>
			<input class="center" type="password" id="passwordConfirm" minlength="6" required><br>

			<button class="positive rounded shaded">Create</button>
		</form>`

	OpenPopup(popupBodyHtml)
}

function LoginPromptPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">You need to login</h3>
		<p>You must be logged in to used this feature.</p>
		<div style="display:flex; justify-content:center;">
			<button class="positive rounded shaded sheen" onclick="LoginPopup()">Login</button>
			<button class="positive rounded shaded sheen" onclick="RegisterPopup()">Create Account</button>
		</div>`

	OpenPopup(popupBodyHtml)
}

//#endregion

let UserData = null;
const OnLoginStateChangeEventName = "OnLoginStateChange";



function Login()
{
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;

	Post(`/login?email=${email}&password=${password}`,
		``,
		{}, function(response)
		{
			if (response.status == 200)
			{
				UserData = JSON.parse(response.responseText);
				UpdateLoginState()
				ClosePopup();
			}
		});
	return false;
}

function Register()
{
	let username = document.getElementById("username").value;
	let email = document.getElementById("email").value;
	let password1 = document.getElementById("password").value;
	let password2 = document.getElementById("passwordConfirm").value;

	if (!(password1 === password2))
	{
		alert("passwords should be the same");
		return false;
	}


	Post(`/register`,
		`Username=${username}&email=${email}&password=${password1}`,
		{}, function(response)
		{
			if (response.status == 200)
			{
				UserData = JSON.parse(response.responseText);
				UpdateLoginState()
				ClosePopup();
			}
		});
	return false;
}

function IsSignedIn()
{
	return UserData != null;
}

function TryGetUserId()
{
	if (IsSignedIn())
	{
		return UserData["UserID"]
	}
	else
	{
		LoginPromptPopup();
		return null;
	}
}



function UpdateLoginState()
{
	var myCustomEvent = new Event(OnLoginStateChangeEventName);
	document.dispatchEvent(myCustomEvent);
}


