//All CrocRoot will do is reset the context and draw the children. Not even sure if it should reset the context.
//It also has image control so we don't load a million such images.

function CrocRoot(canvas, hitCanvas, fullscreen, eventHandlerConstructor) {
	CrocBase.call(this, this);
	
	eventHandlerConstructor = eventHandlerConstructor || CrocEventHandler;
	
	this.fullscreen = fullscreen || false;
	
	this.canvas = canvas;
	this.hitCanvas = hitCanvas;
	this.scaleFactorX = 1.0;
	this.scaleFactorY = 1.0;
	
	this.context = canvas.getContext("2d");
	this.hitContext = hitCanvas.getContext("2d");

	//Stupid failure to implement this
	if(this.context.mozCurrentTransform === undefined && this.context.currenTransform === undefined) {
		
		this.hitContext = new CanvasWrapper(this.hitContext);
		this.context = new CanvasWrapper(this.context);
		
		this.context.getCurrentTransform = function() {
			
			var matrix = this.getMatrix();
			
			return [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]];
		};
		
		this.context.getContext = function() {
			return this.canvas;
		}
		
		this.hitContext.getCurrentTransform = function() {
			
			var matrix = this.getMatrix();
			
			if(matrix === undefined) {
				console.trace();
			}
			
			return [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[2][0], matrix[2][1]];
		};
		
		this.hitContext.getContext = function() {
			return this.canvas;
		}
		
	}
	
	else {
		this.context.getCurrentTransform = function() {
			
			if(this.mozCurrentTransform !== undefined) {
				return this.mozCurrentTransform;
			}
			
			else  {
				return this.currenTransform;
			}
			
		}
		
		this.context.getContext = function() {
			return this;
		}
		
		this.hitContext.getCurrentTransform = function() {
			
			if(this.mozCurrentTransform !== undefined) {
				return this.mozCurrentTransform;
			}
			
			else  {
				return this.currenTransform;
			}
			
		}
		
		this.hitContext.getContext = function() {
			return this;
		}
	}
	
	
	if(this.context.measureText === undefined) {
		this.context.measureText = function(text) {
			return getTextWidthDOM(text, this.font);
		};
	}
	
	this.focusedObject = null;
	
	var currentCrocRoot = this;
	
	this.imageStore = {};
	this.imageStoreListeners = {};
	this.dirty = false;
	this.paintWarnings = [];
	this.globalPaintWarning = false;
	this.loaded = false;
	
	this.eventHandler = new eventHandlerConstructor(this);
	
	if(this.fullscreen) {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	
		this.hitCanvas.width = window.innerWidth;
		this.hitCanvas.height = window.innerHeight;
	}
	
	this.themer = new CrocThemer(this);
	
	this.themer.importTheme(crocThemeDefault, function(err) {
		currentCrocRoot.loaded = true;
		currentCrocRoot.event('loaded', {});
		currentCrocRoot.repaint();
	});
};

CrocRoot.prototype = Object.create(CrocBase.prototype);
CrocRoot.prototype.constructor = CrocRoot;

CrocRoot.prototype.onReady = function(callback) {
	
	var currentCrocRoot = this;
	
	if(this.loaded) {
		callback.call(this, false);
		return;
	}
	
	var waitingEventCallback = this.addEventListener('loaded', function(data) {
		currentCrocRoot.removeEventListener('loaded', waitingEventCallback);
		callback.call(currentCrocRoot, false);
	});
	
};

CrocRoot.prototype.getCrocRoot = function() {
	return this;
};

CrocRoot.prototype.onCanvasResize = function() {
	this.repaint();
};

CrocRoot.prototype.setWidth = function (width) {
	
	if(this.fullscreen) {
		return;
	}
	
	this.canvas.width = width;
	this.hitCanvas.width = width;
	
	this.repaint();
};

CrocRoot.prototype.setHeight = function(height) {
	
	if(this.fullscreen) {
		return;
	}
	
	this.canvas.height = height;
	this.hitCanvas.height = height;
	
	this.repaint();
};

CrocRoot.prototype.getWidth = function () {
	if(this.fullscreen) {
		return window.innerWidth;
	}
	
	return this.canvas.width;
};

CrocRoot.prototype.getHeight = function() {
	if(this.fullscreen) {
		return window.innerHeight;
	}
	
	return this.canvas.height;
};

CrocRoot.prototype.clear = function() {
	this.context.save();
	this.context.setTransform(1, 0, 0, 1, 0, 0)
	this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
	this.context.restore();
};

