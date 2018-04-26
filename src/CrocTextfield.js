function CrocTextfield(root, value) {
	CrocBase.call(this, root);
	
	var currentTextfield = this;
	
	this.htmlTextfield = new CrocHTMLTextfield(root, value);
	
	this.htmlTextfield.domObject.childNodes[0].onfocus = function(e) {
		currentTextfield.getRoot().setFocusedObject(currentTextfield);
		currentTextfield.setMode("focus");
		this.focus();
	};
	
	this.htmlTextfield.domObject.childNodes[0].onblur = function(e) {
// 		currentTextfield.getRoot().setFocusedObject(currentTextfield);
		currentTextfield.setMode("normal");
	};
	
	this.htmlTextfield.domObject.childNodes[0].onmouseover = function(e) {
// 		currentTextfield.getRoot().setFocusedObject(currentTextfield);
		currentTextfield.setMode("hover");
	};
	
	this.htmlTextfield.domObject.childNodes[0].onmouseleave = function(e) {
// 		currentTextfield.getRoot().setFocusedObject(currentTextfield);
		
		if(currentTextfield.mode !== "focus") {
			currentTextfield.setMode("normal");
		}
	};
	
	this.addEventListener("blur", function(e) {
// 		this.htmlTextfield.domObject.childNodes[0].blur();
		return;
	});
	
	//normal, hover, and focus are the valid modes a textfield can be in.
	this.mode = "normal";
	
	this.border = new CrocPanelBorder(
		root,
		root.themer.getValue(arguments.callee, "tl"),
		root.themer.getValue(arguments.callee, "t"),
		root.themer.getValue(arguments.callee, "tr"),
		root.themer.getValue(arguments.callee, "l"),
		root.themer.getValue(arguments.callee, "r"),
		root.themer.getValue(arguments.callee, "bl"),
		root.themer.getValue(arguments.callee, "b"),
		root.themer.getValue(arguments.callee, "br"),
		root.themer.getValue(arguments.callee, "bkg")
	);
	
	this.borderFocus = new CrocPanelBorder(
		root,
		root.themer.getValue(arguments.callee, "tlF"),
		root.themer.getValue(arguments.callee, "tF"),
		root.themer.getValue(arguments.callee, "trF"),
		root.themer.getValue(arguments.callee, "lF"),
		root.themer.getValue(arguments.callee, "rF"),
		root.themer.getValue(arguments.callee, "blF"),
		root.themer.getValue(arguments.callee, "bF"),
		root.themer.getValue(arguments.callee, "brF"),
		root.themer.getValue(arguments.callee, "bkgF")
	);
	
	this.borderHover = new CrocPanelBorder(
		root,
		root.themer.getValue(arguments.callee, "tlH"),
		root.themer.getValue(arguments.callee, "tH"),
		root.themer.getValue(arguments.callee, "trH"),
		root.themer.getValue(arguments.callee, "lH"),
		root.themer.getValue(arguments.callee, "rH"),
		root.themer.getValue(arguments.callee, "blH"),
		root.themer.getValue(arguments.callee, "bH"),
		root.themer.getValue(arguments.callee, "brH"),
		root.themer.getValue(arguments.callee, "bkgH")
	);
	
	this.border.addChild(this.htmlTextfield);
	
};

//We inherit everything from CrocBase
CrocTextfield.prototype = Object.create(CrocBase.prototype);
CrocTextfield.prototype.constructor = CrocTextfield;

CrocTextfield.prototype.setSize = function(size) {
	this.htmlTextfield.setSize(size);
	return;
};

CrocTextfield.prototype.setColor = function(color) {
	this.htmlTextfield.setColor(color);
	return;
};

CrocTextfield.prototype.setFont = function(font) {
	this.htmlTextfield.setFont(font);
	return;
};

CrocTextfield.prototype.setValue = function(value) {
	this.htmlTextfield.setValue(value);
	return;
};

CrocTextfield.prototype.setMode = function(mode) {
	this.mode = mode;
	this.getRoot().repaint();
};

CrocTextfield.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var currentBorder = this.border;
	
	switch(this.mode) {
		case 'normal':
			currentBorder = this.border;
			break;
			
		case 'hover':
			currentBorder = this.borderHover;
			break;
			
		case 'focus':
			currentBorder = this.borderFocus;
			break;
			
		default:
			break;
	}
	
	var tlw = currentBorder.topLeftImage.getWidth();
	var tlh = currentBorder.topLeftImage.getHeight();
	var brw = currentBorder.bottomRightImage.getWidth();
	var brh = currentBorder.bottomLeftImage.getHeight();
	
	currentBorder.paint(context, tlw + brw + this.htmlTextfield.getWidth(), tlh + brh + this.htmlTextfield.getHeight());
	
	return;
}
