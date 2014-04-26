

// there are three bars, one square, and text input
// if one of the bars is clicked, the new valueis retrieved, and the square and text input are updated.
// if the text area has a 


// for RGB

function placeholder(){}

var strokeCB = new colorBars(500,25,placeholder);
var fillCB = new colorBars(500,25,placeholder);

var colorGroup = {
		red:{
			start: "#000000",
			end:   "#FF0000"
		},
		green:{
			start: "#000000",
			end:   "#00FF00"
		},
		blue:{
			start: "#000000",
			end:   "#0000FF"
		}
};

console.debug(strokeCB.bar.red);

function initColor(context, canvas){
	
	document.getElementById('strokeColorInput').appendChild(strokeCB.cssInput);
	document.getElementById('strokeColorInput').appendChild(strokeCB.previewBoxElement);
	document.getElementById('redStroke').appendChild(strokeCB.bar.red.element);
	document.getElementById('redStroke').appendChild(strokeCB.bar.red.textBox);
	document.getElementById('greenStroke').appendChild(strokeCB.bar.green.element);
	document.getElementById('greenStroke').appendChild(strokeCB.bar.green.textBox);
	document.getElementById('blueStroke').appendChild(strokeCB.bar.blue.element);
	document.getElementById('blueStroke').appendChild(strokeCB.bar.blue.textBox);
	
	document.getElementById('fillColorInput').appendChild(fillCB.cssInput);
	document.getElementById('fillColorInput').appendChild(fillCB.previewBoxElement);
	document.getElementById('redFill').appendChild(fillCB.bar.red.element);
	document.getElementById('redFill').appendChild(fillCB.bar.red.textBox);
	document.getElementById('greenFill').appendChild(fillCB.bar.green.element);
	document.getElementById('greenFill').appendChild(fillCB.bar.green.textBox);
	document.getElementById('blueFill').appendChild(fillCB.bar.blue.element);
	document.getElementById('blueFill').appendChild(fillCB.bar.blue.textBox);
}



function getStrokeStyle(codeLines){
	var re = /^(\s*context\.strokeStyle\s*=\s*\"?)([a-zA-Z0-9]+)(\"?\s*;\s*)$/;

	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		return arr[2];
	}
}


function updateStrokeStyle(colorIndex,colorHex){
	
	var code = getCode();
	var codeLines = parseCode(code);
	
	
	var newCodeLines = udateStrokeStyleCodeLine( codeLines, [ mousex, mousey ],state);

	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );

}

function udateStrokeStyleCodeLine( codeLines, newVal ){
	var re = /^(\s*context\.strokeStyle\s*=\s*\")([a-zA-Z0-9]+)(\"\s*;\s*)$/;
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}
		
	codeLines.splice(-pos,0,"\tcontext.strokeStyle = \""+newVal+"\";");

	return codeLines;
}





function udateColorCodeLine(codeLines,colorHex){
	
}