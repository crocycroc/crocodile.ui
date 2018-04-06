function CrocToggle(root, off, on) {
	CrocBase.call(this, root);

	off = off || root.themer.getValue(arguments.callee, "off");
	
	on = on || root.themer.getValue(arguments.callee, "on");
	
	this.value = false;
	
	this.offImage = new CrocImageSimple(root, off);
	this.onImage = new CrocImageSimple(root, on);
	
	this.addEventListener('pointermove', function(e){
		this.getRoot().setCursor("pointer");
		
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
		
		this.setValue(!this.getValue());
		
		this.event('valuechanged', this.getValue());
		
		this.setMode('focus');
	});
	
	this.addEventListener('pointerup', function(e) {
		this.blur();
		this.setMode('hover');
	});
	
};

//We inherit everything from CrocBase
CrocToggle.prototype = Object.create(CrocBase.prototype);
CrocToggle.prototype.constructor = CrocToggle;

CrocToggle.prototype.getValue = function() {
	return this.value;
};

CrocToggle.prototype.setMode = function(mode) {
};

CrocToggle.prototype.setValue = function(value) {
	this.value = (value == true);
	this.getRoot().repaint();
};

CrocToggle.prototype.getWidth = function () {
	
	if(this.value) {
		return this.onImage.getWidth();
	}
	
	return this.offImage.getWidth();
};

CrocToggle.prototype.getHeight = function() {
	
	if(this.value) {
		return this.onImage.getHeight();
	}
	
	return this.offImage.getHeight();
};

CrocToggle.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	if(this.getValue()) {
		this.onImage.paint(context, width, height);
	}

	else {
		this.offImage.paint(context, width, height);
	}
	
	context.restore();
	
	return;
}
