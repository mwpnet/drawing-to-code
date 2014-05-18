var lineInfo = {};

/////////////////////////
// button stuff

function initLineProp() {
	lineInfo.lineCapNoneElement = document.getElementById('lineCapNone');
	lineInfo.lineCapButtElement = document.getElementById('lineCapButt');
	lineInfo.lineCapRoundElement = document.getElementById('lineCapRound');
	lineInfo.lineCapsquareElement = document.getElementById('lineCapsquare');
	lineInfo.lineJoinNoneElement = document.getElementById('lineJoinNone');
	lineInfo.lineJoinBevelElement = document.getElementById('lineJoinBevel');
	lineInfo.lineJoinRoundElement = document.getElementById('lineJoinRound');
	lineInfo.lineJoinMiterElement = document.getElementById('lineJoinMiter');

	//lineInfo.lineCapNoneCanvas = lineInfo.lineCapNoneElement.getContext('2d');
	lineInfo.lineCapButtCanvas = lineInfo.lineCapButtElement.getContext('2d');
	lineInfo.lineCapRoundCanvas = lineInfo.lineCapRoundElement.getContext('2d');
	lineInfo.lineCapsquareCanvas = lineInfo.lineCapsquareElement.getContext('2d');
	//lineInfo.lineJoinNoneCanvas = lineInfo.lineJoinNoneElementgetContext('2d');
	lineInfo.lineJoinBevelCanvas = lineInfo.lineJoinBevelElement.getContext('2d');
	lineInfo.lineJoinRoundCanvas = lineInfo.lineJoinRoundElement.getContext('2d');
	lineInfo.lineJoinMiterCanvas = lineInfo.lineJoinMiterElement.getContext('2d');
	
	lineInfo.lineWidthInput = document.getElementById('lineWidthInput');
	lineInfo.lineMiterLimit = document.getElementById('miterLimitInput');

	var width = 15; //XXX
	drawLineCap(lineInfo.lineCapButtCanvas,"butt",width);
	drawLineCap(lineInfo.lineCapRoundCanvas,"round",width);
	drawLineCap(lineInfo.lineCapsquareCanvas,"square",width);
	
	drawLineJoin(lineInfo.lineJoinBevelCanvas,"bevel",width);
	drawLineJoin(lineInfo.lineJoinRoundCanvas,"round",width);
	drawLineJoin(lineInfo.lineJoinMiterCanvas,"miter",width);
	
	var lineWidth = getLineWidth();
	lineInfo.lineWidthInput.value=lineWidth;
	
	var miterLimit = getMiterLimit();
	lineInfo.lineMiterLimit.value=miterLimit;
	
}

function drawLineCap(canvas,type,width){
	canvas.beginPath();

	canvas.moveTo(0,25);
	canvas.lineTo(60,25);
	canvas.lineCap=type;
	canvas.lineWidth=width;
	canvas.strokeStyle="black";
	canvas.stroke();

	canvas.beginPath();

	canvas.moveTo(0,25);
	canvas.lineTo(60,25);
	canvas.lineCap=type;
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();
}

function drawLineJoin(canvas,type,width,limit){
	canvas.beginPath();

	canvas.moveTo(0,0);
	canvas.lineTo(60,25);
	canvas.lineTo(0,50);
	canvas.lineJoin=type;
	canvas.lineWidth=width;
	canvas.strokeStyle="black";
	canvas.stroke();

	canvas.beginPath();

	canvas.moveTo(0,0);
	canvas.lineTo(60,25);
	canvas.lineTo(0,50);
	canvas.lineJoin=type;
	canvas.lineWidth=1;
	canvas.strokeStyle="red";
	canvas.stroke();
}



///////////////////////
// line thickness
function changeLineWidth(){
	var width = lineInfo.lineWidthInput.value;

	generalLineStyleCode("lineWidth",width,false);
}

function incDecWidth(incDec){

	var width = parseInt( lineInfo.lineWidthInput.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineWidthInput.value = newWidth;

	generalLineStyleCode("lineWidth",newWidth,false);
}

function getLineWidth(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = findAssignment( code, codeTree, "lineWidth");

	var val = 5;
	if( position.valuePart != undefined ){
		val = position.value;
	}
	return val;
}



////////////////
//miter limit
function changeMiterLimit(){
	var width = lineInfo.lineMiterLimit.value;

	generalLineStyleCode("miterLimit",width,false);
}

function incDecMiter(incDec){

	var width = parseInt( lineInfo.lineMiterLimit.value );
	var newWidth = width + incDec;
	if(newWidth<1){
		newWidth=1;
	}
	lineInfo.lineMiterLimit.value = newWidth;

	generalLineStyleCode("miterLimit",newWidth,false);
}

function getMiterLimit(){

	var code = getCode();
	var codeTree = acorn.parse( code);

	var position = findAssignment( code, codeTree,"miterLimit");

	var val = 5;

	if( position.valuePart != undefined ){
		val = position.value;
	}
	return val;
}


///////////////////////////
//line style
function generalLineStyleCode(type,value,quote){ // type = lineCap, lineJoin, lilneWidth, miterLimit

	var newVal = value.toString();
	if(quote){
		newVal = "\"" + newVal + "\"";
	}
	
	var code = getCode();

	var codeTree = acorn.parse( code);

	var position = findAssignment( code, codeTree, type);

	var newCode = code;
	
	if( position.rawValue != undefined ){
		newCode = code.substring(0,position.rawValue.start) + newVal + code.substring(position.rawValue.end);
	}
	else {
		var position2 = { 
				secondToLastDrawItem: undefined,
				lastDrawItem: undefined,
				lastNoneDrawItem: undefined
				};

		acorn.walk.simple( codeTree, {
			CallExpression: findLastTwoDrawItemsCallback
			},undefined,position2);
		newCode = code.substring(0,position2.lastDrawItem.start) + "\tcontext." + type + " = " + newVal + ";\n" + code.substring(position2.lastDrawItem.start);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);

}

function clearLineStyleLine(type){

	var code = getCode();

	var codeTree = acorn.parse( code);

	var position = findAssignment( code, codeTree, type);

	var newCode = code;
	if( position.lineStart >=0 ){
		// the +1 is to try to handle the folowing semi-collen
		newCode = code.substring(0,position.assignment.start) + code.substring(position.assignment.end+1);
	}

	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, codeTree,-1,-1);
}

///////////////////////////////////////
//
function findAssignment( code, codeTree, identifier){ //codeSearch
	
	var position = { 
			identifier: identifier, // the identifier we're looking for
			assignment: undefined,
			valuePart: undefined,
			};

	acorn.walk.simple( codeTree, {
		AssignmentExpression: findAssignmentCallBack
		},undefined,position);

	return position;
}

