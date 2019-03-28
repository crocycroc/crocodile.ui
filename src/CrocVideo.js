function CrocVideo(root, videoFile) {
	
	var currentCrocVideo = this;
	
	CrocBase.call(this, root);
	
	this._videoElement = document.createElement('video');
	this._drawTimeout = null;
	
	this._videoElement.addEventListener('play', function() {
		currentCrocVideo._onPlay();
	});
	
	this._videoElement.innerHTML = '<source src="' + videoFile.toString() + '" type="video/webm">'
	
};

//We inherit everything from CrocBase
CrocVideo.prototype = Object.create(CrocBase.prototype);
CrocVideo.prototype.constructor = CrocVideo;

CrocVideo.prototype._onPlay = function() {
	
	this.getRoot().repaint();
	
	this.event('play');
	
};

CrocVideo.prototype.play = function() {
	this._videoElement.play();
};

CrocVideo.prototype.pause = function() {
	this._videoElement.pause();
};

CrocVideo.prototype.stop = function() {
	this._videoElement.stop();
};

CrocVideo.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var currentCrocVideo = this;
	
	if(!this.visible) {
		return;
	}
	
	context.save();
	
	context.drawImage(this._videoElement, 0, 0);
	
	context.restore();
	
	if(!this._videoElement.paused && !this._videoElement.ended) {
		this._drawTimeout = setTimeout(function() {
			currentCrocVideo.getRoot().repaint();
		}, 16);
	}
	
	return;
}
