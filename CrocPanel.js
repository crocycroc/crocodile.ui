
function CrocPanel(root) {
	CrocBase.call(this, root);
	
	this.childrenOrientations = {};
};

CrocPanel.prototype = Object.create(CrocBase.prototype);
CrocPanel.prototype.constructor = CrocPanel;

CrocPanel.prototype.addChild = function(uiObject, x, y, rotation, width, height) {
	if(CrocBase.prototype.addChild.call(this, uiObject) === false) {
		return false;
	}
	
	x = x || 0;
	y = y || 0;
	width = width || 1;
	height = height || 1;
	rotation = rotation || 0;
	
	this.childrenOrientations[uiObject.uuid] = {x:x, y:y, width:width, height:height, rotation:rotation};
	
	this.getRoot().repaint();
	
	return true;
};

CrocPanel.prototype.removeChild = function(uiObject) {
	if(CrocBase.prototype.removeChild.call(this, uiObject) === false) {
		return false;
	}
	
	delete this.childrenOrientations[uiObject.uuid];

	this.getRoot().repaint();
	
	return true;
	
};

CrocPanel.prototype.removeAllChildren = function() {
	CrocBase.prototype.removeAllChildren.call(this);
	this.childrenOrientations = {};
	
	this.getRoot().repaint();
};

CrocPanel.prototype.setChildOrientation = function(uiObject, x, y, rotation, width, height) {
	
	if(!(uiObject.uuid in this.childrenOrientations)) {
		return false;
	}
	
	x === undefined ? x = this.childrenOrientations[uiObject.uuid].x : x;
	y === undefined ? y = this.childrenOrientations[uiObject.uuid].y : y;
	width === undefined ? width = this.childrenOrientations[uiObject.uuid].width : width;
	height === undefined ? height = this.childrenOrientations[uiObject.uuid].height : height;
	rotation === undefined ? rotation = this.childrenOrientations[uiObject.uuid].rotation : rotation;
	
	if(
		this.childrenOrientations[uiObject.uuid] === undefined || 
		this.childrenOrientations[uiObject.uuid].x !== x || 
		this.childrenOrientations[uiObject.uuid].y !== y ||
		this.childrenOrientations[uiObject.uuid].width !== width ||
		this.childrenOrientations[uiObject.uuid].height !== height ||
		this.childrenOrientations[uiObject.uuid].rotation !== rotation) {
		
		this.childrenOrientations[uiObject.uuid] = {x:x, y:y, width:width, height:height, rotation:rotation};
	
		this.getRoot().repaint();
	}
};

CrocPanel.prototype.getChildOrientation = function(uiObject) {
	if(!(uiObject.uuid in this.childrenOrientations)) {
		return null;
	}
	
	return this.childrenOrientations[uiObject.uuid];
};

CrocPanel.prototype.hitTest = function(context, x, y, width, height) {
	
	var hitReturn = [];
	
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	context.save();
	
	context.beginPath();
	context.lineTo(width, 0);
	context.lineTo(width, height);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	var i = this.children.length;
	while(i--) {
		
		context.save();
		var currentChild = this.children[i];
		var currentOrientation = this.childrenOrientations[currentChild.uuid];
		
		context.rotate(currentOrientation.rotation);
		context.scale(this.convertToPixels(currentOrientation.width, width), this.convertToPixels(currentOrientation.height, height));
		
		var newWidthHeight = this.transformPoint(context.getCurrentTransform(), this.getWidth(), this.getHeight());
		
		context.restore();
		
		context.save();
		
		context.translate(this.convertToPixels(currentOrientation.x, width), this.convertToPixels(currentOrientation.y, height));
		context.rotate(currentOrientation.rotation);
		context.scale(this.convertToPixels(currentOrientation.width, width), this.convertToPixels(currentOrientation.height, height));
		
		var newOriginPosition = this.transformPoint(context.getCurrentTransform(), 0, 0);
		
		hitObject = currentChild.hitTest(context, x, y, newWidthHeight.x - newOriginPosition.x, newWidthHeight.y - newOriginPosition.y);
		
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		context.restore();
	}
	
	context.restore();
	
	return hitReturn;
};

CrocPanel.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	context.beginPath();
	context.lineTo(width, 0);
	context.lineTo(width, height);
	context.lineTo(0, height);
	context.lineTo(0, 0);
	context.clip();
	
	var i = this.children.length;
	while(i--) {
		context.save();
		var currentChild = this.children[i];
		var currentOrientation = this.childrenOrientations[currentChild.uuid];
		
		context.rotate(currentOrientation.rotation);
		context.scale(currentOrientation.width, currentOrientation.height);
		
		var newWidthHeight = this.transformPoint(context.getCurrentTransform(), this.getWidth(), this.getHeight());
		
		context.restore();
		
		context.save();
		
		context.translate(this.convertToPixels(currentOrientation.x, this.getWidth()), this.convertToPixels(currentOrientation.y, this.getHeight()));
		context.rotate(currentOrientation.rotation);
		context.scale(currentOrientation.width, currentOrientation.height);

		var newOriginPosition = this.transformPoint(context.getCurrentTransform(), 0, 0);
		
		currentChild.paint(context, newWidthHeight.x - newOriginPosition.x, newWidthHeight.y - newOriginPosition.y);
		context.restore();
	}
	
	context.restore();
	
	return;
	
};
