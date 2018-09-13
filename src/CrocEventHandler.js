
/*
 * The purpose of the event handler in croc is to deal with all input from a client device
 * The input should be converted into the standard expected events types for group UI objects
 * Croc's UI object shouldn't have to worry about handling shortcuts, or touch vs. mouse input.
 */
function CrocEventHandler(root) {
	var currentEventHandler = this;
	this.root = root;
	this.lastMouseEvent = {}; //Because firefox is goofy about wheel mouse events.
	this.lastTriggeredObject = null;
	this.triggeredObject = null;
	this.keysDown = [];
	
	this.root.canvas.addEventListener('mousemove', function(e) {
		currentEventHandler.onMouseMove(e);
		return currentEventHandler._onEventAbsorb(e);
	});
	
	this.root.canvas.addEventListener('mousedown', function(e) {
		currentEventHandler.onMouseDown(e);
		return currentEventHandler._onEventAbsorb(e);
	});
	
	this.root.canvas.addEventListener('mouseup', function(e) {
		currentEventHandler.onMouseUp(e);
		return currentEventHandler._onEventAbsorb(e);
	});
	
	this.root.canvas.addEventListener('mousewheel', function(e) {
		currentEventHandler.onMouseWheel(e);
	}, false);
	
	this.root.canvas.addEventListener('mouseout', function(e) {
		currentEventHandler.onMouseOut(e);
	}, false);
	
	this.root.canvas.addEventListener('DOMMouseScroll', function(e) {
		currentEventHandler.onMouseWheel(e);
	}, false);
	
	this.root.canvas.addEventListener('click', function(e) {
		currentEventHandler.onClick(e);
	});
	
	this.root.canvas.addEventListener('keydown', function(e) {
		currentEventHandler.onKeyDown(e);
	}, false);
	
	this.root.canvas.addEventListener('keyup', function(e) {
		currentEventHandler.onKeyUp(e);
	}, false);
	
	this.root.canvas.addEventListener('touchmove', function(e) {
		
		if(e.changedTouches !== undefined && e.changedTouches[0] !== undefined) {
			e.clientX = e.changedTouches[0].clientX;
			e.clientY = e.changedTouches[0].clientY;
		}
		
		currentEventHandler.onMouseMove(e);
		return currentEventHandler._onEventAbsorb(e);
	}, false);
	
	this.root.canvas.addEventListener('touchstart', function(e) {
		
		if(e.changedTouches !== undefined && e.changedTouches[0] !== undefined) {
			e.clientX = e.changedTouches[0].clientX;
			e.clientY = e.changedTouches[0].clientY;
		}
		
		currentEventHandler.onMouseDown(e);
		return currentEventHandler._onEventAbsorb(e);
	}, false);
	
	this.root.canvas.addEventListener('touchend', function(e) {
		
		if(e.changedTouches !== undefined && e.changedTouches[0] !== undefined) {
			e.clientX = e.changedTouches[0].clientX;
			e.clientY = e.changedTouches[0].clientY;
		}
		
		currentEventHandler.onMouseUp(e);
		return currentEventHandler._onEventAbsorb(e);
	}, false);
	
	window.addEventListener('resize', function() { 
		currentEventHandler.onCanvasResize() 
	}, false);
};

CrocEventHandler.prototype._onEventAbsorb = function(event) {
	
	var e = event || window.event;
	
	e.preventDefault && e.preventDefault();
	e.stopPropagation && e.stopPropagation();      
	e.cancelBubble = true;
	e.returnValue = false;
	return false;
};

CrocEventHandler.prototype.onCanvasResize = function() {
	
	//We should just be sending a resize event to the root canvas, and then it should be listening for it.
	if(this.root.fullscreen) {
		this.root.canvas.width = window.innerWidth;
		this.root.canvas.height = window.innerHeight;
	
		this.root.hitCanvas.width = window.innerWidth;
		this.root.hitCanvas.height = window.innerHeight;
	}
	
	this.root.repaint();
};

CrocEventHandler.prototype.sendHitEvent = function(coords, eventType) {
	var hits = this.root.hitTest(coords.x, coords.y);
	
	coords.root = this.root.getLocalHitCoord();
	
	if(this.root.focusedObject !== null) {
		coords.local = this.root.focusedObject.getLocalHitCoord();
		this.root.focusedObject.event(eventType, coords);
	}
	
	else {
		if(this.propagateHitEvent(hits, eventType, coords) === true) {
			this.triggeredObject = null;
		}
	}
};

CrocEventHandler.prototype.onMouseMove = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();

	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	
	this.lastMouseEvent = e;
	
	this.sendHitEvent(coords, 'pointermove');
	
	//If the newly focused object is not the one when we started it means mouseleave has occured.
	if(this.lastTriggeredObject !== this.triggeredObject) {
		
		if(this.triggeredObject !== null) {
			this.triggeredObject.event('pointerenter', coords);
		}
		
		if(this.lastTriggeredObject !== null) {
			this.lastTriggeredObject.event('pointerleave', coords);
		}
	}
	
	this.lastTriggeredObject = this.triggeredObject;
};

CrocEventHandler.prototype.onMouseDown = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
	
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	
	this.sendHitEvent(coords, 'pointerdown');
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
	
	var currentEventType = 'scrollverticle';
	
	if(this.keysDown.indexOf("Shift") >= 0) {
		currentEventType = 'scrollhorizontal';
	}
	
	this.sendHitEvent(coords, currentEventType);
};

CrocEventHandler.prototype.onMouseOut = function(e) {
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event('pointerout', e, true);
	}
};

CrocEventHandler.prototype.onMouseUp = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};
	
	this.sendHitEvent(coords, 'pointerup');
};

CrocEventHandler.prototype.onClick = function(e) {
	var rect = this.root.canvas.getBoundingClientRect();
	var coords = {
		x: e.clientX - rect.left,
		y: e.clientY - rect.top
	};

	this.sendHitEvent(coords, 'click');
};

CrocEventHandler.prototype.onKeyDown = function(e) {
	if(this.keysDown.indexOf(e.key) < 0) {
		this.keysDown.push(e.key);
	}
	
	this.root.event('keydown', e, false);
	
	if(this.root.focusedObject !== null) {
		this.root.focusedObject.event('keydown', e, true);
	}
};

CrocEventHandler.prototype.onKeyUp = function(e) {
	if(this.keysDown.indexOf(e.key) >= 0) {
		this.keysDown.splice(this.keysDown.indexOf(e.key));
	}
	
	this.root.event('keyup', e, false);
	
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
		
		data.local = objects.getLocalHitCoord();
		
		if(objects.event(event, data) === false) {
			this.triggeredObject = objects;
			return false; 
		}
	}
	
	return true;
};
