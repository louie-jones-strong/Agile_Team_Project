// Modified from https://www.w3schools.com/howto/howto_js_draggable.asp

// Make the DIV element draggable:
let marker = document.getElementById("predictedTimeMarker");
MakeElementDraggable(marker, true, false);

function MakeElementDraggable(element, xDraggable, yDraggable)
{
	var xPos = 0, yPos = 0, lastXPos = 0, lastYPos = 0;

	element.onmousedown = DragStart;

	function DragStart(e) {
		e = e || window.event;
		e.preventDefault();

		// get the mouse cursor position at startup:
		lastXPos = e.clientX;
		lastYPos = e.clientY;

		document.onmouseup = DragEnd;
		// call a function whenever the cursor moves:
		document.onmousemove = Dragged;
	}

	function Dragged(e) {
		e = e || window.event;
		e.preventDefault();

		if (xDraggable) {
			xPos = lastXPos - e.clientX;
			lastXPos = e.clientX;

			let ratio = (element.offsetLeft - xPos) / element.parentElement.clientWidth;

			ratio = Math.max(0, Math.min(1, ratio));

			element.style.left = (ratio * 100) + "%";
		}

		if (yDraggable) {
			yPos = lastYPos - e.clientY;
			lastYPos = e.clientY;

			let ratio = (element.offsetTop - yPos) / element.parentElement.clientHeight;
			ratio = Math.max(0, Math.min(1, ratio));

			element.style.top = (ratio * 100) + "%";
		}
	}

	function DragEnd() {
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}
}
