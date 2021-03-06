function CrocSlider(root, slider, hover, focus, tr, t, tl, l, r, bl, b, br, bkg) {
	CrocBase.call(this, root);

	tr = tr || root.themer.getValue(arguments.callee, "tr");
	t = t || root.themer.getValue(arguments.callee, "t");
	tl = tl || root.themer.getValue(arguments.callee, "tl");
	l = l || root.themer.getValue(arguments.callee, "l");
	r = r || root.themer.getValue(arguments.callee, "r");
	bl = bl || root.themer.getValue(arguments.callee, "bl");
	b = b || root.themer.getValue(arguments.callee, "b");
	br = br || root.themer.getValue(arguments.callee, "br");
	bkg = bkg || root.themer.getValue(arguments.callee, "bkg");
	
	slider = slider || root.themer.getValue(arguments.callee, "slider");
	hover =  hover || root.themer.getValue(arguments.callee, "hover");
	focus = focus || root.themer.getValue(arguments.callee, "focus");
	
	//normal, hover, and focus are the valid modes
	this.mode = "normal";
	this.orientation = "horizontal";
	
	this.value = 0;
	this.maxValue = 100;
	this.minValue = 0;
	this.stepping = 1;
	
	this.groove = new CrocPanelBorder(root, tl, t, tr, l, r, bl, b, br, bkg);
	
	this.slider = new CrocImageSimple(root, slider);
	this.slider.setScaling('none');
	this.sliderHover = new CrocImageSimple(root, hover);
	this.sliderHover.setScaling('none');
	this.sliderFocus = new CrocImageSimple(root, focus);
	this.sliderFocus.setScaling('none');
	
	this.addEventListener('pointermove', function(e){
		
		if(!this.hasFocus()) {
			this.setMode('hover');
			this.getRoot().setCursor("pointer");
		}
		
		else {
			this.localPointToValue(e.local.x, e.local.y);
			this.getRoot().setCursor("pointer");
			this.event('valuechanged', this.getValue());
		}
		
		return false;
	});
	
	this.addEventListener('pointerleave', function(e) {
		
		if(!this.hasFocus()) {
			this.setMode('normal');
		}
		
		this.getRoot().setCursor("");
		
		return false;
	});
	
	this.addEventListener('pointerdown', function(e) {
		this.focus();
		
		this.localPointToValue(e.local.x, e.local.y);
		
		this.event('valuechanged', this.getValue());
		
		this.setMode('focus');
	});
	
	this.addEventListener('pointerup', function(e) {
		this.blur();
		this.setMode('hover');
	});
	
	this.addEventListener('pointerout', function(e) {
		this.blur();
		this.setMode('normal');
		this.getRoot().setCursor("");
	});
};

//We inherit everything from CrocBase
CrocSlider.prototype = Object.create(CrocBase.prototype);
CrocSlider.prototype.constructor = CrocSlider;

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

CrocSlider.prototype.setOrientation = function(orientation) {
	
	if(orientation.toLowerCase() === "verticle") {
		this.orientation = orientation;
	}
	
	else {
		this.orientation = "horizontal";
	}
	
	this.getRoot().repaint();
};

CrocSlider.prototype.localPointToValue = function(x, y) {
	var c = {x:x, y:y}
	
	if(this.orientation === 'verticle') {
		var value = (((c.y - (this.slider.getHeight() / 2)) * (this.maxValue - this.minValue))/(this.getHeight() - this.slider.getHeight())) + this.minValue;
		
		this.setValue(value);
		
	}
	
	else {
		var value = (((c.x - (this.slider.getWidth() / 2)) * (this.maxValue - this.minValue))/(this.getWidth() - this.slider.getWidth())) + this.minValue;
		
		this.setValue(value);
	}
};

CrocSlider.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
    
    if(!this.visible) {
        return;
    }
    
	context.save();
	
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
		context.save();
		context.translate((currentSlider.getWidth() / 2) - ((tlw + brw) / 2), currentSlider.getHeight() / 2);
		currentGroove.paint(context, tlw + brw, this.getHeight() - currentSlider.getHeight());
		context.restore();
		
		var y = (((this.getHeight() - currentSlider.getHeight()) * (this.value - this.minValue)) / (this.maxValue - this.minValue));
		
		context.translate(0, y);
		currentSlider.paint(context);
	}
	
	else {
		context.save();
		context.translate(currentSlider.getWidth() / 2, (currentSlider.getHeight() / 2) - ((tlh + brh) / 2));
		currentGroove.paint(context, this.getWidth() - currentSlider.getWidth(), tlh + brh);
		context.restore();
		
		var x = (((this.getWidth() - currentSlider.getWidth()) * (this.value - this.minValue)) /  (this.maxValue - this.minValue));
		
		context.translate(x, 0);
		currentSlider.paint(context);
	}
	
	context.restore();
	
	return;
}
