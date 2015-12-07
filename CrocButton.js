
function CrocButton(root, normal, hover, pressed) {
	CrocBase.call(this, root);
	
	if(typeof normal === "string") {
		this.normal = new CrocImageSimple(root, normal);
	}
	
	else {
		this.normal = normal;
	}
	
	if(typeof hover === "string") {
		this.hover = new CrocImageSimple(root, hover);
	}
	
	else {
		this.hover = hover;
	}
	
	if(typeof pressed === "string") {
		this.pressed = new CrocImageSimple(root, pressed);
	}
	
	else {
		this.pressed = pressed;
	}
	
	this.addChild(this.normal);
	this.addChild(this.hover);
	this.addChild(this.pressed);
	
	this.scaling = 'none';
	this.currentState = 'normal';

	this.addEventListener('mousemove', function(e){
		this.setState('hover');
		return false;
	});
	
	this.addEventListener('mouseleave', function(e) {
		this.setState('normal');
		return false;
	});
	
	this.addEventListener('mousedown', function(e) {
		this.focus();
		this.setState('pressed');
	});
	
	this.addEventListener('mouseup', function(e) {
		this.focus();
		this.setState('normal');
	});
};

CrocButton.prototype = Object.create(CrocBase.prototype);

CrocButton.prototype.setState = function(state) {
	this.currentState = state;
	this.getRoot().repaint();
};

CrocButton.prototype.setScaling = function(scaling) {
	this.normal.setScaling(scaling);
	this.hover.setScaling(scaling);
	this.pressed.setScaling(scaling);
};

CrocButton.prototype.setTargetWidth = function(width) {
	this.normal.setTargetWidth(width);
	this.hover.setTargetWidth(width);
	this.pressed.setTargetWidth(width);
};

CrocButton.prototype.setTargetHeight = function(height) {
	this.normal.setTargetHeight(height);
	this.hover.setTargetHeight(height);
	this.pressed.setTargetHeight(height);
};

CrocButton.prototype.getWidth = function () {
	
	switch(this.currentState) {
	
		case 'normal':
			return this.normal.getWidth();
			break;
			
		case 'hover':
			return this.hover.getWidth();
			break;
			
		case 'pressed':
			return this.pressed.getWidth();
			break;
			
		default:
			return 0;
			break;
	}
};

CrocButton.prototype.getHeight = function() {
	
	switch(this.currentState) {
	
		case 'normal':
			return this.normal.getHeight();
			break;
			
		case 'hover':
			return this.hover.getHeight();
			break;
			
		case 'pressed':
			return this.pressed.getHeight();
			break;
			
		default:
			return 0;
			break;
	}
};

CrocButton.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	switch(this.currentState) {
	
		case 'normal':
			this.normal.paint(context, width, height);
			break;
			
		case 'hover':
			this.hover.paint(context, width, height);
			break;
			
		case 'pressed':
			this.pressed.paint(context, width, height);
			break;
			
		default:
			return;
			break;
	}
	
};