

function OpenPopup(bodyHtml)
{
	var popupHolder = document.getElementById("popupHolder");
	popupHolder.classList.add("popupShowing");

	popupHolder.innerHTML = `
		<div class="centeredFrame">
			<div class="glass popup">

				<div class="topButtonsHolder">
					<div></div>
					<button class="closePopup" onclick='ClosePopup()'></button>
				</div>
				<div class="popupBody">
					${bodyHtml}
				</div>
			</div>
		</div>`;
}

function ClosePopup()
{
	var popupHolder = document.getElementById("popupHolder");
	popupHolder.classList.remove("popupShowing");
	popupHolder.innerHTML = "";
}
