
function CrocHTMLTextfield(root, value) {
	
	var initialContent = '<input type="text" value="' + value.toString() + '"></input>'
	
	CrocDOM.call(this, root, initialContent);
};

//We inherit everything from CrocBase
CrocHTMLTextfield.prototype = Object.create(CrocDOM.prototype);

CrocHTMLTextfield.prototype.updateContents = function() {
	var currentCrocDOM = this;
	
	this.drawnInnerHTML = this.domObject.innerHTML;
	
	var tempDomClone = this.domObject.cloneNode(true);
	tempDomClone.style.zIndex = 100;
	tempDomClone.style.visibility = "visible";
	tempDomClone.style.top = "0px";
	tempDomClone.style.left = "0px";
	
	var data = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + this.getWidth().toString() + 'px" height="' + this.getHeight().toString() + 'px">' +
		'<foreignObject x="0" y="0" width="100%" height="100%" requiredExtensions="http://www.w3.org/1999/xhtml">' +
		tempDomClone.outerHTML +
		'</input>' + 
		'</foreignObject>' +
		'</svg>';

	console.log(data);
		
	var DOMURL = window.URL || window.webkitURL || window;
	this.drawReady = false;
	
	this.drawImage = new Image();
	var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
	var url = DOMURL.createObjectURL(svg);
	
	this.drawImage.onload = function () {
		console.log("DOM Render complete!");
		
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