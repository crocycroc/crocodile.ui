
function CrocButtonLabeled(root, text,
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentTextfield = this;
	
	this.label = new CrocLabel(root, text);

	tr = tr || "theme/CrocTextfield/base-topright.png";
	t = t || "theme/CrocTextfield/base-top.png";
	tl = tl || "theme/CrocTextfield/base-topleft.png";
	l = l || "theme/CrocTextfield/base-left.png";
	r = r || "theme/CrocTextfield/base-right.png";
	bl = bl || "theme/CrocTextfield/base-bottomleft.png";
	b = b || "theme/CrocTextfield/base-bottom.png";
	br = br || "theme/CrocTextfield/base-bottomright.png";
	bkg = bkg || "theme/CrocTextfield/base-center.png";
	
	trH = trH || "theme/CrocTextfield/hover-topright.png";
	tH = tH || "theme/CrocTextfield/hover-top.png";
	tlH = tlH || "theme/CrocTextfield/hover-topleft.png";
	lH = lH || "theme/CrocTextfield/hover-left.png";
	rH = rH || "theme/CrocTextfield/hover-right.png";
	blH = blH || "theme/CrocTextfield/hover-bottomleft.png";
	bH = bH || "theme/CrocTextfield/hover-bottom.png";
	brH = brH || "theme/CrocTextfield/hover-bottomright.png";
	bkgH = bkgH || "theme/CrocTextfield/base-center.png";
	
	trF = trF || "theme/CrocTextfield/focus-topright.png";
	tF = tF || "theme/CrocTextfield/focus-top.png";
	tlF = tlF || "theme/CrocTextfield/focus-topleft.png";
	lF = lF || "theme/CrocTextfield/focus-left.png";
	rF = rF || "theme/CrocTextfield/focus-right.png";
	blF = blF || "theme/CrocTextfield/focus-bottomleft.png";
	bF = bF || "theme/CrocTextfield/focus-bottom.png";
	brF = brF || "theme/CrocTextfield/focus-bottomright.png";
	bkgF = bkgF || "theme/CrocTextfield/base-center.png";
	
	//normal, hover, and focus are the valid modes a textfield can be in.
	this.mode = "normal";
	
	this.border = new CrocPanelBorder(root, tr, t, tl, l, r, bl, b, br, bkg);
	this.borderPressed = new CrocPanelBorder(root, trF, tF, tlF, lF, rF, blF, bF, brF, bkgF);
	this.borderHover = new CrocPanelBorder(root, trH, tH, tlH, lH, rH, blH, bH, brH, bkgH);
	
	CrocButton.call(this, root, this.border, this.borderHover, this.borderPressed);
	
	this.label.setAlignment("center", "center");
	this.label.setWrapping("word");
	this.border.addChild(this.label);
	this.borderPressed.addChild(this.label);
	this.borderHover.addChild(this.label);
};

CrocButtonLabeled.prototype = Object.create(CrocButton.prototype);
CrocButtonLabeled.prototype.constructor = CrocButtonLabeled;

CrocButtonLabeled.prototype.getLabel = function() {
	return this.label;
};