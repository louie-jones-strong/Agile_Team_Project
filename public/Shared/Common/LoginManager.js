//#region popups

function LoginPopup()
{
	if (IsSignedIn())
	{
		SignedInPopup();
		return;
	}

	let popupBodyHtml = `
		<h3 class="center popupTitle">Login</h3>
		<form class="center" onsubmit="return LoginUi();">
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
	if (IsSignedIn())
	{
		SignedInPopup();
		return;
	}

	let popupBodyHtml = `
		<h3 class="center popupTitle">Create Account</h3>
		<form class="center" onsubmit="return RegisterUi();">
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

function SignedInPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">Logged In</h3>
		<p class="center">You are currently logged in as: <br>
		"${UserData.Username}" <br>
		UserID: ${UserData.UserID}</p>

		<div style="display:flex; justify-content:center;">
			<button class="negative rounded shaded" onclick="LogOutUi()">Log Out</button>
		</div>`

	OpenPopup(popupBodyHtml)
}

//#endregion

let UserData = null;
const OnLoginStateChangeEventName = "OnLoginStateChange";
const LocalStorageKey_Email = "Auth_Email";
const LocalStorageKey_Password = "Auth_Password";

window.addEventListener('DOMContentLoaded', (event) => {
	TryLoginWithLocalStorage();
});



function LoginUi()
{
	let email = document.getElementById("email").value;
	let password = document.getElementById("password").value;

	SendLoginRequest(email, password);
	return false;
}

function RegisterUi()
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


	Post(`/register?Username=${username}&email=${email}&password=${password1}`,
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

function LogOutUi()
{
	location.reload();
	localStorage.setItem(LocalStorageKey_Email, null);
	localStorage.setItem(LocalStorageKey_Password, null);
}

function TryLoginWithLocalStorage()
{

	let email = localStorage.getItem(LocalStorageKey_Email);
	let password = localStorage.getItem(LocalStorageKey_Password);

	if (email != null && password != null)
	{
		SendLoginRequest(email, password);
	}
}

function SendLoginRequest(email, password)
{
	Post(`/login?email=${email}&password=${password}`,
		``,
		{}, function(response)
		{
			if (response.status == 200)
			{
				UserData = JSON.parse(response.responseText);
				UpdateLoginState()
				ClosePopup();

				localStorage.setItem(LocalStorageKey_Email, email);
				localStorage.setItem(LocalStorageKey_Password, password);
			}
		});
}



function IsSignedIn()
{
	return UserData != null;
}

function TryGetUserId(allowLoginPrompt=true)
{
	if (IsSignedIn())
	{
		return UserData["UserID"]
	}

	if (allowLoginPrompt)
	{
		LoginPromptPopup();
	}
	return null;
}



function UpdateLoginState()
{
	var myCustomEvent = new Event(OnLoginStateChangeEventName);
	document.dispatchEvent(myCustomEvent);
}


