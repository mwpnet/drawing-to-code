

// there are three bars, one square, and text input
// if one of the bars is clicked, the new value is retrieved, and the square and text input are updated.
// if the text area has a 



var strokeCB;
var fillCB;
function initColor(context, canvas){
	strokeCB = new colorBars(500,25,getStrokeStyle,updateStrokeStyle);
	fillCB = new colorBars(500,25,getFillStyle,updateFillStyle);

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


var strokeRe = /^(\s*context\.strokeStyle\s*=\s*\")(#[a-zA-Z0-9]{6}|[a-zA-Z]+)(\"\s*;\s*)$/;
function getStrokeStyle(){
	var code = getCode();
	var codeTree = acorn.parse( code);
	
	var position = codeSearch( code, codeTree, "strokeStyle");

	var val = "#000000";

	if( position.start >=0 ){
		val = code.substring(position.start,position.end);
	}
	return val;
}


function updateStrokeStyle(color){
	generalLineStyleCode("strokeStyle",color,true);
}

var fillRe = /^(\s*context\.fillStyle\s*=\s*\")(#[a-zA-Z0-9]{6}|[a-zA-Z]+)(\"\s*;\s*)$/;

function getFillStyle(){
	var code = getCode();
	var codeTree = acorn.parse( code);
	
	var position = codeSearch( code, codeTree, "fillStyle");

	var val = "#000000";

	if( position.start >=0 ){
		val = code.substring(position.start,position.end);
	}
	return val;
}

function updateFillStyle(color){
	generalLineStyleCode("fillStyle",color,true);
}

/**
function updateStyleCodeLine( codeLines, style, newVal, re ){
	
	var pos = codeSearch( codeLines, re);
	if(pos>=0){
		var arr = re.exec(codeLines[pos]);
		codeLines[pos] = arr[1]+newVal+arr[3];
		return codeLines;
	}
		
	codeLines.splice(-pos,0,"\tcontext." + style + "Style = \""+newVal+"\";");

	return codeLines;
}
**/


