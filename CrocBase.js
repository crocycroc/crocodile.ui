
function guid() {
	function _p8(s) {
		var p = (Math.random().toString(16)+"000000000").substr(2,8);
		return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
	}
	return _p8() + _p8(true) + _p8(true) + _p8();
}

function CrocBase(root){
	
	if(root !== this) {
		if(typeof root !== 'object' || root.getRoot() !== root) {
			console.log('CrocBase: Was passed a root that may not in fact be a root!');
			console.trace();
		}
	}
	
	this.uuid = guid();
	this.parent = null;
	this.children = [];
	this.lastTransform = [1, 0, 0, 1, 0, 0];
	this.width = 0;
	this.height = 0;
	this.visible = true;
	this.enabled = true;
	this.targetWidth = null;
	this.targetHeight = null;
	this.scaling = 'none';
	
	this.root = root;
	
	this.listeners = {};
}

CrocBase.prototype.event = function(eventType, eventData) {
	
	var retValue = true;
	
	if(eventType in this.listeners) {
		for(var i = 0; i < this.listeners[eventType].length; i++) {
			if(!this.listeners[eventType][i].call(this, eventData)) {
				retValue = false;
			}
		}
	}
	
	return retValue;
};

CrocBase.prototype.addEventListener = function(event, callback) {
	if(!(event in this.listeners)) {
		this.listeners[event] = [];
	}
	
	if(callback in this.listeners[event]) {
		return;
	}
	
	this.listeners[event].push(callback);
};

CrocBase.prototype.removeEventListener = function(event, callback) {
	if(!(event in this.listeners)) {
		return false;
	}
	
	var index = this.listeners[event].indexOf(callback);
	
	if(index > -1) {
		this.listeners.splice(index, 1);
	}
};

CrocBase.prototype.addChild = function(uiObject) {
	
	if(typeof uiObject !== "object") {
		console.log("CrocBase.prototype.addChild: Not a UIObject!");
		return false;
	}
	
	if(uiObject.setParent(this) === false) {
		console.log("CrocBase.prototype.addChild: Unable to set UIObject's parent to this!");
		return false;
	}
	
	this.children.push(uiObject);
	
	return true;
};

CrocBase.prototype.addChildren = function(uiObjectList) {
	for(var i = 0; i < uiObjectList.length; i++) {
		this.addChild(uiObjectList[i]);
	}

	this.getRoot().repaint();
	
	return;
};

CrocBase.prototype.removeChild = function(uiObject) {
	
	if(!(uiObject in this.children)) {
		console.log("CrocBase.prototype.removeChild: Has no UIObject!");
		return false;
	}
	
	this.children.splice(this.children.index(uiObject));
	
	this.getRoot().repaint();
	
	return true;
};

CrocBase.prototype.removeAllChildren = function() {
	this.children = [];
};

CrocBase.prototype.hasAncestor = function(uiObject) {
	
	if(this.parent === null) {
		return false;
	}
	
	else if(this.parent === uiObject) {
		return true;
	}
	
	else {
		return this.parent.hasAncestor(uiObject);
	}
	
};

CrocBase.prototype.getRoot = function() {
	return this.root;
};

CrocBase.prototype.setParent = function(parent) {
	
	if(parent.hasAncestor(this)) {
		console.log("CrocBase.prototype.setParent: Attempting to set parent would cause infinite child loop!");
		return false;
	}
	
	this.parent = parent;

	return true;
};

CrocBase.prototype.setChildren = function(uiObjectList) {
	this.removeAllChildren();
	this.addChildren(uiObjectList);
};

CrocBase.prototype.setVisible = function(visible) {
	this.visible = visible;
	this.getRoot().repaint();
};

CrocBase.prototype.getVisible = function() {
	return this.visible;
};

CrocBase.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};

CrocBase.prototype.getParent = function() {
	return this.parent;
};

CrocBase.prototype.getChildren = function() {
	return this.children;
};

CrocBase.prototype.childToFront = function(uiObject) {
	if(this.children.indexOf(uiObject) < 0) {
		return false;
	}
	
	this.children.splice(this.children.indexOf(uiObject), 1);
	this.children.unshift(uiObject);
	
	this.getRoot().repaint();
	
	return true;
};

CrocBase.prototype.childToBack = function(uiObject) {
	if(this.children.indexOf(uiObject) < 0) {
		return false;
	}
	
	this.children.splice(this.children.indexOf(uiObject), 1);
	this.children.push(uiObject);
	
	this.getRoot().repaint();
	
	return true;
};

CrocBase.prototype.getDescendants = function() {
	
	var retValue = [];
	
	retValue.push(this);
	retValue.push([]);
	
	for(var i = 0; i < this.children.length; i++) {
		retValue[1].push(this.children[i].getDescendants());
	}
	
	return retValue;
};

