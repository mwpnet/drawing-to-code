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
	return getProperty( "lineWidth", 5);
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
	return getProperty( "miterLimit", 5);
}

