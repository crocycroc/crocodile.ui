function CrocTabView(root,
	tr, t, tl, l, r, bl, b, br, bkg,
	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF) {
	
	var currentPanelSplit = this;

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
	
	trH = trH || root.themer.getValue(arguments.callee, "trH");
	tH = tH || root.themer.getValue(arguments.callee, "tH");
	tlH = tlH || root.themer.getValue(arguments.callee, "tlH");
	lH = lH || root.themer.getValue(arguments.callee, "lH");
	rH = rH || root.themer.getValue(arguments.callee, "rH");
	blH = blH || root.themer.getValue(arguments.callee, "blH");
	bH = bH || root.themer.getValue(arguments.callee, "bH");
	brH = brH || root.themer.getValue(arguments.callee, "brH");
	bkgH = bkgH || root.themer.getValue(arguments.callee, "bkgH");
	
	trF = trF || root.themer.getValue(arguments.callee, "trF");
	tF = tF || root.themer.getValue(arguments.callee, "tF");
	tlF = tlF || root.themer.getValue(arguments.callee, "tlF");
	lF = lF || root.themer.getValue(arguments.callee, "lF");
	rF = rF || root.themer.getValue(arguments.callee, "rF");
	blF = blF || root.themer.getValue(arguments.callee, "blF");
	bF = bF || root.themer.getValue(arguments.callee, "bF");
	brF = brF || root.themer.getValue(arguments.callee, "brF");
	bkgF = bkgF || root.themer.getValue(arguments.callee, "bkgF");
	
	//The tab object is a mapping from child UUID to tab button.
	//The order the children are added is the order for their tab position.
	//So promoting a child to the top will make it the first tab,
	//and to the bottom will make it the last tab.
	this.tabs = {};
	
// 	this.tab = new CrocButtonLabel(root, "None",
// 	tl, l, r, bl, b, br, bkg,
// 	trH, tH, tlH, lH, rH, blH, bH, brH, bkgH,
// 	trF, tF, tlF, lF, rF, blF, bF, brF, bkgF);

	this.tabSize = "42px";
	this.tabLength = "80px";
	this.tabSpacing = "2px";
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
	
	tab.setMode('hover');
};

CrocTabView.prototype._tabMouseLeave = function(tab) {
	this.getRoot().setCursor();
	
	if(this.tabs[this.currentTab] === tab) {
		return;
	}
	
	tab.setMode('normal');
};

CrocTabView.prototype._tabMouseDown = function(tab) {
	
	for(var k in this.tabs) {
		if(this.tabs[k] === tab) {
			this.setCurrentTabByUuid(k);
			return;
		}
	}
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
		this.tabs[this.currentTab].setMode('normal');
	}
	
	this.currentTab = uuid;
	
	this.tabs[this.currentTab].setMode('pressed');
	
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
	
	this.tabs[uiObject.uuid].addEventListener('pointermove', function(e){
		currentTabView._tabMouseMove(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('pointerleave', function(e) {
		currentTabView._tabMouseLeave(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('pointerdown', function(e) {
		currentTabView._tabMouseDown(this);
		return false;
	});
	
	this.tabs[uiObject.uuid].addEventListener('pointerup', function(e) {
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
	
	var tabsWidth = 0;
	var tabSpacing = 0;
	var childWidth = 0;
	var childHeight = 0;
	var realTabSize = 0;
	
	switch(this.tabPosition) {
		case "top":
			realTabSize = this.convertToPixels(this.tabSize, this.getHeight());
			childWidth = this.getWidth();
			childHeight = this.getHeight() - realTabSize;
			tabsWidth = this.convertToPixels(this.tabLength, this.getWidth());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getWidth());
			break;
			
		case "bottom":
			realTabSize = this.convertToPixels(this.tabSize, this.getHeight());
			childWidth = this.getWidth();
			childHeight = this.getHeight() - realTabSize;
			tabsWidth = this.convertToPixels(this.tabLength, this.getWidth());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getWidth());
			context.translate(0, childHeight);
			break;
			
		case "left":
			realTabSize = this.convertToPixels(this.tabSize, this.getWidth());
			childWidth = this.getWidth() - realTabSize;
			childHeight = this.getHeight();
			tabsWidth = this.convertToPixels(this.tabLength, this.getHeight());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getHeight());
			context.rotate(-Math.PI/2);
			context.translate(-this.getHeight(), 0);
			break;
			
		case "right":
			realTabSize = this.convertToPixels(this.tabSize, this.getWidth());
			childWidth = this.getWidth() - realTabSize;
			childHeight = this.getHeight();
			tabsWidth = this.convertToPixels(this.tabLength, this.getHeight());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getHeight());
			context.rotate(Math.PI/2);
			context.translate(0, -childWidth - realTabSize);
			break;
	}
	
	//Paint the tabs with the labels from "tabs"
	
	for(var k in this.tabs) {
		hitObject = this.tabs[k].hitTest(context, x, y, tabsWidth, realTabSize);
	
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
		
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
			hitObject = this.children[i].hitTest(context, x, y, childWidth, childHeight);
			
			if(hitObject !== null) {
				hitReturn.push(hitObject);
			}
		
			break;
		}
	}
	
	context.restore();
	
	return hitReturn;
};

CrocTabView.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	if(!this.visible) {
		return;
	}

	context.save();
	
	var tabsWidth = 0;
	var tabSpacing = 0;
	var childWidth = 0;
	var childHeight = 0;
	var realTabSize = 0;
	
	switch(this.tabPosition) {
		case "top":
			realTabSize = this.convertToPixels(this.tabSize, this.getHeight());
			childWidth = this.getWidth();
			childHeight = this.getHeight() - realTabSize;
			tabsWidth = this.convertToPixels(this.tabLength, this.getWidth());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getWidth());
			break;
			
		case "bottom":
			realTabSize = this.convertToPixels(this.tabSize, this.getHeight());
			childWidth = this.getWidth();
			childHeight = this.getHeight() - realTabSize;
			tabsWidth = this.convertToPixels(this.tabLength, this.getWidth());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getWidth());
			context.translate(0, childHeight);
			break;
			
		case "left":
			realTabSize = this.convertToPixels(this.tabSize, this.getWidth());
			childWidth = this.getWidth() - realTabSize;
			childHeight = this.getHeight();
			tabsWidth = this.convertToPixels(this.tabLength, this.getHeight());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getHeight());
			context.rotate(-Math.PI/2);
			context.translate(-this.getHeight(), 0);
			break;
			
		case "right":
			realTabSize = this.convertToPixels(this.tabSize, this.getWidth());
			childWidth = this.getWidth() - realTabSize;
			childHeight = this.getHeight();
			tabsWidth = this.convertToPixels(this.tabLength, this.getHeight());
			tabSpacing = this.convertToPixels(this.tabSpacing, this.getHeight());
			context.rotate(Math.PI/2);
			context.translate(0, -childWidth - realTabSize);
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
