function CrocProgressBar(root, value) {
	CrocBase.call(this, root);
	
	this.value = value || 0;
	this.minValue = 0;
	this.maxValue = 100;
	
	this.border = new CrocPanelBorder(
		root,
		"theme/CrocProgressBar/base-topright.png",
		"theme/CrocProgressBar/base-top.png",
		"theme/CrocProgressBar/base-topleft.png",
		"theme/CrocProgressBar/base-left.png",
		"theme/CrocProgressBar/base-right.png",
		"theme/CrocProgressBar/base-bottomleft.png",
		"theme/CrocProgressBar/base-bottom.png",
		"theme/CrocProgressBar/base-bottomright.png",
		"theme/CrocProgressBar/base-center.png"
	);
	
};

//We inherit everything from CrocBase
CrocProgressBar.prototype = Object.create(CrocBase.prototype);

CrocProgressBar.prototype.setValue = function(value) {
	this.htmlTextfield.setValue(value);
	return;
};

CrocProgressBar.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var currentBorder = this.border;
	
	var tlw = currentBorder.topLeftImage.getWidth();
	var tlh = currentBorder.topLeftImage.getHeight();
	var brw = currentBorder.bottomRightImage.getWidth();
	var brh = currentBorder.bottomLeftImage.getHeight();
	
	currentBorder.paint(context, tlw + brw + this.htmlTextfield.getWidth(), tlh + brh + this.htmlTextfield.getHeight());
	
	return;
}