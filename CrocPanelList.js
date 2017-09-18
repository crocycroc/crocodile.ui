function CrocPanelList(root, spacing, orientation) {
	CrocBase.call(this, root);
	
	spacing = spacing || root.themer.getValue(arguments.callee, "spacing");
	orientation = orientation || root.themer.getValue(arguments.callee, "orientation");
	this.spacing = spacing;
	this.orientation = orientation;
};

CrocPanelList.prototype = Object.create(CrocBase.prototype);
CrocPanelList.prototype.constructor = CrocPanelList;

CrocPanelList.prototype.setSpacing = function(spacing) {
	if(spacing === undefined) {
		spacing = '10px';
	}
	
	this.spacing = spacing;
	
	this.getRoot().repaint();
};

CrocPanelList.prototype.setOrientation = function(orientation) {
	this.orientation = orientation || 'verticle';
	
	this.getRoot().repaint();
};

CrocPanelList.prototype.addChild = function(uiObject) {
	if(CrocBase.prototype.addChild.call(this, uiObject) === false) {
		return false;
	}
	
	this.getRoot().repaint();
	
	return true;
};

CrocPanelList.prototype.removeChild = function(uiObject) {
	if(CrocBase.prototype.removeChild.call(this, uiObject) === false) {
		return false;
	}

	this.getRoot().repaint();
	
	return true;
	
};

CrocPanelList.prototype.removeAllChildren = function() {
	CrocBase.prototype.removeAllChildren.call(this);
	
	this.getRoot().repaint();
};

CrocPanelList.prototype.hitTest = function(context, x, y, width, height) {
	var hitReturn = [];
	
	var parentTransform = context.getCurrentTransform();
	
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	context.save();
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	if(this.orientation === 'verticle') {
		var realSpacing = this.convertToPixels(this.spacing, this.height);
		
		var childrenHeight = (this.height - ((this.children.length - 1) * realSpacing)) / this.children.length;
		
		for(var i = 0; i <  this.children.length; i++) {
			var currentChild = this.children[i];
			
			hitObject = currentChild.hitTest(context, x, y, this.width, childrenHeight);
		
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		
			context.translate(0, childrenHeight + realSpacing);
			
		}
		
	}
	
	else {
		var realSpacing = this.convertToPixels(this.spacing, this.width);
		
		var childrenWidth = (this.width - ((this.children.length - 1) * realSpacing)) / this.children.length;
		
		for(var i = 0; i <  this.children.length; i++) {
			var currentChild = this.children[i];
			
			hitObject = currentChild.hitTest(context, x, y, childrenWidth, this.height);
		
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
			
			context.translate(childrenWidth + realSpacing, 0);
		}
		
	}
	
	context.restore();
	
	return hitReturn;
};

CrocPanelList.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	context.save();
	
	if(!this.visible) {
		return;
	}
	
	if(this.orientation === 'verticle') {
		var realSpacing = this.convertToPixels(this.spacing, this.height);
		
		var childrenHeight = (this.height - ((this.children.length - 1) * realSpacing)) / this.children.length;
		
		for(var i = 0; i <  this.children.length; i++) {
			var currentChild = this.children[i];
			
			currentChild.paint(context, this.width, childrenHeight);
		
			context.translate(0, childrenHeight + realSpacing);
			
		}
	}
	
	else {
		var realSpacing = this.convertToPixels(this.spacing, this.width);
		
		var childrenWidth = (this.width - ((this.children.length - 1) * realSpacing)) / this.children.length;
		
		for(var i = 0; i <  this.children.length; i++) {
			var currentChild = this.children[i];
			
			currentChild.paint(context, childrenWidth, this.height);
		
			context.translate(childrenWidth + realSpacing, 0);
		}
	}
	
	context.restore();
};
