function CrocTextfield(root, value) {
	CrocBase.call(this, root);
	
	this.htmlTextfield = new CrocHTMLTextfield(root, value);
	this.border = new CrocPanelBorder(root);
	
	this.border.addChild(this.htmlTextfield);
};

//We inherit everything from CrocBase
CrocTextfield.prototype = Object.create(CrocBase.prototype);

CrocTextfield.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var bw = this.border.topLeftImage.getWidth();
	var bh = this.border.topLeftImage.getHeight();
	
	if(bw > 0 && bh > 0) {
		this.border.paint(context, bw * 2 + this.htmlTextfield.getWidth(), bh * 2 + this.htmlTextfield.getHeight());
	}
	
	return;
}