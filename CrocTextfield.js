function CrocTextfield(root, value) {
	CrocBase.call(this, root);
	
	this.htmlTextfield = new CrocHTMLTextfield(root, value);
	
	var tr = "theme/CrocTextfield/base-topright.png";
	var t = "theme/CrocTextfield/base-top.png";
	var tl = "theme/CrocTextfield/base-topleft.png";
	var l = "theme/CrocTextfield/base-left.png";
	var r = "theme/CrocTextfield/base-right.png";
	var bl = "theme/CrocTextfield/base-bottomleft.png";
	var b = "theme/CrocTextfield/base-bottom.png";
	var br = "theme/CrocTextfield/base-bottomright.png";
	var bkg = "theme/CrocTextfield/base-center.png";
	
	this.border = new CrocPanelBorder(
		root,
		tr,
		t,
		tl,
		l,
		r,
		bl,
		b,
		br,
		bkg
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

CrocTextfield.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var bw = this.border.topLeftImage.getWidth();
	var bh = this.border.topLeftImage.getHeight();
	
	if(bw > 0 && bh > 0) {
		this.border.paint(context, bw * 2 + this.htmlTextfield.getWidth(), bh * 2 + this.htmlTextfield.getHeight());
	}
	
	return;
}