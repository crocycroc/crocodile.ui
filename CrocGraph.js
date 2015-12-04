
function CrocGraph(root) {
	CrocBase.call(this, root);
	
	//Each data set has the following
	//Points {x:y, x:y, x:y, x:y}
	//Label
	//Label Color
	//Label Font
	//Units Name of Unit unitTypes
	//Line Color
	//Line Style
	//Line Width
	//Point Color
	//Point Style
	//Point Width
	this.dataSets = {
		"test": {
			"points":{1:2, 3:5, 4:2, 12:4, 2:1},
			"label":"Test Data",
			"labelColor":"green",
			"labelFont":"24px Arial",
			"labelFontHeight":determineFontHeight("24px Arial"),
			"labelFontPadding":4,
			"units":"test",
			"lineColor":"pink",
			"lineStyle":"solid",
			"lineWidth":4,
			"pointColor":"blue",
			"pointStyle":"circle",
			"pointWidth":6,
		}
	};
	
	this.xAxisUnits = "default";
	this.yAxisPadding = "20px"; //Only used if we have more than two axis
	
	this.unitTypes = {
		"default": {
			"label":"",
			"labelColor":"black",
			"lineColor":"black",
			"lineWidth":2,
			"minValue":0,
			"maxValue":100,
			"majorStep":10,
			"minorStep":2,
			"majorLineColor":"black",
			"minorLineColor":"red",
			"majorLineStyle":"solid",
			"minorLineStyle":"solid",
			"majorLineWidth":2,
			"minorLineWidth":1,
			"majorLineLength":10,
			"minorLineLength":4,
			"majorLabelColor":"black",
			"minorLabelColor":"black",
			"majorLabelFont":"24px Arial",
			"majorLabelFontHeight":determineFontHeight("24px Arial"),
			"majorLabelFontPadding":4,
			"minorLabelFont":"18px Arial",
			"minorLabelFontHeight":determineFontHeight("18px Arial"),
			"minorLabelFontPadding":4,
			"labelFormat":function(value){ if(value === undefined) { return "undefined"} return value.toString()},
			"majorBackgroundLineColor":"blue",
			"minorBackgroundLineColor":"red",
			"majorBackgroundLineWidth":2,
			"minorBackgroundLineWidth":1,
			"majorBackgroundLineStyle":"solid",
			"minorBackgroundLineStyle":"none"
		},
		
		"test": {
			"label":"",
			"labelColor":"black",
			"lineColor":"black",
			"lineWidth":2,
			"minValue":0,
			"maxValue":100,
			"majorStep":10,
			"minorStep":2,
			"majorLineColor":"black",
			"minorLineColor":"blue",
			"majorLineStyle":"solid",
			"minorLineStyle":"solid",
			"majorLineWidth":2,
			"minorLineWidth":1,
			"majorLineLength":20,
			"minorLineLength":4,
			"majorLabelColor":"black",
			"minorLabelColor":"black",
			"majorLabelFont":"24px Arial",
			"majorLabelFontHeight":determineFontHeight("24px Arial"),
			"majorLabelFontPadding":4,
			"minorLabelFont":"18px Arial",
			"minorLabelFontHeight":determineFontHeight("18px Arial"),
			"minorLabelFontPadding":4,
			"labelFormat":function(value){ if(value === undefined) { return "undefined"} return value.toString()},
			"majorBackgroundLineColor":"blue",
			"minorBackgroundLineColor":"red",
			"majorBackgroundLineWidth":2,
			"minorBackgroundLineWidth":1,
			"majorBackgroundLineStyle":"solid",
			"minorBackgroundLineStyle":"none"
		}
	};
};

CrocGraph.prototype = Object.create(CrocBase.prototype);

