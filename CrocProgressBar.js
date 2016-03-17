function CrocProgressBar(root, value) {
	CrocBase.call(this, root);
	
	this.value = value || 0;
	this.minValue = 0;
	this.maxValue = 100;
	this.showLabel = false;
	
	this.border = new CrocPanelBorder(
		root,
		"theme/CrocProgressBar/groove-topright.png",
		"theme/CrocProgressBar/groove-top.png",
		"theme/CrocProgressBar/groove-topleft.png",
		"theme/CrocProgressBar/groove-left.png",
		"theme/CrocProgressBar/groove-right.png",
		"theme/CrocProgressBar/groove-bottomleft.png",
		"theme/CrocProgressBar/groove-bottom.png",
		"theme/CrocProgressBar/groove-bottomright.png",
		"theme/CrocProgressBar/groove-center.png"
	);
	
	this.label = new CrocLabel(root, this.value.toString(), "22px Arial");
	
	this.center = new CrocImageSimple(root, "theme/CrocProgressBar/progress-center.png");
	this.center.setScaling('target');
	
	this.left = new CrocImageSimple(root, "theme/CrocProgressBar/progress-left.png");
	this.left.setScaling('none');
	
	this.right = new CrocImageSimple(root, "theme/CrocProgressBar/progress-right.png");
	this.right.setScaling('none');
	
	
	this.border.addChild(this.label);
	
	this.border.addChild(this.center);
	this.border.addChild(this.left);
	this.border.addChild(this.right);
	
	this.border.setTargetHeight("100%");
	this.border.setTargetWidth("100%");
	
	
};

//We inherit everything from CrocBase
CrocProgressBar.prototype = Object.create(CrocBase.prototype);
CrocProgressBar.prototype.constructor = CrocProgressBar;

CrocProgressBar.prototype.setMaxValue = function(maxValue) {
	
	this.maxValue = maxValue;
	
	this.setValue(this.value);
	
};

CrocProgressBar.prototype.setMinValue = function(minValue) {
	this.minValue = minValue;
	
	this.setValue(this.value);
};

CrocProgressBar.prototype.setValue = function(value) {
	
	if(value < this.minValue) {
		value = this.minValue;
	}
	
	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	this.value = value;
	this.label.setText(this.value.toString());
	this.getRoot().repaint();
	
};

CrocProgressBar.prototype.setShowLabel = function(value) {
	this.showLabel = value;
	this.getRoot().repaint();
};

CrocProgressBar.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var currentBorder = this.border;
	
	var lh = this.left.getHeight();
	
	this.center.setTargetHeight(this.left.getHeight());

	interiorWidth = currentBorder.topImage.getWidth();	
	
	var currentWidth = (interiorWidth * ((this.value - this.minValue)/(this.maxValue - this.minValue))) - (this.left.getWidth() + this.right.getWidth());
	
	if(currentWidth <= 0) {
		this.center.setVisible(false);
		currentWidth = 0;
	}
	
	else {
		this.center.setVisible(true);
		this.center.setTargetWidth(currentWidth);
	}
	
	
	var tlh = currentBorder.topLeftImage.getHeight();
	var brh = currentBorder.bottomLeftImage.getHeight();
	
	var currentHeight = tlh + brh + this.left.getHeight();
	
	currentBorder.setChildOrientation(this.left, 0, 0);
	currentBorder.setChildOrientation(this.center, this.left.getWidth(), 0);
	currentBorder.setChildOrientation(this.right, currentWidth + this.left.getWidth(), 0);

	currentBorder.setChildOrientation(this.label, (interiorWidth / 2) - (this.label.getWidth() / 2), (currentHeight / 2) - this.label.getHeight());
	this.label.setVisible(this.showLabel);
	
	currentBorder.paint(context, this.getWidth(), currentHeight);
	
	return;
}