

//#region popups
function RemoveTimeZonePopup(timeZoneKey)
{
	let popupBodyHtml = `<h3 class="center">Remove Timezone</h3>
		<p class="center">Are you sure you want to remove this Timezone?</p>
		<div style="display:flex; justify-content:center;">
			<button class="positive shaded rounded" onClick="UiRemoveTimeZone('${timeZoneKey}')">Remove</button>
			<button class="negative shaded rounded" onClick="ClosePopup()">Cancel</button>
		</div>`;


	OpenPopup(popupBodyHtml);
}

function AddTimeZonePopup()
{
	let popupBodyHtml = `<h3 class="center">Add Timezone</h3>
		<form onsubmit="return UiAddTimeZone();">`;
	popupBodyHtml += TimeZonePopupBody();
	popupBodyHtml += `
		<div style="display:flex; justify-content:center;">
			<button class="positive shaded rounded" onClick="UiAddTimeZone()">Create</button>
		</div>
		</form>`

	OpenPopup(popupBodyHtml);
}

function EditTimeZonePopup(timeZoneKey)
{
	let popupBodyHtml = `<h3 class="center">Edit Timezone</h3>
		<form onsubmit="return UiEditTimeZone(${timeZoneKey});">`;


	popupBodyHtml += TimeZonePopupBody(TimeZones[timeZoneKey]);
	popupBodyHtml += `
		<div style="display:flex; justify-content:center;">
			<button class="positive shaded rounded" onClick="UiEditTimeZone('${timeZoneKey}')">Save</button>
		</div>
		</form>`;

	OpenPopup(popupBodyHtml);
}

function TimeZonePopupBody(timeZone)
{
	if (!timeZone)
	{
		timeZone = {Name: "", Offset:0};
	}

	let html = `
				<label for"timeZoneName">Name:</label>
				<input type="text" id="timeZoneName" value="${timeZone.Name}" required>
				<label for"timeZoneOffset">Offset:</label>
				<input type="number" id="timeZoneOffset" step="0.25" value="${timeZone.Offset}" required>`;
	return html;
}
//#endregion


//#region

function UiRemoveTimeZone(timeZoneKey)
{
	let userId = TryGetUserId(allowLoginPrompt=false);
	if (userId)
	{
		Post(`/DeleteUserTimezone?ID=${timeZoneKey}`,{},[],null)
	}


	delete TimeZones[timeZoneKey];

	//update visuals
	UpdateTimeZoneVisuals(TimeZones);
	ClosePopup();
	return false;
}

function UiAddTimeZone()
{
	let userId = TryGetUserId(allowLoginPrompt=false);
	let name = document.getElementById("timeZoneName").value;
	let offset = document.getElementById("timeZoneOffset").value;

	if (userId)
	{
		Post(`/AddUserTimezone?UserID=${userId}&TimezoneName=${name}&TimeZoneOffset=${offset}`,{},[],null)
	}

	//update visuals
	AddTimeZone(name, offset);

	UpdateTimeZoneVisuals(TimeZones);
	ClosePopup();
	return false;
}

function UiEditTimeZone(timeZoneKey)
{
	let userId = TryGetUserId(allowLoginPrompt=false);
	TimeZones[timeZoneKey].Name = document.getElementById("timeZoneName").value;
	TimeZones[timeZoneKey].Offset = document.getElementById("timeZoneOffset").value;
	if (userId)
	{
		Post(`/EditUserTimezone?ID=${TimeZones[timeZoneKey].Id}&TimezoneName=${TimeZones[timeZoneKey].Name}&TimeZoneOffset=${TimeZones[timeZoneKey].Offset}`,{},[],null)
	}

	//update visuals
	UpdateTimeZoneVisuals(TimeZones);
	ClosePopup();
	return false;
}

//#endregion


let TimeZones = {};
let TimeZoneIndex = 0;

AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone());
AddTimeZone("UTC", 0);
AddTimeZone("Eastern Time", -6);

UpdateTimeZoneVisuals(TimeZones);

function AddTimeZone(name, offset)
{
	let timeZone = {
		Id: TimeZoneIndex,
		Name: name,
		Offset: offset};

	TimeZones[timeZone.Id] = timeZone;

	TimeZoneIndex += 1;
}

document.addEventListener(OnLoginStateChangeEventName, function () {
	//todo get users timezones
	let userId = TryGetUserId(allowLoginPrompt=false);
	if (userId)
	{
		get(`/UserTimezones?UserID=${userId}`,{},[],function(response)
		{
			if (response.status == 200)
			{
				TimeZones = JSON.parse(response.responseText);
				UpdateTimeZoneVisuals(TimeZones);
			}
		})
	}

	

}, false);