CrocGraph.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var originTransform = context.getCurrentTransform();
		
	var currentXAxisUnits = this.unitTypes[this.xAxisUnits];
	
	var currentXAxisDrawHeight =	this.convertToPixels(currentXAxisUnits.lineWidth, this.getHeight()) + 
					Math.max(this.convertToPixels(currentXAxisUnits.majorLineLength, this.getHeight()), this.convertToPixels(currentXAxisUnits.minorLineLength, this.getHeight())) +
					currentXAxisUnits.majorLabelFontHeight +
					currentXAxisUnits.minorLabelFontPadding
	
	var currentRightYAxisWidth = 0;
	var currentLeftYAxisWidth = 0;
	
	var currentYAxisNumber = 0;
	var currentYAxisPadding = this.convertToPixels(this.yAxisPadding, this.getWidth());
	
	for(var k in this.unitTypes) {
		if(k !== this.xAxisUnits) {
			var currentYAxisUnits = this.unitTypes[k];
			
			var currentYAxisDrawWidth =	this.convertToPixels(currentYAxisUnits.lineWidth, this.getWidth()) + 
							Math.max(this.convertToPixels(currentYAxisUnits.majorLineLength, this.getWidth()), this.convertToPixels(currentYAxisUnits.minorLineLength, this.getWidth())) +
							currentYAxisUnits.majorLabelFontHeight +
							currentYAxisUnits.minorLabelFontPadding
			
			
			
			if(currentYAxisNumber % 2 === 0) {
				currentLeftYAxisWidth += currentYAxisDrawWidth;
				
				if(currentYAxisNumber > 1) {
					currentLeftYAxisWidth += currentYAxisPadding;
				}
			}
			
			else {
				currentRightYAxisWidth += currentYAxisDrawWidth;
				
				if(currentYAxisNumber > 1) {
					currentRightYAxisWidth += currentYAxisPadding;
				}
			}
		}
	}
	
	var currentInteriorWidth = this.getWidth() - currentRightYAxisWidth - currentLeftYAxisWidth;
	var currentInteriorHeight = this.getHeight() - currentXAxisDrawHeight;
	
	//First we draw the x axis
	context.beginPath();
	context.getContext().lineWidth = this.convertToPixels(currentXAxisUnits.lineWidth, this.getHeight());
	context.getContext().strokeStyle = currentXAxisUnits.lineColor;
	context.moveTo(currentLeftYAxisWidth, currentInteriorHeight - currentXAxisUnits.lineWidth / 2);
	context.lineTo(currentLeftYAxisWidth + currentInteriorWidth, currentInteriorHeight - currentXAxisUnits.lineWidth / 2);
	context.stroke();
	
	var numberOfMinorLines = (currentXAxisUnits.maxValue - currentXAxisUnits.minValue) / currentXAxisUnits.minorStep;
	var minorLineDistance = (currentInteriorWidth / (currentXAxisUnits.maxValue - currentXAxisUnits.minValue)) * currentXAxisUnits.minorStep;
	var currentMinorLineXPos = currentLeftYAxisWidth + currentXAxisUnits.minorLineWidth / 2;
	var minorLineLength = this.convertToPixels(currentXAxisUnits.minorLineLength, this.getHeight());
	
	context.getContext().lineWidth = this.convertToPixels(currentXAxisUnits.minorLineWidth, this.getWidth());
	context.getContext().strokeStyle = currentXAxisUnits.minorLineColor;
		
	//Now we draw the minor step lines
	switch(currentXAxisUnits.minorLineStyle) {
		case "solid":
			for(var i = 0; i < numberOfMinorLines; i++) {
				
				context.beginPath();
				context.moveTo(currentMinorLineXPos, currentInteriorHeight);
				context.lineTo(currentMinorLineXPos, currentInteriorHeight + minorLineLength);
				context.stroke();
				
				currentMinorLineXPos += minorLineDistance;
			}
			
			break;
			
		default:
			break;
	}
	
	var numberOfMajorLines = (currentXAxisUnits.maxValue - currentXAxisUnits.minValue) / currentXAxisUnits.majorStep;
	var majorLineDistance = (currentInteriorWidth / (currentXAxisUnits.maxValue - currentXAxisUnits.minValue)) * currentXAxisUnits.majorStep
	var currentMajorLineXPos = currentLeftYAxisWidth + currentXAxisUnits.majorLineWidth / 2;
	var majorLineLength = this.convertToPixels(currentXAxisUnits.majorLineLength, this.getHeight());
	
	context.getContext().lineWidth = this.convertToPixels(currentXAxisUnits.majorLineWidth, this.getWidth());
	context.getContext().strokeStyle = currentXAxisUnits.majorLineColor;
		
	//Now we draw the major step lines
	switch(currentXAxisUnits.majorLineStyle) {
		case "solid":
			for(var i = 0; i < numberOfMajorLines; i++) {
				context.beginPath();
				context.moveTo(currentMajorLineXPos, currentInteriorHeight);
				context.lineTo(currentMajorLineXPos, currentInteriorHeight + majorLineLength);
				context.stroke();
				
				currentMajorLineXPos += majorLineDistance;
			}
			
			break;
			
		default:
			break;
	}
	
	var currentLeftYAxisXPos = currentLeftYAxisWidth;
	var currentRightYAxisXPos = currentLeftYAxisWidth + currentInteriorWidth;
	
	for(var k in this.unitTypes) {
		if(k !== this.xAxisUnits) {
			var currentYAxisUnits = this.unitTypes[k];
			var currentXPos = null;
			
			
			
			if(currentYAxisNumber % 2 === 0) {
				currentXPos = currentLeftYAxisXPos;
			}
			
			else {
				currentXPos = currentRightYAxisXPos;
			}
			
			//First we draw the y axis
			context.beginPath();
			context.getContext().lineWidth = this.convertToPixels(currentYAxisUnits.lineWidth, this.getHeight());
			context.getContext().strokeStyle = currentYAxisUnits.lineColor;
			context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, 0);
			context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentInteriorHeight);
			context.stroke();

			var numberOfMinorLines = (currentYAxisUnits.maxValue - currentYAxisUnits.minValue) / currentYAxisUnits.minorStep;
			var minorLineDistance = (currentInteriorHeight / (currentYAxisUnits.maxValue - currentYAxisUnits.minValue)) * currentYAxisUnits.minorStep;
			var currentMinorLineYPos = currentInteriorHeight - currentYAxisUnits.minorLineWidth / 2;
			var minorLineLength = this.convertToPixels(currentYAxisUnits.minorLineLength, this.getWidth());
			
			context.getContext().lineWidth = this.convertToPixels(currentYAxisUnits.minorLineWidth, this.getWidth());
			context.getContext().strokeStyle = currentYAxisUnits.minorLineColor;
			
			//Now we draw the minor step lines
			switch(currentYAxisUnits.minorLineStyle) {
				case "solid":
					for(var i = 0; i < numberOfMinorLines; i++) {
						
						context.beginPath();
						context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentMinorLineYPos);
						
						if(currentYAxisNumber % 2 === 0) {
							context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 - minorLineLength, currentMinorLineYPos);
						}
						
						else {
							context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 + minorLineLength, currentMinorLineYPos);
						}
						
						context.stroke();
						
						currentMinorLineYPos -= minorLineDistance;
					}
					
					break;
					
				default:
					break;
			}
			
			var numberOfMajorLines = (currentYAxisUnits.maxValue - currentYAxisUnits.minValue) / currentYAxisUnits.minorStep;
			var majorLineDistance = (currentInteriorHeight / (currentYAxisUnits.maxValue - currentYAxisUnits.minValue)) * currentYAxisUnits.majorStep;
			var currentMajorLineYPos = currentInteriorHeight - currentYAxisUnits.majorLineWidth / 2;
			var majorLineLength = this.convertToPixels(currentYAxisUnits.majorLineLength, this.getWidth());
			
			context.getContext().lineWidth = this.convertToPixels(currentYAxisUnits.majorLineWidth, this.getWidth());
			context.getContext().strokeStyle = currentYAxisUnits.majorLineColor;
			
			//Now we draw the major step lines
			switch(currentYAxisUnits.majorLineStyle) {
				case "solid":
					for(var i = 0; i < numberOfMajorLines; i++) {
						
						context.beginPath();
						context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentMajorLineYPos);
						
						if(currentYAxisNumber % 2 === 0) {
							context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 - majorLineLength, currentMajorLineYPos);
						}
						
						else {
							context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 + majorLineLength, currentMajorLineYPos);
						}
						
						context.stroke();
						
						currentMajorLineYPos -= majorLineDistance;
					}
					
					break;
					
				default:
					break;
			}
			
			currentYAxisNumber += 1;
		}
	}
};