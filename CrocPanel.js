
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
	
	//When we initialize the context there needs to be a currenTransform value.
	//This is now standard but some browsers, like firefox call it mozCurrentTransform.
	//So we map with context.getCurrentTransform() function;
	
	//Push Matrix
	var parentTransform = context.getCurrentTransform();
	
	for(var key in this.children) {
		
		var currentChild = this.children[key];
		var currentOrientation = this.childrenOrientations[currentChild.uuid];
		
		context.translate(currentOrientation.x, currentOrientation.y);
		context.rotate(currentOrientation.rotation);
		context.scale(currentOrientation.width, currentOrientation.height);
		var childClip = this.transformClipSpace(context.getCurrentTransform(), width, height);
		
		hitObject = currentChild.hitTest(context, x, y, childClip.width, childClip.height);
		
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
		//We reset the transformation for the next pass back to the parents.
		//Pop Matrix
		context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	}
	
	return hitReturn;
};

CrocPanel.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	var parentTransform = context.getCurrentTransform();

	var i = this.children.length;
	while(i--) {
		var currentChild = this.children[i];
		var currentOrientation = this.childrenOrientations[currentChild.uuid];
		
		context.translate(this.convertToPixels(currentOrientation.x, this.getWidth()), this.convertToPixels(currentOrientation.y, this.getHeight()));
		context.rotate(currentOrientation.rotation);
		context.scale(currentOrientation.width, currentOrientation.height);

		currentChild.paint(context, width, height);
		context.setTransform(parentTransform[0], parentTransform[1], parentTransform[2], parentTransform[3], parentTransform[4], parentTransform[5]);
	}
	
	context.restore();
	
	return;
	
};