
function CrocHTMLTextfield(root, value) {
	
	var initialContent = '<input type="text" value="' + value.toString() + '" style="border:none; background:transparent; font:18px Arial"></input>'
	
	CrocDOM.call(this, root, initialContent);
	
	var currentCrocDOM = this;
	
	this.domObject.childNodes[0].addEventListener("change", function() {
		currentCrocDOM.updateContents();
	});
};

//We inherit everything from CrocBase
CrocHTMLTextfield.prototype = Object.create(CrocDOM.prototype);
CrocHTMLTextfield.prototype.constructor = CrocHTMLTextfield;

CrocHTMLTextfield.prototype.setSize = function(size) {
	this.domObject.childNodes[0].size = size;
	return;
};

CrocHTMLTextfield.prototype.setColor = function(color) {
	this.domObject.childNodes[0].style.color = color;
	return;
};

CrocHTMLTextfield.prototype.setFont = function(font) {
	this.domObject.childNodes[0].style.font = font;
	return;
};

CrocHTMLTextfield.prototype.updateContents = function() {
	var currentCrocDOM = this;
	
	this.drawnInnerHTML = this.domObject.innerHTML;

	var data = 
		'data:image/svg+xml,' +
		'<svg xmlns="http://www.w3.org/2000/svg" width="' + this.domObject.childNodes[0].offsetWidth.toString() + 'px" height="' + this.domObject.childNodes[0].offsetHeight.toString() + 'px">' +
		'<foreignObject x="0" y="0" width="100%" height="100%">' +
		'<div xmlns="http://www.w3.org/1999/xhtml"> ' +
			'<input type="text" size="' + this.domObject.childNodes[0].size.toString() + 
				'" value="' + this.domObject.childNodes[0].value + 
				'" style="border:none; background:transparent; color:' + 
				this.domObject.childNodes[0].style.color + '; font:' +
				this.domObject.childNodes[0].style.font + '">' +
			'</input>' + 
		'</div>' +
		'</foreignObject>' +
		'</svg>';

	this.drawReady = false;
	
	this.drawImage = new Image();
	
	this.drawImage.onload = function () {
		currentCrocDOM.drawReady = true;
		currentCrocDOM.getRoot().repaint();
	}
	
	this.drawImage.onerror = function() {
		console.log("DOM Render failed!");
		
		currentCrocDOM.drawReady = false;
	}
	
	this.drawImage.src = data;
};

CrocHTMLTextfield.prototype.setValue = function(value) {
	this.domObject.childNodes[0].value = value.toString();
	
	this.updateContents();
};

CrocHTMLTextfield.prototype.getValue = function() {
	return this.domObject.childNodes[0].value;
};

CrocHTMLTextfield.prototype.addPaintWarning = function(context) {
	this.getRoot().addPaintWarning(this, context.getCurrentTransform(), this.domObject.childNodes[0].offsetWidth, this.domObject.childNodes[0].offsetHeight);
};

CrocHTMLTextfield.prototype.paint = function(context, width, height) {
	CrocDOM.prototype.paint.call(this, context, width, height);
	
	this.width = this.domObject.childNodes[0].offsetWidth;
	this.height = this.domObject.childNodes[0].offsetHeight;
	
	this.domObject.style.width = this.domObject.childNodes[0].offsetWidth.toString() + "px";
	this.domObject.style.height = this.domObject.childNodes[0].offsetHeight.toString() + "px";
};