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
		this.htmlTextfield.domObject.childNodes[0].blur();
		return;
	});
	
	//normal, hover, and focus are the valid modes a textfield can be in.
	this.mode = "normal";
	
	this.border = new CrocPanelBorder(
		root,
		"theme/CrocTextfield/base-topright.png",
		"theme/CrocTextfield/base-top.png",
		"theme/CrocTextfield/base-topleft.png",
		"theme/CrocTextfield/base-left.png",
		"theme/CrocTextfield/base-right.png",
		"theme/CrocTextfield/base-bottomleft.png",
		"theme/CrocTextfield/base-bottom.png",
		"theme/CrocTextfield/base-bottomright.png",
		"theme/CrocTextfield/base-center.png"
	);
	
	this.borderFocus = new CrocPanelBorder(
		root,
		"theme/CrocTextfield/focus-topright.png",
		"theme/CrocTextfield/focus-top.png",
		"theme/CrocTextfield/focus-topleft.png",
		"theme/CrocTextfield/focus-left.png",
		"theme/CrocTextfield/focus-right.png",
		"theme/CrocTextfield/focus-bottomleft.png",
		"theme/CrocTextfield/focus-bottom.png",
		"theme/CrocTextfield/focus-bottomright.png",
		"theme/CrocTextfield/base-center.png"
	);
	
	this.borderHover = new CrocPanelBorder(
		root,
		"theme/CrocTextfield/hover-topright.png",
		"theme/CrocTextfield/hover-top.png",
		"theme/CrocTextfield/hover-topleft.png",
		"theme/CrocTextfield/hover-left.png",
		"theme/CrocTextfield/hover-right.png",
		"theme/CrocTextfield/hover-bottomleft.png",
		"theme/CrocTextfield/hover-bottom.png",
		"theme/CrocTextfield/hover-bottomright.png",
		"theme/CrocTextfield/base-center.png"
	);
	
	this.border.addChild(this.htmlTextfield);
	
};

//We inherit everything from CrocBase
CrocTextfield.prototype = Object.create(CrocBase.prototype);

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