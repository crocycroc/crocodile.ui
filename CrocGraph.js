
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
			"lineWidth":2,
			"pointColor":"green",
			"pointStyle":"square",
			"pointWidth":10,
		},
		
		"other": {
			"points":{1:6, 3:8, 4:12, 12:14, 2:6},
			"label":"Test Data",
			"labelColor":"green",
			"labelFont":"24px Arial",
			"labelFontHeight":determineFontHeight("24px Arial"),
			"labelFontPadding":4,
			"units":"test",
			"lineColor":"blue",
			"lineStyle":"solid",
			"lineWidth":2,
			"pointColor":"orange",
			"pointStyle":"triangle",
			"pointWidth":10,
		},
		
		"again": {
			"points":{1:12, 3:10, 4:2, 12:4, 2:18, 7:18},
			"label":"Test Data",
			"labelColor":"green",
			"labelFont":"24px Arial",
			"labelFontHeight":determineFontHeight("24px Arial"),
			"labelFontPadding":4,
			"units":"test",
			"lineColor":"red",
			"lineStyle":"solid",
			"lineWidth":2,
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
			"labelColor":"#444444",
			"lineColor":"#888888",
			"lineWidth":2,
			"minValue":0,
			"maxValue":30,
			"majorStep":10,
			"minorStep":2,
			"majorLineColor":"#444444",
			"minorLineColor":"#CC0000",
			"majorLineStyle":"solid",
			"minorLineStyle":"solid",
			"majorLineWidth":2,
			"minorLineWidth":1,
			"majorLineLength":10,
			"minorLineLength":4,
			"majorLabelShow":true,
			"minorLabelShow":true,
			"majorLabelColor":"#444444",
			"minorLabelColor":"#444444",
			"majorLabelFont":"24px Arial",
			"majorLabelFontHeight":determineFontHeight("24px Arial"),
			"majorLabelFontPadding":4,
			"minorLabelFont":"18px Arial",
			"minorLabelFontHeight":determineFontHeight("18px Arial"),
			"minorLabelFontPadding":4,
			"labelFormat":function(value){ if(value === undefined) { return "undefined"} return value.toString()},
			"majorBackgroundLineColor":"#0000CC",
			"minorBackgroundLineColor":"#CC0000",
			"majorBackgroundLineWidth":2,
			"minorBackgroundLineWidth":1,
			"majorBackgroundLineStyle":"solid",
			"minorBackgroundLineStyle":"none"
		},
		
		"test": {
			"label":"",
			"labelColor":"#444444",
			"lineColor":"#888888",
			"lineWidth":2,
			"minValue":-20,
			"maxValue":20,
			"majorStep":10,
			"minorStep":5,
			"majorLineColor":"#444444",
			"minorLineColor":"#0000CC",
			"majorLineStyle":"solid",
			"minorLineStyle":"solid",
			"majorLineWidth":2,
			"minorLineWidth":1,
			"majorLineLength":10,
			"minorLineLength":4,
			"majorLabelShow":true,
			"minorLabelShow":false,
			"majorLabelColor":"#444444",
			"minorLabelColor":"#444444",
			"majorLabelFont":"18px Arial",
			"majorLabelFontHeight":determineFontHeight("24px Arial"),
			"majorLabelFontPadding":4,
			"minorLabelFont":"10px Arial",
			"minorLabelFontHeight":determineFontHeight("18px Arial"),
			"minorLabelFontPadding":4,
			"labelFormat":function(value){ if(value === undefined) { return "undefined"} return value.toString()},
			"majorBackgroundLineColor":"#0000CC",
			"minorBackgroundLineColor":"#CC0000",
			"majorBackgroundLineWidth":2,
			"minorBackgroundLineWidth":1,
			"majorBackgroundLineStyle":"solid",
			"minorBackgroundLineStyle":"none"
		},
		
