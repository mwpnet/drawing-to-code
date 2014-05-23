var fontInfo = {
		textAlign: {
			left:{
				element: undefined,
				canvas: undefined
			},
			center:{
				element: undefined,
				canvas: undefined
			},
			right:{
				element: undefined,
				canvas: undefined
			},
			start:{
				element: undefined,
				canvas: undefined
			},
			end:{
				element: undefined,
				canvas: undefined
			}
		},
		textBaseline:{
			alphabetic:{
				element: undefined,
				canvas: undefined
			},
			top:{
				element: undefined,
				canvas: undefined
			},
			hanging:{
				element: undefined,
				canvas: undefined
			},
			middle:{
				element: undefined,
				canvas: undefined
			},
			ideographic:{
				element: undefined,
				canvas: undefined
			},
			bottom:{
				element: undefined,
				canvas: undefined
			}
		}

};

/////////////////////////
// button stuff

function initFontProp() {
	fontInfo.textAlign.left.element = document.getElementById('textAlignLeft');
	fontInfo.textAlign.center.element = document.getElementById('textAlignCenter');
	fontInfo.textAlign.right.element = document.getElementById('textAlignRight');
	fontInfo.textAlign.start.element = document.getElementById('textAlignStart');
	fontInfo.textAlign.end.element = document.getElementById('textAlignEnd');

	fontInfo.textBaseline.alphabetic.element = document.getElementById('textBaselineStyleBoxAlphabetic');
	fontInfo.textBaseline.top.element = document.getElementById('textBaselineStyleBoxTop');
	fontInfo.textBaseline.hanging.element = document.getElementById('textBaselineStyleBoxHanging');
	fontInfo.textBaseline.middle.element = document.getElementById('textBaselineStyleBoxMiddle');
	fontInfo.textBaseline.ideographic.element = document.getElementById('textBaselineStyleBoxIdeographic');
	fontInfo.textBaseline.bottom.element = document.getElementById('textAligtextBaselineStyleBoxBottom');

	//fontInfo.lineCapNoneCanvas = lineInfo.lineCapNoneElement.getContext('2d');
	fontInfo.textAlign.left.canvas = fontInfo.textAlign.left.element.getContext('2d');
	fontInfo.textAlign.center.canvas = fontInfo.textAlign.center.element.getContext('2d');
	fontInfo.textAlign.right.canvas = fontInfo.textAlign.right.element.getContext('2d');
	fontInfo.textAlign.start.canvas = fontInfo.textAlign.start.element.getContext('2d');
	fontInfo.textAlign.end.canvas = fontInfo.textAlign.end.element.getContext('2d');

	fontInfo.textBaseline.alphabetic.canvas = fontInfo.textBaseline.alphabetic.element.getContext('2d');
	fontInfo.textBaseline.top.canvas = fontInfo.textBaseline.top.element.getContext('2d');
	fontInfo.textBaseline.hanging.canvas = fontInfo.textBaseline.hanging.element.getContext('2d');
	fontInfo.textBaseline.middle.canvas = fontInfo.textBaseline.middle.element.getContext('2d');
	fontInfo.textBaseline.ideographic.canvas = fontInfo.textBaseline.ideographic.element.getContext('2d');
	fontInfo.textBaseline.bottom.canvas = fontInfo.textBaseline.bottom.element.getContext('2d');

	drawTextAlign(fontInfo.textAlign.left.canvas,"left");
	drawTextAlign(fontInfo.textAlign.center.canvas,"center");
	drawTextAlign(fontInfo.textAlign.right.canvas,"right");
	drawTextAlign(fontInfo.textAlign.start.canvas,"start");
	drawTextAlign(fontInfo.textAlign.end.canvas,"end");

	drawTextBaseline(fontInfo.textBaseline.alphabetic.canvas,"alphabetic");
	drawTextBaseline(fontInfo.textBaseline.top.canvas,"top");
	drawTextBaseline(fontInfo.textBaseline.hanging.canvas,"hanging");
	drawTextBaseline(fontInfo.textBaseline.middle.canvas,"middle");
	drawTextBaseline(fontInfo.textBaseline.ideographic.canvas,"ideographic");
	drawTextBaseline(fontInfo.textBaseline.bottom.canvas,"bottom");

	/**
	 * var lineWidth = getLineWidth();
	lineInfo.lineWidthInput.value=lineWidth;
	
	var miterLimit = getMiterLimit();
	lineInfo.lineMiterLimit.value=miterLimit;
	**/
}

