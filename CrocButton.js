
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
	this.mode = 'normal';

	this.addEventListener('blur', function(e) {
		this.setMode('normal');
		this.getRoot().setCursor();
		return false;
	});
	
	this.addEventListener('pointermove', function(e){
		
		if(!this.hasFocus()) {
			this.setMode('hover');
			this.getRoot().setCursor('pointer');
		}
		
		return false;
	});
	
	this.addEventListener('pointerleave', function(e) {
		
		if(!this.hasFocus()) {
			this.setMode('normal');
			this.getRoot().setCursor();
		}
		
		return false;
	});
	
	this.addEventListener('pointerdown', function(e) {
		this.focus();
		this.setMode('pressed');
	});
	
	this.addEventListener('pointerup', function(e) {
		this.blur();
		this.setMode('hover');
	});
};

CrocButton.prototype = Object.create(CrocBase.prototype);
CrocButton.prototype.constructor = CrocButton;

CrocButton.prototype.setMode = function(state) {
	
	if(this.mode !== state) {
		this.mode = state;
		this.getRoot().repaint();
	}
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
	
	switch(this.mode) {
	
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
			return this.normal.getWidth();
			break;
	}
};

CrocButton.prototype.getHeight = function() {
	
	switch(this.mode) {
	
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
			return this.normal.getHeight();
			break;
	}
};

CrocButton.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	switch(this.mode) {
	
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
			this.normal.paint(context, width, height);
			break;
	}
	
	context.restore();
};