// 		"other": {
// 			"label":"",
// 			"labelColor":"#444444",
// 			"lineColor":"#888888",
// 			"lineWidth":2,
// 			"minValue":0,
// 			"maxValue":100,
// 			"majorStep":10,
// 			"minorStep":5,
// 			"majorLineColor":"#444444",
// 			"minorLineColor":"#0000CC",
// 			"majorLineStyle":"solid",
// 			"minorLineStyle":"solid",
// 			"majorLineWidth":2,
// 			"minorLineWidth":1,
// 			"majorLineLength":10,
// 			"minorLineLength":4,
// 			"majorLabelShow":true,
// 			"minorLabelShow":true,
// 			"majorLabelColor":"#444444",
// 			"minorLabelColor":"#444444",
// 			"majorLabelFont":"18px Arial",
// 			"majorLabelFontHeight":determineFontHeight("24px Arial"),
// 			"majorLabelFontPadding":4,
// 			"minorLabelFont":"10px Arial",
// 			"minorLabelFontHeight":determineFontHeight("18px Arial"),
// 			"minorLabelFontPadding":4,
// 			"labelFormat":function(value){ if(value === undefined) { return "undefined"} return value.toString()},
// 			"majorBackgroundLineColor":"#0000CC",
// 			"minorBackgroundLineColor":"#CC0000",
// 			"majorBackgroundLineWidth":2,
// 			"minorBackgroundLineWidth":1,
// 			"majorBackgroundLineStyle":"solid",
// 			"minorBackgroundLineStyle":"none"
// 		}
	};
};

CrocGraph.prototype = Object.create(CrocBase.prototype);

