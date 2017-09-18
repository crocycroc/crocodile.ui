
function CrocThemer(theme) {
	this.values = {};
	
	this.importTheme(theme);
}

CrocThemer.prototype.importTheme = function(theme) {
	
	for(var constructorName in theme) {
		
		if(window[constructorName] !== undefined && typeof window[constructorName] === 'function') {
			
			for(var tag in theme[constructorName]) {
				this.setValue(window[constructorName], tag, theme[constructorName][tag]);
			}
			
		}
		
	}
	
};

CrocThemer.prototype.setValue = function(constructor, tag, value) {
	
	if(this.values[constructor] === undefined) {
		this.values[constructor] = {};
	}
	
	this.values[constructor][tag] = value;
	return;
};

CrocThemer.prototype.getValue = function(constructor, tag) {
	
	if(this.values[constructor] === undefined) {
		return null;
	}
	
	if(this.values[constructor][tag] === undefined) {
		return null;
	}
	
	return this.values[constructor][tag];
};
