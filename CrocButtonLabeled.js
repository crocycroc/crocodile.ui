
function CrocButtonLabeled(root, text,
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentTextfield = this;
	
	this.label = new CrocLabel(root, text);

	tr = tr || root.themer.getValue(arguments.callee, "tr");
	t = t || root.themer.getValue(arguments.callee, "t");
	tl = tl || root.themer.getValue(arguments.callee, "tl");
	l = l || root.themer.getValue(arguments.callee, "l");
	r = r || root.themer.getValue(arguments.callee, "r");
	bl = bl || root.themer.getValue(arguments.callee, "bl");
	b = b || root.themer.getValue(arguments.callee, "b");
	br = br || root.themer.getValue(arguments.callee, "br");
	bkg = bkg || root.themer.getValue(arguments.callee, "bkg");
	
	trH = trH || root.themer.getValue(arguments.callee, "trH");
	tH = tH || root.themer.getValue(arguments.callee, "tH");
	tlH = tlH || root.themer.getValue(arguments.callee, "tlH");
	lH = lH || root.themer.getValue(arguments.callee, "lH");
	rH = rH || root.themer.getValue(arguments.callee, "rH");
	blH = blH || root.themer.getValue(arguments.callee, "blH");
	bH = bH || root.themer.getValue(arguments.callee, "bH");
	brH = brH || root.themer.getValue(arguments.callee, "brH");
	bkgH = bkgH || root.themer.getValue(arguments.callee, "bkgH");
	
	trF = trF || root.themer.getValue(arguments.callee, "trF");
	tF = tF || root.themer.getValue(arguments.callee, "tF");
	tlF = tlF || root.themer.getValue(arguments.callee, "tlF");
	lF = lF || root.themer.getValue(arguments.callee, "lF");
	rF = rF || root.themer.getValue(arguments.callee, "rF");
	blF = blF || root.themer.getValue(arguments.callee, "blF");
	bF = bF || root.themer.getValue(arguments.callee, "bF");
	brF = brF || root.themer.getValue(arguments.callee, "brF");
	bkgF = bkgF || root.themer.getValue(arguments.callee, "bkgF");
	
	//normal, hover, and focus are the valid modes a textfield can be in.
	this.mode = "normal";
	
	this.border = new CrocPanelBorder(root, tl, t, tr, l, r, bl, b, br, bkg);
	this.borderPressed = new CrocPanelBorder(root, tlF, tF, trF, lF, rF, blF, bF, brF, bkgF);
	this.borderHover = new CrocPanelBorder(root, tlH, tH, trH, lH, rH, blH, bH, brH, bkgH);
	
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