CrocGraph.prototype.paint = function(context, width, height) {
	CrocBase.prototype.paint.call(this, context, width, height);
	
	var labelPainter = new CrocLabel(root);
	
	//Calculating render space
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
	
	///////////////////////////////////
	//First we draw the x axis
	///////////////////////////////////
	context.beginPath();
	context.lineWidth = this.convertToPixels(currentXAxisUnits.lineWidth, this.getHeight());
	context.strokeStyle = currentXAxisUnits.lineColor;
	context.moveTo(currentLeftYAxisWidth, currentInteriorHeight - currentXAxisUnits.lineWidth / 2);
	context.lineTo(currentLeftYAxisWidth + currentInteriorWidth, currentInteriorHeight - currentXAxisUnits.lineWidth / 2);
	context.stroke();
	
	var numberOfMinorLines = (currentXAxisUnits.maxValue - currentXAxisUnits.minValue) / currentXAxisUnits.minorStep;
	var minorLineDistance = (currentInteriorWidth / (currentXAxisUnits.maxValue - currentXAxisUnits.minValue)) * currentXAxisUnits.minorStep;
	var currentMinorLineXPos = currentLeftYAxisWidth + currentXAxisUnits.minorLineWidth / 2;
	var minorLineLength = this.convertToPixels(currentXAxisUnits.minorLineLength, this.getHeight());
	
	context.lineWidth = this.convertToPixels(currentXAxisUnits.minorLineWidth, this.getWidth());
	context.strokeStyle = currentXAxisUnits.minorLineColor;
		
	///////////////////////////////////
	//Now we draw the minor step lines
	///////////////////////////////////
	switch(currentXAxisUnits.minorLineStyle) {
		case "solid":
			for(var i = 0; i < numberOfMinorLines; i++) {
				
				if(((i * currentXAxisUnits.minorStep) - currentXAxisUnits.minValue) % currentXAxisUnits.majorStep !== 0) {
					context.beginPath();
					context.moveTo(currentMinorLineXPos, currentInteriorHeight);
					context.lineTo(currentMinorLineXPos, currentInteriorHeight + minorLineLength);
					context.stroke();
					
					if(currentXAxisUnits.minorLabelShow) {
						labelPainter.setColor(currentXAxisUnits.minorLabelColor);
						labelPainter.setFont(currentXAxisUnits.minorLabelFont);
						labelPainter.setText(currentXAxisUnits.labelFormat((i * currentXAxisUnits.minorStep) + currentXAxisUnits.minValue));
						context.save();
						context.translate(currentMinorLineXPos, currentInteriorHeight + minorLineLength + currentXAxisUnits.minorLabelFontPadding);
						labelPainter.paint(context, this.getWidth(), this.getHeight);
						context.restore();
					}
				}
				
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
	
	context.lineWidth = this.convertToPixels(currentXAxisUnits.majorLineWidth, this.getWidth());
	context.strokeStyle = currentXAxisUnits.majorLineColor;
		
	///////////////////////////////////
	//Now we draw the major step lines
	///////////////////////////////////
	switch(currentXAxisUnits.majorLineStyle) {
		case "solid":
			for(var i = 0; i < numberOfMajorLines; i++) {
				
				context.beginPath();
				context.moveTo(currentMajorLineXPos, currentInteriorHeight);
				context.lineTo(currentMajorLineXPos, currentInteriorHeight + majorLineLength);
				context.stroke();
				
				if(currentXAxisUnits.majorLabelShow) {
					labelPainter.setColor(currentXAxisUnits.majorLabelColor);
					labelPainter.setFont(currentXAxisUnits.majorLabelFont);
					labelPainter.setText(currentXAxisUnits.labelFormat((i * currentXAxisUnits.majorStep) + currentXAxisUnits.minValue));
					context.save();
					context.translate(currentMajorLineXPos, currentInteriorHeight + majorLineLength + currentXAxisUnits.majorLabelFontPadding);
					labelPainter.paint(context, this.getWidth(), this.getHeight);
					context.restore();
				}
				
				currentMajorLineXPos += majorLineDistance;
			}
			
			break;
			
		default:
			break;
	}
	
	
	///////////////////////////////////
	//Now we draw all the Y Axes
	///////////////////////////////////
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
			context.lineWidth = this.convertToPixels(currentYAxisUnits.lineWidth, this.getHeight());
			context.strokeStyle = currentYAxisUnits.lineColor;
			context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, 0);
			context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentInteriorHeight);
			context.stroke();

			var numberOfMinorLines = (currentYAxisUnits.maxValue - currentYAxisUnits.minValue) / currentYAxisUnits.minorStep;
			var minorLineDistance = (currentInteriorHeight / (currentYAxisUnits.maxValue - currentYAxisUnits.minValue)) * currentYAxisUnits.minorStep;
			var currentMinorLineYPos = currentInteriorHeight - currentYAxisUnits.minorLineWidth / 2;
			var minorLineLength = this.convertToPixels(currentYAxisUnits.minorLineLength, this.getWidth());
			
			context.lineWidth = this.convertToPixels(currentYAxisUnits.minorLineWidth, this.getWidth());
			context.strokeStyle = currentYAxisUnits.minorLineColor;
			
			//Now we draw the minor step lines
			switch(currentYAxisUnits.minorLineStyle) {
				case "solid":
					for(var i = 0; i < numberOfMinorLines; i++) {
						
						if(((i * currentYAxisUnits.minorStep) - currentYAxisUnits.minValue) % currentYAxisUnits.majorStep !== 0) {
							context.beginPath();
							context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentMinorLineYPos);
							
							if(currentYAxisNumber % 2 === 0) {
								context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 - minorLineLength, currentMinorLineYPos);
							}
							
							else {
								context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 + minorLineLength, currentMinorLineYPos);
							}
							
							context.stroke();
							
							if(currentYAxisUnits.minorLabelShow) {
								labelPainter.setColor(currentYAxisUnits.minorLabelColor);
								labelPainter.setFont(currentYAxisUnits.minorLabelFont);
								labelPainter.setText(currentYAxisUnits.labelFormat((i * currentYAxisUnits.minorStep) + currentYAxisUnits.minValue));
								
								context.save();
								if(currentYAxisNumber % 2 === 0) {
									labelPainter.setAlignment("right", "top");
									context.translate(currentXPos + currentYAxisUnits.lineWidth / 2 - minorLineLength, currentMinorLineYPos);
								}
								
								else {
									labelPainter.setAlignment("left", "top");
									context.translate(currentXPos + currentYAxisUnits.lineWidth / 2 + minorLineLength, currentMinorLineYPos);
								}
								
								labelPainter.paint(context, this.getWidth(), this.getHeight);
								context.restore();
							}
						}
						
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
			
			context.lineWidth = this.convertToPixels(currentYAxisUnits.majorLineWidth, this.getWidth());
			context.strokeStyle = currentYAxisUnits.majorLineColor;
			
			//Now we draw the major step lines
			switch(currentYAxisUnits.majorLineStyle) {
				case "solid":
					for(var i = 0; i < numberOfMajorLines; i++) {
						
						if(currentMajorLineYPos > 0) {
							context.beginPath();
							context.moveTo(currentXPos + currentYAxisUnits.lineWidth / 2, currentMajorLineYPos);
							
							if(currentYAxisNumber % 2 === 0) {
								context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 - majorLineLength, currentMajorLineYPos);
							}
							
							else {
								context.lineTo(currentXPos + currentYAxisUnits.lineWidth / 2 + majorLineLength, currentMajorLineYPos);
							}
							
							context.stroke();
							
							if(currentYAxisUnits.majorLabelShow) {
								labelPainter.setColor(currentYAxisUnits.majorLabelColor);
								labelPainter.setFont(currentYAxisUnits.majorLabelFont);
								labelPainter.setText(currentYAxisUnits.labelFormat((i * currentYAxisUnits.majorStep) + currentYAxisUnits.minValue));
								
								context.save();
								if(currentYAxisNumber % 2 === 0) {
									labelPainter.setAlignment("right", "top");
									context.translate(currentXPos + currentYAxisUnits.lineWidth / 2 - majorLineLength, currentMajorLineYPos);
								}
								
								else {
									labelPainter.setAlignment("left", "top");
									context.translate(currentXPos + currentYAxisUnits.lineWidth / 2 + majorLineLength, currentMajorLineYPos);
								}
								
								labelPainter.paint(context, this.getWidth(), this.getHeight);
								context.restore();
							}
						}
						
						currentMajorLineYPos -= majorLineDistance;
					}
					
					break;
					
				default:
					break;
			}
			
			currentYAxisNumber += 1;
		}
	}
	
	///////////////////////////////////
	//Now we draw all the datasets.
	///////////////////////////////////

	for(var k in this.dataSets) {
		var currentDataSet = this.dataSets[k];
		var xValues = Object.keys(currentDataSet.points);
		var currentXAxisUnits = this.unitTypes[this.xAxisUnits];
		var currentYAxisUnits = this.unitTypes[currentDataSet.units];

		xValues.map(function(item) {
			return parseInt(item, 10);
		}).sort();
		
		context.beginPath();
		context.lineWidth = this.convertToPixels(currentDataSet.lineWidth, this.getHeight());
		context.strokeStyle = currentDataSet.lineColor;

		for(var i = 0; i < xValues.length; i++) {
			var xPos = currentLeftYAxisWidth + (currentInteriorWidth * ((xValues[i] - currentXAxisUnits.minValue)/(currentXAxisUnits.maxValue - currentXAxisUnits.minValue)));
			var yPos = currentInteriorHeight - (currentInteriorHeight * ((currentDataSet.points[xValues[i]] - currentYAxisUnits.minValue)/(currentYAxisUnits.maxValue - currentYAxisUnits.minValue)));
			
			if(i > 0) {
				context.lineTo(xPos, yPos);
			}
			
			else {
				context.moveTo(xPos, yPos);
			}
		
		}
		
		context.stroke();
		
		for(var i = 0; i < xValues.length; i++) {
			var xPos = currentLeftYAxisWidth + (currentInteriorWidth * ((xValues[i] - currentXAxisUnits.minValue)/(currentXAxisUnits.maxValue - currentXAxisUnits.minValue)));
			var yPos = currentInteriorHeight - (currentInteriorHeight * ((currentDataSet.points[xValues[i]] - currentYAxisUnits.minValue)/(currentYAxisUnits.maxValue - currentYAxisUnits.minValue)));
			
			switch(currentDataSet.pointStyle) {
				case "circle":
					context.beginPath();
					context.arc(xPos, yPos, currentDataSet.pointWidth/2, 0, 2 * Math.PI, false);
					context.fillStyle = currentDataSet.pointColor;
					context.fill();
					break;
					
				case "square":
					context.beginPath();
					context.rect(
						xPos - currentDataSet.pointWidth/2, 
		  				yPos - currentDataSet.pointWidth/2, 
		  				currentDataSet.pointWidth, 
		  				currentDataSet.pointWidth);
					context.fillStyle = currentDataSet.pointColor;
					context.fill();
					break;
					
				case "triangle":
					context.beginPath();
					context.moveTo(xPos - currentDataSet.pointWidth/2, yPos + currentDataSet.pointWidth/2);
					context.lineTo(xPos + currentDataSet.pointWidth/2, yPos + currentDataSet.pointWidth/2);
					context.lineTo(xPos, yPos - currentDataSet.pointWidth/2);
					context.fillStyle = currentDataSet.pointColor;
					context.fill();
					break;
					
				default:
					break;
			}
		}
	}
};