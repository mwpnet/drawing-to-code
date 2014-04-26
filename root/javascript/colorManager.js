

// there are three bars, one square, and text input
// if one of the bars is clicked, the new value is retrieved, and the square and text input are updated.
// if the text area has a 




var strokeRe = /^(\s*context\.strokeStyle\s*=\s*\")(#[a-zA-Z0-9]{6})(\"\s*;\s*)$/;
function getStrokeStyle(){
	var code = getCode();
	var codeLines = parseCode(code);
	
	var pos = codeSearch( codeLines, strokeRe);
	if(pos>=0){
		var arr = strokeRe.exec(codeLines[pos]);
		return arr[2];
	}
}


function updateStrokeStyle(color){
	
	var code = getCode();
	var codeLines = parseCode(code);
	
	var newCodeLines = updateStyleCodeLine( codeLines, color, strokeRe);

	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );

}

var fillRe = /^(\s*context\.fillStyle\s*=\s*\")(#[a-zA-Z0-9]{6})(\"\s*;\s*)$/;
function getFillStyle(){
	var code = getCode();
	var codeLines = parseCode(code);
	
	var pos = codeSearch( codeLines, fillRe);
	if(pos>=0){
		var arr = fillRe.exec(codeLines[pos]);
		return arr[2];
	}
}


function updateFillStyle(color){
	
	var code = getCode();
	var codeLines = parseCode(code);
	
	var newCodeLines = updateStyleCodeLine( codeLines, color, fillRe);

	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );

}

function updateStyleCodeLine( codeLines, newVal, re ){
	
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


function initColor(context, canvas){
	var strokeCB = new colorBars(500,25,getStrokeStyle(),updateStrokeStyle);
	var fillCB = new colorBars(500,25,getFillStyle(),updateFillStyle);

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