CrocRoot.prototype.clearHitContext = function() {
	this.hitContext.save();
	this.hitContext.setTransform(1, 0, 0, 1, 0, 0)
	this.hitContext.clearRect(0, 0, this.getWidth(), this.getHeight());
	this.hitContext.restore();
};

CrocRoot.prototype.setFocusedObject = function(object) {
	
	if(this.focusedObject !== undefined && this.focusedObject !== null) {
		
		this.focusedObject.event('blur', object);
	}
	
	this.focusedObject = object;
	
	this.event('objectfocusedset', object);
	
	return this.focusedObject;
};


CrocRoot.prototype.getFocusedObject = function() {
	return this.focusedObject;
};

//This function allows an object to request from Croc to fire an event if something is going to draw over it.
//The call back is executed and the object can request to stop all painting by returning false
//When a paint is canceled by an object a repaint should have been triggered by the object.
CrocRoot.prototype.addPaintWarning = function(object, transform, width, height) {
	
	var tl = this.transformPoint(transform, 0, 0);
	var tr = this.transformPoint(transform, width, 0);
	var bl = this.transformPoint(transform, 0, height);
	var br = this.transformPoint(transform, width, height);
	
	var sX = Math.min(tl.x, tr.x, bl.x, br.x);
	var sY = Math.min(tl.y, tr.y, bl.y, br.y);
	var mX = Math.max(tl.x, tr.x, bl.x, br.x);
	var mY = Math.max(tl.y, tr.y, bl.y, br.y);
	
	this.paintWarnings.push({object:object, min:{x:sX, y:sY}, max:{x:mX, y:mY}});
	
	return;
};

CrocRoot.prototype.clearPaintWarnings = function() {
	this.paintWarnings = [];
	return;
};

CrocRoot.prototype.setGlobalPaintWarning = function(warning) {
	this.globalPaintWarning = warning;
	this.repaint();
};

CrocRoot.prototype.testPaintWarnings = function(object, transform) {
	
	var tl = this.transformPoint(transform, 0, 0);
	var tr = this.transformPoint(transform, object.getWidth(), 0);
	var bl = this.transformPoint(transform, 0, object.getHeight());
	var br = this.transformPoint(transform, object.getWidth(), object.getHeight());
	
	var sX = Math.min(tl.x, tr.x, bl.x, br.x);
	var sY = Math.min(tl.y, tr.y, bl.y, br.y);
	var mX = Math.max(tl.x, tr.x, bl.x, br.x);
	var mY = Math.max(tl.y, tr.y, bl.y, br.y);
	
	for(var i = 0; i < this.paintWarnings.length; i++) {
		var currentPaintWarning = this.paintWarnings[i];
		
		if(this.globalPaintWarning) {
			currentPaintWarning.object.event("paintWarning", object);
		}
		
		else if (
			sX < currentPaintWarning.max.x &&
			mX > currentPaintWarning.min.x &&
			sY < currentPaintWarning.max.y &&
			mY > currentPaintWarning.min.y) {
			
			currentPaintWarning.object.event("paintWarning", object);
		}
		
	}
};

CrocRoot.prototype.repaint = function() {
	
	//A draw has already been request no need to ask again...
	if(this.dirty) {
		return;
	}
	
	this.dirty = true;
	
	var currentCrocRoot = this;
	window.requestAnimationFrame(function() {
		currentCrocRoot.paint();
	});
};

CrocRoot.prototype.loadImage = function(src, callback) {
	
	var currentCrocRoot = this;
	
	if(src in this.imageStore) {
		if(this.imageStore[src].loaded) {
			
			if(callback !== undefined) {
				callback.call(currentCrocRoot, false);
			}
		}
		
		else {
			if(!(src in this.imageStoreListeners)) {
				this.imageStoreListeners[src] = [];
			}
			
			this.imageStoreListeners[src].push(callback);
		}
		
		return;
	}
	
	var image = new Image();
	
	this.imageStore[src] = {image:image, loaded:false};
	
	if(!(src in this.imageStoreListeners)) {
		this.imageStoreListeners[src] = [];
	}
	
	this.imageStoreListeners[src].push(callback);
	
	image.onload = function() {
		currentCrocRoot.onImageLoad.call(currentCrocRoot, this.origSrc);
		
		if(this.origSrc in currentCrocRoot.imageStoreListeners) {
			for(var i = 0; i < currentCrocRoot.imageStoreListeners[this.origSrc].length; i++) {
				currentCrocRoot.imageStoreListeners[this.origSrc][i].call(currentCrocRoot, false);
			}
			
			currentCrocRoot.imageStoreListeners[this.origSrc] = [];
		}
	}
	
	image.onerror = function(err) {
		currentCrocRoot.imageStore[this.origSrc].image = null;
		
		currentCrocRoot.onImageLoad.call(currentCrocRoot, this.origSrc);
		
		if(this.origSrc in currentCrocRoot.imageStoreListeners) {
			for(var i = 0; i < currentCrocRoot.imageStoreListeners[this.origSrc].length; i++) {
				currentCrocRoot.imageStoreListeners[this.origSrc][i].call(currentCrocRoot, err);
			}
			
			currentCrocRoot.imageStoreListeners[this.origSrc] = [];
		}
	}
	
	image.origSrc = src;
	image.src = src;
};

