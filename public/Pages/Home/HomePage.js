UpdateClocks();

function UpdateClocks()
{
	UpdateClockFace("homeClock1", 0);
	UpdateClockFace("homeClock2", 0);

	setTimeout(UpdateClocks, 250);
}



document.addEventListener(OnLoginStateChangeEventName, function () {
	let homeRegister = document.getElementById("homeRegister");
	homeRegister.remove();

}, false);