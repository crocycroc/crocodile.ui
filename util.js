
function fastHitArrayTest(arr) {
	var i=0, len=arr.length;
	while (i != len) {
		
		if(arr[i] !== 255 || arr[i] !== 0) {
			return true;
		}
		
		i++;
	}
	
	return false;
}

function determineFontHeight(fontStyle) {
	var body = document.getElementsByTagName("body")[0];
	var dummy = document.createElement("span");
	var dummyText = document.createTextNode("M");
	dummy.appendChild(dummyText);
	dummy.style.font = fontStyle
	body.appendChild(dummy);
	var result = dummy.offsetHeight - (dummy.offsetHeight / 3);
	body.removeChild(dummy);
	return result;
}

function getTextWidthDOM(text, font) {
	var f = font || '12px arial'
	
	var body = document.getElementsByTagName("body")[0];
	var dummy = document.createElement("span");
	var dummyText = document.createTextNode(text);
	dummy.appendChild(dummyText);
	dummy.style.font = f;
	dummy.style.float = 'left';
	dummy.style.whiteSpace = 'nowrap';
	body.appendChild(dummy);
	var result = dummy.offsetWidth;
	body.removeChild(dummy);
	return result;
}