CrocRoot.prototype.setCursor = function(type) {
	window.document.body.style.cursor = type || "";
	return;
};

CrocRoot.prototype.onImageLoad = function(src) {
	
	if(src === undefined) {
		return;
	}
	
	if(!(src in this.imageStore)) {
		this.error("Wasn't waiting for image \"" + src + "\" to load but got event anyway?!");
		return;
	}
	
	this.imageStore[src].loaded = true;

	this.repaint();
	
	this.event("imageload", {"src":src}, true);
	
	return;
};

CrocRoot.prototype.getImage = function(src) {
	
	if(src === undefined) {
		return;
	}
	
	if(!(src in this.imageStore)) {
		this.error("No such image \"" + src + "\" in image storage!");
		return null;
	}
	
	if(this.imageStore[src].loaded) {
		return this.imageStore[src].image;
	}
	
	return null;
};

//So hitTest is done as such.
//CrocRoot will draw a box the will be #000000ff in global space
//All UIElement will then clip mask their region checking for this box.
//If they find it then they have a hit.
//If they don't have it false.
//Everything shuold either return a single object, or list.
//Order is critical as this is the hit order and will determine who "wins" the event
CrocRoot.prototype.hitTest = function(x, y) {

	x = x || 0;
	y = y || 0;
	
	var hitReturn = [];
	var hitObject = null;

	this.hitContext.save();
	
	this.clearHitContext();
	
	this.hitContext.scale(this.scaleFactorX, this.scaleFactorY);
		
	this.rootTransform = this.hitContext.getCurrentTransform();
	
	var newWidthHeight = this.transformPoint(this.inverseTransform(this.context.getCurrentTransform()), this.getWidth(), this.getHeight());
		
	for(var i = 0; i < this.children.length; i++) {
		hitObject = this.children[i].hitTest(this.hitContext, x, y, this.getWidth(), this.getHeight());
		
		if(hitObject !== null) {
			hitReturn.push(hitObject);
		}
	}
	
	this.hitContext.restore();
	
	return hitReturn;
};

CrocRoot.prototype.setScaleFactor = function(factor, yScale) {

	this.scaleFactorX = factor;
	this.scaleFactorY = yScale || factor;
	this.repaint();
};

CrocRoot.prototype.setSmooth = function(smooth) {
	this.context['imageSmoothingEnabled'] = smooth;       /* standard */
	this.context['mozImageSmoothingEnabled'] = smooth;    /* Firefox */
	this.context['oImageSmoothingEnabled'] = smooth;      /* Opera */
	this.context['webkitImageSmoothingEnabled'] = smooth; /* Safari */
	this.context['msImageSmoothingEnabled'] = smooth;     /* IE */
};

CrocRoot.prototype.paint = function() {

	//When we initialize the context there needs to be a currenTransform value.
	//This is now standard but some browsers, like firefox call it mozCurrentTransform.
	//So we map with context.getCurrentTransform() function;
	
	if(!this.visible) {
		this.clear();
		this.clearPaintWarnings();
	}
	
	if(this.dirty && this.visible) {
		this.dirty = false;
		this.context.save();
		//Reset context transformation
		this.clear();
		
		this.context.scale(this.scaleFactorX, this.scaleFactorY);
		
		this.rootTransform = this.context.getCurrentTransform();
		
		this.setSmooth(false);
		
		var i = this.children.length;
		
		while(i--) {
			this.children[i].paint(this.context, this.getWidth(), this.getHeight());
		}
		
		this.clearPaintWarnings();
		this.context.restore();
	}
	
	return;
	
};
