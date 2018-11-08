
function CrocThemer(root) {
	this.values = {};
	this.root = root;
}

CrocThemer.prototype.importTheme = function(theme, callback) {
	
	var currentThemer = this;
	var constructorNames = Object.keys(theme);
	
	for(var constructorName in theme) {
		if(window[constructorName] !== undefined && typeof window[constructorName] === 'function') {
			
			for(var tag in theme[constructorName]) {
				this.setValue(constructorName, tag, theme[constructorName][tag]);
			}
			
		}
	}
	
	function _importCrocThemeHelper() {
		
		if(constructorNames.length <= 0) {
			callback.call(currentThemer, false);
			return;
		}
		
		var constructorName = constructorNames.shift();
		
		var tagKeys = Object.keys(theme[constructorName]);
		
		function _importThemeHelper() {
			
			if(tagKeys.length <= 0) {
				_importCrocThemeHelper();
				return;
			}
			
			var currentTag = tagKeys.shift();
			
			currentThemer.setValue(constructorName, currentTag, theme[constructorName][currentTag]);
			
			if(/\.png$|\.svg$|\.jpg$|\.bmp/.test(theme[constructorName][currentTag])) {
				
				currentThemer.root.loadImage(theme[constructorName][currentTag], function() {
					_importThemeHelper();
				});
			}
			
			else {
				_importThemeHelper();
			}
			
		}
		
		_importThemeHelper();
		
	};
	
	_importCrocThemeHelper();
};

CrocThemer.prototype.setValue = function(constructor, tag, value) {
	
	var constructorName = constructor.name || constructor.toString();
	
	if(this.values[constructorName] === undefined) {
		this.values[constructorName] = {};
	}
	
	this.values[constructorName][tag] = value;
	return;
};

CrocThemer.prototype.getValue = function(constructor, tag) {
	
	var constructorName = constructor.name || constructor.toString();
	
	if(this.values[constructorName] === undefined) {
		return null;
	}
	
	if(this.values[constructorName][tag] === undefined) {
		return null;
	}
	
	return this.values[constructorName][tag];
};
