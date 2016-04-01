
/*
 * The purpose of the event handler in croc is to deal with all input from a client device
 * The input should be converted into the standard expected events types for group UI objects
 * Croc's UI object shouldn't half to worry about handling shortcuts, or touch vs. mouse input.
 */
function CrocEventHandler(root) {
	var currentEventHandler = this;
	this.root = root;
	this.lastMouseEvent = {}; //Because firefox is goofy about wheel mouse events.
	this.triggeredObject = null;
	this.keysDown = [];
	
	this.root.canvas.addEventListener('mousemove', function(e) {
		currentEventHandler.onMouseMove(e);
	});
	
	this.root.canvas.addEventListener('mousedown', function(e) {
		currentEventHandler.onMouseDown(e);
	});
	
	this.root.canvas.addEventListener('mouseup', function(e) {
		currentEventHandler.onMouseUp(e);
	});
	
	this.root.canvas.addEventListener('mousewheel', function(e) {
		currentEventHandler.onMouseWheel(e);
	}, false);
	
	this.root.canvas.addEventListener('DOMMouseScroll', function(e) {
		currentEventHandler.onMouseWheel(e);
	}, false);
	
	this.root.canvas.addEventListener('click', function(e) {
		currentEventHandler.onClick(e);
	});
	
	window.addEventListener('keydown', function(e) {
		console.log(e);
	}, false);
	
	window.addEventListener('keyup', function(e) {
		console.log(e);
	}, false);
	
	window.addEventListener('resize', function() { 
		currentEventHandler.onCanvasResize() 
	}, false);
};

CrocEventHandler.prototype.onCanvasResize = function() {
	
	//We should just be sending a resize event to the root canvas, and then it should be listening for it.
	if(this.fullscreen) {
		this.root.canvas.width = window.innerWidth;
		this.root.canvas.height = window.innerHeight;
	
		this.root.hitCanvas.width = window.innerWidth;
		this.root.hitCanvas.height = window.innerHeight;
	}
	
	this.root.repaint();
};

CrocEventHandler.prototype.onMouseMove = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
        var coords = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
	
	this.lastMouseEvent = e;
	
	var hits = this.root.hitTest(coords.x, coords.y);
	
	var lastTriggeredObject = this.triggeredObject;
	
	var value = this.propagateHitEvent(hits, 'pointermove', coords);
	
	//If the newly focused object is not the one when we started it means mouseleave has occured.
	if(lastTriggeredObject !== this.triggeredObject && lastTriggeredObject !== null) {
		lastTriggeredObject.event('pointerleave', coords);
	}
	
	else if(value && lastTriggeredObject !== null) {
		lastTriggeredObject.event('pointerleave', coords);
	}
	
};

CrocEventHandler.prototype.onMouseDown = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
        var coords = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        };
	
	var hits = this.root.hitTest(coords.x, coords.y);
	
	this.propagateHitEvent(hits, 'pointerdown', coords);
	
};

CrocEventHandler.prototype.onMouseWheel = function(e) {
	// cross-browser wheel delta
	var e = window.event || e; // old IE support
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

	delta = delta * 4.0; //Delta multiplier for speed ups, or slow downs.
	
	var eventData = {
		delta:delta,
		data:e
	};
	
	e = this.lastMouseEvent;
	
	var rect = this.root.canvas.getBoundingClientRect();
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top,
		delta:delta,
		data:e
	};
	
	var hits = this.root.hitTest(coords.x, coords.y);
	
	var currentEventType = 'scrollverticle';

	if(this.keysDown.indexOf("Shift") >= 0) {
		currentEventType = 'scrollhorizontal';
	}
	
	this.propagateHitEvent(hits, currentEventType, coords);
		
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event(currentEventType, coords);
	}
};

CrocEventHandler.prototype.onMouseUp = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	
	var hits = this.root.hitTest(coords.x, coords.y);
	
	this.propagateHitEvent(hits, 'pointerup', coords);
	
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event('pointerup', coords);
	}
	
};

CrocEventHandler.prototype.onClick = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	
	var hits = this.root.hitTest(coords.x, coords.y);
	
	this.propagateHitEvent(hits, 'click', coords);
	
};

CrocEventHandler.prototype.onKeyDown = function(e) {
	if(this.keysDown.indexOf(e.key) < 0) {
		this.keysDown.push(e.key);
	}
	
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event('keydown', e, true);
	}
};

CrocEventHandler.prototype.onKeyUp = function(e) {
	if(this.keysDown.indexOf(e.key) >= 0) {
		this.keysDown.splice(this.keysDown.indexOf(e.key));
	}
	
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event('keyup', e, true);
	}
};

//Given a order tree check to see if anyone wants the event.
CrocEventHandler.prototype.propagateHitEvent = function(objects, event, data) {
	
	if(objects.length !== undefined) {
		for(var i = 0; i < objects.length; i++) {
			if(this.propagateHitEvent(objects[i], event, data) === false) {
				return false;
			}
		}
	}
	
	else if(typeof objects === 'object' && objects.event !== undefined && typeof objects.event === 'function') {
		if(objects.event(event, data) === false) {
			this.triggeredObject = objects;
			return false; 
		}
	}
	
	return true;
};