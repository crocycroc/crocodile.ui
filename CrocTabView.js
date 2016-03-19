function CrocTabView(root,
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentPanelSplit = this;

	CrocBase.call(this, root);
	
	this.tr = tr || "theme/CrocTextfield/base-topright.png";
	this.t = t || "theme/CrocTextfield/base-top.png";
	this.tl = tl || "theme/CrocTextfield/base-topleft.png";
	this.l = l || "theme/CrocTextfield/base-left.png";
	this.r = r || "theme/CrocTextfield/base-right.png";
	this.bl = bl || "theme/CrocTextfield/base-bottomleft.png";
	this.b = b || "theme/CrocTextfield/base-bottom.png";
	this.br = br || "theme/CrocTextfield/base-bottomright.png";
	this.bkg = bkg || "theme/CrocTextfield/base-center.png";
	
	this.trH = trH || "theme/CrocTextfield/hover-topright.png";
	this.tH = tH || "theme/CrocTextfield/hover-top.png";
	this.tlH = tlH || "theme/CrocTextfield/hover-topleft.png";
	this.lH = lH || "theme/CrocTextfield/hover-left.png";
	this.rH = rH || "theme/CrocTextfield/hover-right.png";
	this.blH = blH || "theme/CrocTextfield/hover-bottomleft.png";
	this.bH = bH || "theme/CrocTextfield/hover-bottom.png";
	this.brH = brH || "theme/CrocTextfield/hover-bottomright.png";
	this.bkgH = bkgH || "theme/CrocTextfield/base-center.png";
	
	this.trF = trF || "theme/CrocTextfield/focus-topright.png";
	this.tF = tF || "theme/CrocTextfield/focus-top.png";
	this.tlF = tlF || "theme/CrocTextfield/focus-topleft.png";
	this.lF = lF || "theme/CrocTextfield/focus-left.png";
	this.rF = rF || "theme/CrocTextfield/focus-right.png";
	this.blF = blF || "theme/CrocTextfield/focus-bottomleft.png";
	this.bF = bF || "theme/CrocTextfield/focus-bottom.png";
	this.brF = brF || "theme/CrocTextfield/focus-bottomright.png";
	this.bkgF = bkgF || "theme/CrocTextfield/base-center.png";
	
	//The tab object is a mapping from child UUID to tab button.
	//The order the children are added is the order for their tab position.
	//So promoting a child to the top will make it the first tab,
	//and to the bottom will make it the last tab.
	this.tabs = {};
	
// 	this.tab = new CrocButtonLabel(root, "None",
// 	tl, l, r, bl, b, br, bkg,
// 	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
// 	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF);

	this.tabSize = "24px";
	this.tabLength = "40px";
	this.tabSpacing = "10px";
	this.currentTab = null;
	
	//Tabs can be on the top, bottom, left, or right.
	this.tabPosition = 'top';
};

CrocTabView.prototype = Object.create(CrocBase.prototype);
CrocTabView.prototype.constructor = CrocTabView;

CrocTabView.prototype._tabMouseMove = function(tab) {
	
	this.getRoot().setCursor("pointer");
	
	if(this.tabs[this.currentTab] === tab) {
		return;
	}
	
	tab.setState('hover');
};

CrocTabView.prototype._tabMouseLeave = function(tab) {
	this.getRoot().setCursor();
	
	if(this.tabs[this.currentTab] === tab) {
		return;
	}
	
	tab.setState('normal');
};

CrocTabView.prototype._tabMouseDown = function(tab) {
	this.setCurrentTabByUuid(tab.uuid);
};

CrocTabView.prototype._tabMouseUp = function(tab) {
};

CrocTabView.prototype.setTabPosition = function(position) {
	this.tabPosition = position || 'top';
	
	this.getRoot().repaint();
};

CrocTabView.prototype.setTabSize = function(size) {
	this.tabSize = size || "42px";
	
	this.getRoot().repaint();
};

CrocTabView.prototype.setCurrentTabByUuid = function(uuid) {
	
	if(this.tabs[uuid] === undefined) {
		return;
	}
	
	if(this.curretTab !== null && this.tabs[this.currentTab] !== undefined) {
		this.tabs[this.currentTab].setState('normal');
	}
	
	this.currentTab = uuid;
	
	this.tabs[this.currentTab].setState('pressed');
	
	this.getRoot().repaint();
};

CrocTabView.prototype.setCurrentTab = function(number) {
	if(!(number < this.children.length) || number < 0) {
		return;
	}
	
	this.setCurrentTabByUuid(this.children[number].uuid);
};