function drawTextAlign(canvas,type){
	canvas.beginPath();

	canvas.moveTo(100,0);
	canvas.lineTo(100,30);
	canvas.moveTo(80,15);
	canvas.lineTo(120,15);
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();

	canvas.strokeStyle="black";
	canvas.textAlign = type;
	canvas.textBaseline = "alphabetic"; 
	canvas.fillText("Text read Left to Right",100,15);
	// add this when start and end are properly supported
	//canvas.fillText("قراءة النص من اليمين إلى اليسار",100,20);
}

function drawTextBaseline(canvas,type){
	canvas.beginPath();

	canvas.moveTo(10,0);
	canvas.lineTo(10,30);
	canvas.moveTo(10,15);
	canvas.lineTo(50,15);
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();

	canvas.strokeStyle="black";
	canvas.textAlign = "start";
	canvas.textBaseline = type; 

	canvas.fillText("Text read Left to Right",10,15);
	// add this when start and end are properly supported
	//canvas.fillText("قراءة النص من اليمين إلى اليسار",100,20);
}


/**********************************************
///////////////////////
// line thickness
function changeLineWidth(){
	var width = lineInfo.lineWidthInput.value;

	setCreateProperty("lineWidth",width,false);
}

function incDecWidth(incDec){

	var width = parseInt( lineInfo.lineWidthInput.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineWidthInput.value = newWidth;

	setCreateProperty("lineWidth",newWidth,false);
}

function getLineWidth(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, "lineWidth");

	var val = 5;

	if( position.start >=0 ){
		val = code.substring(position.start,position.end);
	}
	return val;
}



////////////////
//miter limit
function changeMiterLimit(){
	var width = lineInfo.lineMiterLimit.value;

	setCreateProperty("miterLimit",width,false);
}

function incDecMiter(incDec){

	var width = parseInt( lineInfo.lineMiterLimit.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineMiterLimit.value = newWidth;

	setCreateProperty("miterLimit",newWidth,false);
}

function getMiterLimit(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree,"miterLimit");

	var val = 5;

	if( position.start >=0 ){
		val = code.substring(psition.start,position.end);
	}
	return val;
}


///////////////////////////
//line style
function setCreateProperty(type,value,quote){ // type = lineCap, lineJoin, lilneWidth, miterLimit

	var newVal = value.toString();
	if(quote){
		newVal = "\"" + newVal + "\"";
	}
	
	var code = getCode();
	var newCode = code;

	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, type);

	var newCode = code;
	if( position.start >=0 ){
		newCode = code.substring(0,position.start) + newVal + code.substring(position.end);
	}
	else if(position.lastPathCmd >= 0){
		newCode = code.substring(0,position.lastPathCmd) + "\tcontext." + type + " = " + newVal + ";\n" + code.substring(position.lastPathCmd);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function removeProperty(type){

	var code = getCode();
	var newCode = code;

	var codeTree = acorn.parse( code);

	var position = codeSearch( code, codeTree, type);

	var newCode = code;
	if( position.lineStart >=0 ){
		// the +1 is to try to handle the folowing semi-collen
		newCode = code.substring(0,position.lineStart) + code.substring(position.lineEnd+1);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);
}

///////////////////////////////////////
//
function codeSearch( code, codeTree, identifier){
	
	var position = { 
			lastPathCmd:-1, // the end of the last path command
			identifier: identifier, // the identifier we're looking for
			start:-1, // the start and end of the value to be replaced
			end:-1,
			lineStart:-1,  // the start and end of the line for this identifier
			lineEnd:-1     // used when deleating a line
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: codeSearchCallback
		},undefined,position);

	if(position.start <0){
		//this is from addPathCommand.js
		position.lastPathCmd=getPosToInsertAt(codeTree);
	}
	return position;
}

// goes through the tree finding either the last identifier
// or the position of the last path comand that it should be inserted after.
function codeSearchCallback(node, position){
	
	var identifier = position.identifier;
	
	if(node.type == "AssignmentExpression" && node.operator== "=" && node.left.type == "MemberExpression" ){
		if( node.left.object.name == "context" && node.left.property.name == identifier){
			if(node.right.type == "Literal"){
				position.start = node.right.start;
				position.end = node.right.end;
				
				position.lineStart = node.start;
				position.lineEnd = node.end;
			}
		}
	}
}

function codeExpressionCallback(node, position){
	//find last path command and use that to insert after,
	// unless it's a closePath command, in which case it is inserted before it.
	
	//XXX need to fix this so it handles semicolons and whitespace properly
	if( node.type == "CallExpression"){
		if( node.callee.object.name == "context" && node.callee.property.name != "closePath"){
			position.lastPathCmd = node.end+1;
		}
		
	}
}

*******************************************/