//Hit test is handled almost exactly like a paint except you use the context to create a bounding box test and then draw.
CrocBase.prototype.hitTest = function(context, x, y, width, height) {

	context.beginPath();
	context.fillStyle = 'red';
	context.moveTo(0,0);
	context.lineTo(this.getWidth(),0);
	context.lineTo(this.getWidth(),this.getHeight());
	context.lineTo(0,this.getHeight());
	context.closePath();
	context.restore();
	
	if(context.isPointInPath(x, y)) {
		return this;
	}
	
	return null;
};

CrocBase.prototype.getWidth = function () {
	return this.width;
};

CrocBase.prototype.getHeight = function() {
	return this.height;
};

CrocBase.prototype.setTargetWidth = function(width) {
	this.targetWidth = width;
	
	this.getRoot().repaint();
};

CrocBase.prototype.setTargetHeight = function(height) {
	this.targetHeight = height;
	
	this.getRoot().repaint();
};

CrocBase.prototype.getTargetWidth = function() {
	return this.targetWidth;
};

CrocBase.prototype.getTargetHeight = function() {
	return this.targetHeight;
};

//This claims the focus from root
CrocBase.prototype.focus = function() {
	this.getRoot().setFocusedObject(this);
	return;
};

//Without any sort of layout options or anything really the CrocBase does not paint it's children.
CrocBase.prototype.paint = function(context, width, height) {
	this.lastTransform = context.getCurrentTransform();
	
	this.width = this.convertToPixels(this.targetWidth, width);
	this.height = this.convertToPixels(this.targetHeight, height);
	
	if(this.getVisible()) {
		this.getRoot().testPaintWarnings(this, this.lastTransform);
	}
	
	return;
};

CrocBase.prototype.inverseTransform = function(t) {
	var a = t[0];
	var b = t[1];
	var c = 0;
	var d = t[2];
	var e = t[3];
	var f = 0;
	var g = t[4];
	var h = t[5];
	var i = 1;
	
	var A = e * i - f * h;
	var B = f * g - d * i;
	var C = d * h - e * g;
	var determinant = a * A + b * B + c * C;
	var oneOverDeterminant;

	if(determinant === 0) {
		return false; // singular; inverse does not exist
	}
	else {
		oneOverDeterminant = 1 / determinant;

		return [
			A * oneOverDeterminant,
			(c * h - b * i) * oneOverDeterminant,
			B * oneOverDeterminant,
			(a * i - c * g) * oneOverDeterminant,
			C * oneOverDeterminant,
			(b * g - a * h) * oneOverDeterminant,
		];
	}

};

CrocBase.prototype.transformClipSpace = function(transform, width, height) {
	
// 	console.log(transform);
	
	var iMat = this.inverseTransform(transform);
	
// 	console.log(iMat);
	
	var vA = this.transformPoint(iMat, 0, 0);
	var vB = this.transformPoint(iMat, width, 0);
	var vC = this.transformPoint(iMat, width, height);
	var vD = this.transformPoint(iMat, 0, height);
	
	var width = Math.max(	((vA.x > 0 && vA.y > 0) ? vA.x : 0), 
				((vB.x > 0 && vB.y > 0) ? vB.x : 0),  
		       		((vC.x > 0 && vC.y > 0) ? vC.x : 0), 
		       		((vD.x > 0 && vD.y > 0) ? vD.x : 0));
	
	var height = Math.max(	((vA.x > 0 && vA.y > 0) ? vA.y : 0), 
				((vB.x > 0 && vB.y > 0) ? vB.y : 0),  
		       		((vC.x > 0 && vC.y > 0) ? vC.y : 0), 
		       		((vD.x > 0 && vD.y > 0) ? vD.y : 0));
	
	return {width:width, height:height};
};

CrocBase.prototype.transformPoint = function(t, x, y) {
	
	var xP = t[0] * x + t[2] * y + t[4];
	var yP = t[1] * x + t[3] * y + t[5];
	
	return {x:xP, y:yP};
};

CrocBase.prototype.convertToPixels = function(value, reference) {
	
	if(typeof value === 'string') {
		//It's a pixel
		if(value.indexOf('px', value.length - 2) !== -1) {
			return retValue = parseInt(value.substring(0, value.length - 2))
			
		}
		
		else if(value.indexOf('%', value.length - 1) !== -1) {
			var percent = parseFloat(value.substring(0, value.length - 1))
			return Math.round(reference * (percent/100.0));
		}
	}
	
	else if(typeof value === 'number') {
		return value;
	}
	
	else if(value === null || value === undefined) {
		return reference;
	}
	
	return reference;
};

