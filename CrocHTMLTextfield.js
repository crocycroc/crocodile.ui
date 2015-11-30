
function CrocHTMLTextfield(root, value) {
	
	var initialContent = '<input type="text" value="' + value.toString() + '"></input>'
	
	CrocDOM.call(this, root, initialContent);
	
	var currentCrocDOM = this;
	
	this.domObject.childNodes[0].addEventListener("change", function() {
		currentCrocDOM.updateContents();
	});
};

//We inherit everything from CrocBase
CrocHTMLTextfield.prototype = Object.create(CrocDOM.prototype);

CrocHTMLTextfield.prototype.updateContents = function() {
	var currentCrocDOM = this;
	
	this.drawnInnerHTML = this.domObject.innerHTML;

	var data = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + this.getWidth().toString() + 'px" height="' + this.getHeight().toString() + 'px">' +
		'<foreignObject x="0" y="0" width="100%" height="100%" requiredExtensions="http://www.w3.org/1999/xhtml">' +
		'<div xmlns="http://www.w3.org/1999/xhtml"> ' +
		'<input type="text" value="' + this.domObject.childNodes[0].value + '">' +
		'</input>' + 
		'</div>' +
		'</foreignObject>' +
		'</svg>';

	var DOMURL = window.URL || window.webkitURL || window;
	this.drawReady = false;
	
	this.drawImage = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);
	
	this.drawImage.onload = function () {
		DOMURL.revokeObjectURL(url);
		currentCrocDOM.drawReady = true;
		currentCrocDOM.getRoot().repaint();
	}
	
	this.drawImage.onerror = function() {
		console.log("DOM Render failed!");
		console.log(url);
		
		DOMURL.revokeObjectURL(url);
		currentCrocDOM.drawReady = false;
	}
	
	this.drawImage.src = url;
};

CrocHTMLTextfield.prototype.setValue = function(value) {
	this.domObject.childNodes[0].value = value.toString();
	
	this.updateContents();
};

CrocHTMLTextfield.prototype.getValue = function() {
	return this.domObject.childNodes[0].value;
};