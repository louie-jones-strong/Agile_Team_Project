function Post(url, bodyData, headerData, onResponse=null)
{
	SendRequest("POST", url, bodyData, headerData, onResponse);
}

function Get(url, bodyData, headerData, onResponse=null)
{
	SendRequest("GET", url, bodyData, headerData, onResponse);
}

function Put(url, bodyData, headerData, onResponse=null)
{
	SendRequest("PUT", url, bodyData, headerData, onResponse);
}

function Delete(url, bodyData, headerData, onResponse=null)
{
	SendRequest("DELETE", url, bodyData, headerData, onResponse);
}

function SendRequest(method, url, bodyData, headerData, onResponse)
{
	var xhr = new XMLHttpRequest();
	xhr.open(method, url, true);

	headerData.forEach(kvp => {
		xhr.setRequestHeader(kvp[0], kvp[1]);
	});

	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			LogResponse(xhr);
			if (onResponse) {
				onResponse(xhr.responseText)
			}
		}
	};

	xhr.send(bodyData);

	console.log("Send "+method+" Request", url, headerData, bodyData);

}

function LogResponse(xhr)
{
	// console.log("Response", xhr.responseURL, xhr.status, xhr.responseText);
}
