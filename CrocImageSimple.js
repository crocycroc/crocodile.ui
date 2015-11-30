
function CrocImageSimple(root, imgSrc) {
	
	var currentCrocImageSimple = this;
	
	CrocBase.call(this, root);
	
	this.getRoot().loadImage(imgSrc, function() {
		currentCrocImageSimple.currentImage = currentCrocImageSimple.getRoot().getImage(currentCrocImageSimple.imgSrc);
		currentCrocImageSimple.getRoot().repaint();
	});
	
	this.imgSrc = imgSrc;
	this.currentImage = null;
	
	this.hitTestType = 'bounding';
	this.scaling = 'none';
};

CrocImageSimple.prototype = Object.create(CrocBase.prototype);

CrocImageSimple.prototype.setScaling = function(scaling) {
	
	this.scaling = scaling || 'none';
	
	return;
};

CrocImageSimple.prototype.getWidth = function () {
	
	if(this.currentImage === null) {
		return 0;
	}
	
	if(this.scaling !== 'none') {
		return this.currentWidth;
	}
	
	return this.currentImage.width;
};

CrocImageSimple.prototype.getHeight = function() {
	
	if(this.currentImage === null) {
		return 0;
	}
	
	if(this.scaling !== 'none') {
		return this.currentHeight;
	}
	
	return this.currentImage.height;
};

CrocImageSimple.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var parentTransform = context.getCurrentTransform();
	
	if(!this.visible) {
		return;
	}
	
	var currentImage = null;
	
	currentImage = this.getRoot().getImage(this.imgSrc);
	
	if(currentImage === null) {
		return;
	}
	
	if(this.scaling === 'stretch') {
		var w = width/this.currentImage.width;
		var h = height/this.currentImage.height;
		
		this.currentWidth = width;
		this.currentHeight = height;
		
		context.scale(w, h);
	}
	
	else if(this.scaling === 'target') {
		this.currentWidth = this.convertToPixels(this.targetWidth, width);
		this.currentHeight = this.convertToPixels(this.targetHeight, height);

		var w = 0;
		var h = 0;
		
		if(this.currentWidth !== 0) {
			w = this.currentWidth/this.currentImage.width;
		}
		
		if(this.currentHeight !== 0) {
			h = this.currentHeight/this.currentImage.height;
		}
		
		context.scale(w, h);
	}
	
	else {
		this.currentWidth = this.currentImage.width;
		this.currentHeight = this.currentImage.height;
	}
	
	context.drawImage(currentImage, 0, 0);
	
	context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	return;
	
};