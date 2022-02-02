

function LoginPopup()
{
	let popupBodyHtml = `
		<h3 class="center">Login</h3>
		<form>
			<label for"username">Username:</label><br>
			<input type="text" id="username" name="username" required><br>

			<label for="password">Password:</label><br>
			<input type="password" id="password" name="password" required><br>

			<button class="positive">Login</button>
		</form>
		<button onclick="CreateAccountPopup()">Create Account</button>`

	OpenPopup(popupBodyHtml)
}

function CreateAccountPopup()
{
	let popupBodyHtml = `
		<h3 class="center">Create Account</h3>
		<form>
			<label for"username">Username:</label><br>
			<input type="text" id="username" name="username" required><br>

			<label for="password">Password:</label><br>
			<input type="password" id="password" name="password" required><br>

			<label for="passwordConfirm">Password Confirmation:</label><br>
			<input type="password" id="passwordConfirm" name="passwordConfirm" required><br>

			<button class="positive">Create</button>
		</form>`

	OpenPopup(popupBodyHtml)
}