function CrocAnalogMeter(root, value, backgroundImagePath, needleImagePath) {
	CrocBase.call(this, root);
	
	backgroundImagePath = backgroundImagePath || "theme/CrocAnalogMeter/background.png";
	needleImagePath = needleImagePath || "theme/CrocAnalogMeter/needle.png";
	
	this.value = value || 0;
	this.minValue = 0;
	this.maxValue = 100;
	this.font = "12px Arial";
	
	this.background = new CrocImageSimple(root, backgroundImagePath);
	this.background.setScaling('none');
	
	this.needle = new CrocImageSimple(root, needleImagePath);
	this.needle.setScaling("none");
	
	this.valueLabel = new CrocLabel(root, this.value.toString(), "18px Helvetica Bold", "black")
	this.valueLabel.setAlignment("right");
};

//We inherit everything from CrocBase
CrocAnalogMeter.prototype = Object.create(CrocBase.prototype);
CrocAnalogMeter.prototype.constructor = CrocAnalogMeter;

CrocAnalogMeter.prototype.setValue = function(value) {
	
	if(value < this.minValue) {
		value = this.minValue;
	}
	
	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	this.value = value;
	this.getRoot().repaint();
	
};

CrocAnalogMeter.prototype.setMaxValue = function(maxValue) {
	
	this.maxValue = maxValue;
	
	this.setValue(this.value);
	
};

CrocAnalogMeter.prototype.setMinValue = function(minValue) {
	this.minValue = minValue;
	
	this.setValue(this.value);
};

CrocAnalogMeter.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	context.save();
	
	this.background.paint(context, width, height);
	
	context.save();
	
	context.translate(142, 92);
	
	this.valueLabel.setText(this.value.toString());
	this.valueLabel.paint(context, width, height);
	
	context.restore();
	
	var needleCenter = this.background.getHeight() / 1.6125;
	
	var backPadding = this.needle.getHeight() / 32;
	var needlePadding = this.needle.getHeight() / 1.33333333333333;
	var basePadding = this.needle.getHeight() - backPadding - needlePadding;
	
	var rad = ((Math.PI * (this.value - this.minValue)) / (this.maxValue - this.minValue));
	
	context.translate(this.background.getWidth() / 2, needleCenter);
	context.rotate((Math.PI/2) + (rad));
	context.translate(-(this.needle.getWidth() / 2), -backPadding - (basePadding/2));
	
	this.getRoot().setSmooth(true);
	this.needle.paint(context, width, height);
	this.getRoot().setSmooth(false);
	
	context.restore();
	
	return;
}