CrocTabView.prototype.addChild = function(uiObject, label) {
	if(CrocBase.prototype.addChild.call(this, uiObject) === false) {
		return false;
	}
	
	this.tabs[uiObject.uuid] = label.toString();
	
	var currentTabView = this;
	
	this.tabs[uiObject.uuid] = new CrocButtonLabeled(this.getRoot(), label.toString(),
					this.tr, this.t, this.tl, this.l, this.r, this.bl, this.b, this.br, this.bkg,
					this.trH, this.tH, this.tlH, this.lH, this.rH, this.blH, this.bH, this.brH, this.bkgH,
					this.trF, this.tF, this.tlF, this.lF, this.rF, this.blF, this.bF, this.brF, this.bkgF);
	
	
	
	this.tabs[uiObject.uuid].removeAllEventListeners();
	
	this.tabs[uiObject.uuid].addEventListener('mousemove', function(e){
		currentTabView._tabMouseMove(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('mouseleave', function(e) {
		currentTabView._tabMouseLeave(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('mousedown', function(e) {
		currentTabView._tabMouseDown(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('mouseup', function(e) {
		currentTabView._tabMouseUp(this);
		return false;
	});
	
	if(this.currentTab === null) {
		this.setCurrentTabByUuid(uiObject.uuid);
	}
	
	this.getRoot().repaint();
	
	return true;
};

CrocTabView.prototype.removeChild = function(uiObject) {
	if(CrocBase.prototype.removeChild.call(this, uiObject) === false) {
		return false;
	}

	delete(this.tabs[uiObject.uuid]);
	
	this.getRoot().repaint();
	
	return true;
	
};

CrocTabView.prototype.removeAllChildren = function() {
	CrocBase.prototype.removeAllChildren.call(this);
	
	this.getRoot().repaint();
};

CrocTabView.prototype.hitTest = function(context, x, y, width, height) {
	context.save();
	
	var hitReturn = [];
	var hitObject = CrocBase.prototype.hitTest.call(this, context, x, y, width, height);
	
	if(hitObject !== null) {
		hitReturn.push(hitObject);
	}
	
	
	context.restore();
	
	return hitReturn;
};

CrocTabView.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}
	
	var tabsWidth = 0;
	var tabSpacing = 0;
	var childWidth = 0;
	var childHeight = 0;
	var realTabSize = 0;
	
	//First we are going to paint the tabs.
	//Based on their position we may be painting them in certain locations.
	//Once the tabs are painted, we will paint the current tabs child.
	
	//First transform the context into the proper position based on tab location
	
	context.save();
	
	switch(this.tabPosition) {
		case "top":
			realTabSize = this.convertToPixels(this.tabSize, this.height);
			childWidth = this.width;
			childHeight = this.height - realTabSize;
			tabsWidth = this.convertToPixels(this.tabLength, this.width);
			tabSpacing = this.convertToPixels(this.tabSpacing, this.width);
			break;
			
		case "bottom":
			realTabSize = this.convertToPixels(this.tabSize, this.height);
			childWidth = this.width;
			childHeight = this.height - realTabSize;
			context.translate(0, childHeight);
			tabsWidth = this.convertToPixels(this.tabLength, this.width);
			tabSpacing = this.convertToPixels(this.tabSpacing, this.width);
			break;
			
		case "left":
			realTabSize = this.convertToPixels(this.tabSize, this.width);
			childWidth = this.width - realTabSize;
			childHeight = this.height;
			tabsWidth = this.convertToPixels(this.tabLength, this.height);
			tabSpacing = this.convertToPixels(this.tabSpacing, this.height);
			break;
			
		case "right":
			realTabSize = this.convertToPixels(this.tabSize, this.width);
			childWidth = this.width - realTabSize;
			childHeight = this.height;
			tabsWidth = this.convertToPixels(this.tabLength, this.height);
			tabSpacing = this.convertToPixels(this.tabSpacing, this.height);
			break;
	}
	
	//Paint the tabs with the labels from "tabs"
	
	for(var k in this.tabs) {
		this.tabs[k].paint(context, tabsWidth, realTabSize);
		
		context.translate(tabsWidth + tabSpacing, 0);
	}
	
	context.restore();
	context.save();
	
	//Now translate based on where we have painted and draw the current tab child.
	switch(this.tabPosition) {
		case "top":
			context.translate(0, realTabSize);
			break;
			
		case "bottom":
			break;
			
		case "left":
			context.translate(realTabSize, 0);
			break;
			
		case "right":
			break;
	}
	
	for(var i = 0; i < this.children.length; i++) {
		if(this.children[i].uuid === this.currentTab) {
			this.children[i].paint(context, childWidth, childHeight);
			break;
		}
	}
	
	context.restore();
};