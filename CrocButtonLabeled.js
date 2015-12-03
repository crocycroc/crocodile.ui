
function CrocButtonLabeled(root, text) {
	var currentTextfield = this;
	
	this.label = new CrocLabel(root, text);

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
	
	this.borderPressed = new CrocPanelBorder(
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
	
	CrocButton.call(this, root, this.border, this.borderHover, this.borderPressed);
	
	this.label.setAlignment("center", "center");
	this.border.addChild(this.label);
	this.borderPressed.addChild(this.label);
	this.borderHover.addChild(this.label);
};

CrocButtonLabeled.prototype = Object.create(CrocButton.prototype);

CrocTextfield.prototype.setColor = function(color) {
	this.label.setColor(color);
	return;
};

CrocTextfield.prototype.setFont = function(font) {
	this.label.setFont(font);
	return;
};

CrocTextfield.prototype.setText = function(text) {
	this.label.setText(text);
	return;
};

CrocTextfield.prototype.setMode = function(mode) {
	this.mode = mode;
	this.getRoot().repaint();
};