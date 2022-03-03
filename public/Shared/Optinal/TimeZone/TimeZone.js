

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
		Post(`/DeleteUserTimezone?UserID=${userId}&ID=${timeZoneKey}`,{},[],null)
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
	AddTimeZone(name, offset, true);

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
		Post(`/EditUserTimezone?UserID=${userId}&ID=${TimeZones[timeZoneKey].Id}&TimezoneName=${TimeZones[timeZoneKey].Name}&TimeZoneOffset=${TimeZones[timeZoneKey].Offset}`,{},[],null)
	}

	//update visuals
	UpdateTimeZoneVisuals(TimeZones);
	ClosePopup();
	return false;
}

//#endregion


let TimeZones = {};
let TimeZoneIndex = 0;
ClearTimeZones();

AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone(), false);
AddTimeZone("UTC", 0, true);
AddTimeZone("Eastern Time", -6, true);

UpdateTimeZoneVisuals(TimeZones);

function ClearTimeZones()
{
	TimeZones = {};
	TimeZoneIndex = 0;
}

function AddTimeZone(name, offset, editable, id=undefined)
{
	if (!id)
	{
		id =  -TimeZoneIndex;
	}

	let timeZone = {
		Id: id,
		Name: name,
		Offset: offset,
		Editable: editable};

	TimeZones[id] = timeZone;

	TimeZoneIndex += 1;
}

document.addEventListener(OnLoginStateChangeEventName, function () {
	let userId = TryGetUserId(allowLoginPrompt=false);
	if (userId)
	{
		Get(`/UserTimezones?UserID=${userId}`,{},[],function(response)
		{
			if (response.status == 200)
			{
				let timeZonesArray = JSON.parse(response.responseText);
				console.log(timeZonesArray);
				ClearTimeZones();
				AddTimeZone(`You (${Intl.DateTimeFormat().resolvedOptions().timeZone})`, GetUserTimeZone(), editable=false);

				for (let index = 0; index < timeZonesArray.length; index++)
				{
					const item = timeZonesArray[index];

					AddTimeZone(item.timezoneName, item.TimeZoneOffset, editable=true, item.ID);
				}

				UpdateTimeZoneVisuals(TimeZones);
			}
		})
	}

}, false);