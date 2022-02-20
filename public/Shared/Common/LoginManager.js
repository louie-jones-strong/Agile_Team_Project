function LoginPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">Login</h3>
		<form class="center" action="/login" method="get">
			<label for"username">Username:</label>
			<input class="center" type="text" id="username" name="username" required><br>

			<label for="password">Password:</label>
			<input class="center" type="password" id="password" name="password" required><br>
			<a href="">Forgot Password</a><br>

			<button class="positive">Login</button>
		</form>
		<button class="center shaded" onclick="RegisterPopup()">Create Account</button>`

	OpenPopup(popupBodyHtml)
}

function RegisterPopup()
{
	let popupBodyHtml = `
		<h3 class="center popupTitle">Create Account</h3>
		<form class="center" action="/register" method="get">
			<label for"username">Username:</label>
			<input class="center" type="text" id="username" name="username" required><br>

			<label for="password">Password:</label>
			<input class="center" type="password" id="password" name="password" required><br>

			<label id="passwordConfirmLabel" for="passwordConfirm">Password Confirmation:</label>
			<input class="center" type="password" id="passwordConfirm" name="passwordConfirm" required><br>

			<button class="positive shaded">Create</button>
		</form>`

	OpenPopup(popupBodyHtml)
}