function CrocAnalogMeter(root, value, backgroundImagePath, needleImagePath) {
	CrocBase.call(this, root);
	
	backgroundImagePath = backgroundImagePath || root.themer.getValue(arguments.callee, "backgroundImage");
	needleImagePath = needleImagePath || root.themer.getValue(arguments.callee, "needleImage");
	
	this.value = value || 0;
	this.valueLabelPostfix = '';
	this.valueLabelPrefix = '';
	this.valueLabelScale = 1.0;
	this.valueLabelToFixed = 0;
	this.minValue = 0;
	this.maxValue = 100;
	
	this.background = new CrocImageSimple(root, backgroundImagePath);
	this.background.setScaling('none');
	
	this.needle = new CrocImageSimple(root, needleImagePath);
	this.needle.setScaling("none");
	
	this.valueLabel = new CrocLabel(root, this.value.toString(), root.themer.getValue(arguments.callee, "valueLabelFont"), root.themer.getValue(arguments.callee, "valueLabelFontColor"))
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

CrocAnalogMeter.prototype.setValueLabelPostfix = function(valueLabelPostfix) {
	this.valueLabelPostfix = valueLabelPostfix.toString();
};

CrocAnalogMeter.prototype.setValueLabelPrefix = function(valueLabelPrefix) {
	this.valueLabelPrefix = valueLabelPrefix.toString();
};

CrocAnalogMeter.prototype.setValueLabelScale = function(valueLabelScale) {
	this.valueLabelScale = Number(valueLabelScale);
};

CrocAnalogMeter.prototype.setValueLabelToFixed = function(valueLabelToFixed) {
	this.valueLabelToFixed = Number(valueLabelToFixed);
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
	
	context.translate(-14, 92);
	
	this.valueLabel.text = this.valueLabelPrefix + (this.value * this.valueLabelScale).toFixed(this.valueLabelToFixed) + this.valueLabelPostfix;
	this.valueLabel.paint(context, this.background.getWidth(), this.background.getHeight());
	
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
	
	this.width = this.background.getWidth();
	this.height = this.background.getHeight();
	
	context.restore();
	
	return;
}
