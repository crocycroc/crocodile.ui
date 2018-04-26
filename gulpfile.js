var fs = require('fs');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var gulpUtil = require('gulp-util');
var htmlparser = require("htmlparser");
var path = require('path');

var indexHtml = "./index.html";
var indexScriptRegEx = new RegExp('(?=^./src/([^/]+).js$)');

function convertDomToHTML(dom) {

	if(dom === undefined || dom.length === undefined) {
		return '';
	}
	
	var output = '';
	
	for(var i = 0; i < dom.length; i++) {
	
		var entry = dom[i];
		
		if(entry.type === 'text') {
			output += entry.raw;
		}
		
		else if(entry.type === 'comment') {
			output += `<!--${entry.raw}-->`;
		}
		
		else if(entry.type === 'directive') {
			output += `<${entry.raw}>`;
		}
		
		else if(entry.type === 'script') {
			if(entry.children) {
				output += `<${entry.raw}>`;
				
				output += convertDomToHTML(entry.children);

				output += `</${entry.name}>`;
			}
			
			else {
				output += `<${entry.raw}></${entry.name}>`;
			}
		}
		
		else if(entry.type === 'tag') {
			if(entry.children) {
				output += `<${entry.raw}>`;
				
				output += convertDomToHTML(entry.children);

				output += `</${entry.name}>`;
			}
			
			else {
				if(entry.raw.trim().endsWith('/')) {
					output += `<${entry.raw}>`;
				}
				
				else {
					output += `<${entry.raw}></${entry.name}>`;
				}
			}
		}
		
	}
	
	return output;
	
}

function minifyHtmlScripts(fileName, scriptFileName, pathRegEx) {
	var handler = new htmlparser.DefaultHandler(function (error, dom) {});
		
	var parser = new htmlparser.Parser(handler);
	parser.parseComplete(fs.readFileSync(fileName));

	var htmlEntry = null;
	var headEntry = null;
	
	for(var i = 0; i < handler.dom.length; i++) {
		
		if(handler.dom[i].name === 'html') {
			htmlEntry = handler.dom[i];
			break;
		}
		
	}
	
	for(var i = 0; i < htmlEntry.children.length; i++) {
		if(htmlEntry.children[i].name === 'head') {
			headEntry = htmlEntry.children[i];
			break;
		}
	}
	
	var jsList = [];
	
	var newChildren = [];
	
	for(var i = 0; i < headEntry.children.length; i++) {
		var currentEntry = headEntry.children[i];
		
		if(currentEntry.type === 'script') {
			
			if(pathRegEx.test(currentEntry.attribs.src)) {
				jsList.push(path.dirname(fileName) + '/' + currentEntry.attribs.src);
			}
			
			else {
				newChildren.push(currentEntry);
			}
		}
			
		else {
			newChildren.push(currentEntry);
		}
	}
	
	newChildren.push({
	"raw": "\n\t",
	"data": "\n\t",
	"type": "text"
	});
	
	newChildren.push({
		"raw": `script src=\"./${scriptFileName}\"`,
		"data": `script src=\"./${scriptFileName}\"`,
		"type": "script",
		"name": "script",
		"attribs": {
			"src": `${scriptFileName}`
		}
	});
	
	newChildren.push({
	"raw": "\n\t",
	"data": "\n\t",
	"type": "text"
	});
	
	headEntry.children = newChildren;
	
	fs.writeFileSync(path.resolve('./', fileName.replace('.html', '.min.html')), convertDomToHTML(handler.dom), 'utf-8');
	
	gulp.src(jsList)
		.pipe(concat(`./${scriptFileName}`))
		.pipe(uglify({ compress: false, mangle: false }).on('error', gulpUtil.log))
		.pipe(gulp.dest('./'));
		
	return;
}

gulp.task('clientJS', function () {
	minifyHtmlScripts(indexHtml, 'crocodile.ui.min.js', indexScriptRegEx);
});

gulp.task('watch', function () {
    gulp.watch(atmospherePlatformClientJS, ['clientJS']);
});

gulp.task('default', [ 'clientJS' ]);
