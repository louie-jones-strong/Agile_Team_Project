let currentlyIsOn = localStorage.getItem("grayScale");
if (currentlyIsOn === null)
{
	currentlyIsOn = "off";
}

SetGreyScale(currentlyIsOn == "on")

function ToggleGreyScale()
{
	let currentTheme = localStorage.getItem("grayScale");

	SetGreyScale(currentTheme == "off");
}


function SetGreyScale(isOn)
{
	let greyScaleOffIcon = document.getElementById("greyScaleOffIcon");
	let greyScaleOnIcon = document.getElementById("greyScaleOnIcon");

	if (isOn)
	{
		document.body.classList.add("greyScale");

		if (greyScaleOffIcon != null)
			greyScaleOffIcon.classList.remove("hide");

		if (greyScaleOnIcon != null)
			greyScaleOnIcon.classList.add("hide");

	}
	else
	{
		document.body.classList.remove("greyScale");

		if (greyScaleOffIcon != null)
			greyScaleOffIcon.classList.add("hide");

		if (greyScaleOnIcon != null)
			greyScaleOnIcon.classList.remove("hide");
	}
;
	localStorage.setItem("grayScale", isOn ? "on" : "off");
}

