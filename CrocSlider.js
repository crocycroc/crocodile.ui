function CrocSlider(root) {
	CrocBase.call(this, root);

	//normal, hover, and focus are the valid modes
	this.mode = "normal";
	this.orientation = "horizontal";
	
	this.value = 0;
	this.maxValue = 100;
	this.minValue = 0;
	this.stepping = 1;
	
	this.groove = new CrocPanelBorder(
		root,
		"theme/CrocSlider/groove-topright.png",
		"theme/CrocSlider/groove-top.png",
		"theme/CrocSlider/groove-topleft.png",
		"theme/CrocSlider/groove-left.png",
		"theme/CrocSlider/groove-right.png",
		"theme/CrocSlider/groove-bottomleft.png",
		"theme/CrocSlider/groove-bottom.png",
		"theme/CrocSlider/groove-bottomright.png",
		"theme/CrocSlider/groove-center.png"
	);
	
	this.slider = new CrocImageSimple(root, "theme/CrocSlider/horizontal-slider-handle.png");
	this.slider.setScaling('none');
	this.sliderHover = new CrocImageSimple(root, "theme/CrocSlider/horizontal-slider-hover.png");
	this.sliderHover.setScaling('none');
	this.sliderFocus = new CrocImageSimple(root, "theme/CrocSlider/horizontal-slider-focus.png");
	this.sliderFocus.setScaling('none');
	
	this.addEventListener('mousemove', function(e){
		
		if(!this.hasFocus()) {
			this.setMode('hover');
		}
		
		else {
			this.globalPointToValue(e.x, e.y);
			
			this.event('valuechanged', this.getValue());
		}
		
		return false;
	});
	
	this.addEventListener('mouseleave', function(e) {
		
		if(!this.hasFocus()) {
			this.setMode('normal');
		}
		
		return false;
	});
	
	this.addEventListener('mousedown', function(e) {
		this.focus();
		
		this.globalPointToValue(e.x, e.y);
		
		this.event('valuechanged', this.getValue());
		
		this.setMode('focus');
	});
	
	this.addEventListener('mouseup', function(e) {
		this.blur();
		this.setMode('hover');
	});
	
};

//We inherit everything from CrocBase
CrocSlider.prototype = Object.create(CrocBase.prototype);

CrocSlider.prototype.getValue = function() {
	return this.value;
};

CrocSlider.prototype.setSize = function(size) {
	this.htmlTextfield.setSize(size);
	return;
};

CrocSlider.prototype.setColor = function(color) {
	this.htmlTextfield.setColor(color);
	return;
};

CrocSlider.prototype.setFont = function(font) {
	this.htmlTextfield.setFont(font);
	return;
};

CrocSlider.prototype.setMode = function(mode) {
	this.mode = mode;
	this.getRoot().repaint();
};

CrocSlider.prototype.setValue = function(value) {
	
	if(value < this.minValue) {
		value = this.minValue;
	}
	
	if(value > this.maxValue) {
		value = this.maxValue;
	}
	
	this.value = Math.round(value/this.stepping) * this.stepping;
	this.getRoot().repaint();
	
};

CrocSlider.prototype.setStepping = function(stepping) {
	
	this.stepping = stepping;
	this.setValue(this.value);
};

CrocSlider.prototype.setMaxValue = function(maxValue) {
	
	this.maxValue = maxValue;
	
	this.setValue(this.value);
	
};

CrocSlider.prototype.setMinValue = function(minValue) {
	this.minValue = minValue;
	
	this.setValue(this.value);
};

CrocSlider.prototype.getWidth = function () {
	if(this.orientation === 'verticle') {
		return this.slider.getWidth();
	}
	
	else {
		return this.width;
	}
};

CrocSlider.prototype.getHeight = function() {
	if(this.orientation === 'verticle') {
		return this.height;
	}
	
	else {
		return this.slider.getHeight();
	}
};

CrocSlider.prototype.globalPointToValue = function(x, y) {
	var t = this.inverseTransform(this.lastTransform);
	
	var c = this.transformPoint(t, x, y);
	
	if(this.orientation === 'verticle') {
		var value = ((c.y - (this.slider.getHeight() / 2)) * (this.maxValue - this.minValue))/(this.getHeight() - this.slider.getHeight());
		
		this.setValue(value);
		
	}
	
	else {
		var value = ((c.x - (this.slider.getWidth() / 2)) * (this.maxValue - this.minValue))/(this.getWidth() - this.slider.getWidth());
		
		this.setValue(value);
	}
};

CrocSlider.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var parentTransform = context.getCurrentTransform();
	
	var currentGroove = this.groove;
	var currentSlider = this.slider;
	
	switch(this.mode) {
		case 'normal':
			currentGroove = this.groove;
			currentSlider = this.slider;
			break;
			
		case 'hover':
			currentGroove = this.groove;
			currentSlider = this.sliderHover;
			break;
			
		case 'focus':
			currentGroove = this.groove;
			currentSlider = this.sliderFocus;
			break;
			
		default:
			break;
	}
	
	var tlw = currentGroove.topLeftImage.getWidth();
	var tlh = currentGroove.topLeftImage.getHeight();
	var brw = currentGroove.bottomRightImage.getWidth();
	var brh = currentGroove.bottomLeftImage.getHeight();
	
	if(this.orientation === 'verticle') {
		context.translate((currentSlider.getWidth() / 2) - ((tlw + brw) / 2), currentSlider.getHeight() / 2);
		currentGroove.paint(context, tlw + brw, this.getHeight() - currentSlider.getHeight());
		
		
		context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
		
		var y = (((this.getHeight() - currentSlider.getHeight()) * (this.value - this.minValue)) / (this.maxValue - this.minValue));
		
		context.translate(0, y);
		currentSlider.paint(context);
	}
	
	else {
		context.translate(currentSlider.getWidth() / 2, (currentSlider.getHeight() / 2) - ((tlh + brh) / 2));
		currentGroove.paint(context, this.getWidth() - currentSlider.getWidth(), tlh + brh);
		
		context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
		
		var x = (((this.getWidth() - currentSlider.getWidth()) * (this.value - this.minValue)) /  (this.maxValue - this.minValue));
		
		context.translate(x, 0);
		currentSlider.paint(context);
	}
	
	return;
}