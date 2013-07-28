/////////////////////
// yes globals are bad

var global = {
		lineBeingChangedIndex:0,
		argsIndex:NaN,
		mouseX:0,
		mouseY:0,
		mouseInHandle:false,
		command:"",
		xOld:0,
		yOld:0
		};


var canvas;
var context;
var preCode;
var codeBlock;
var postCode;

////////////////////////////////////
function init(){
	
	buttonSetUp();
	
	canvas = document.getElementById('editDrawing');
	context = canvas.getContext('2d');
	//precode = document.getElementById('preCode').innerHTML
	codeBlock = document.getElementById('code');
	//postCode = document.getElementById('postCode').innerHTML
	
	canvas.onmousedown = myOnMouseDown;
	canvas.onmouseup = myOnMouseUp;
	canvas.onmousemove = myOnMouseMove;

	onExecuteCode();
}
////////////////////////////////
////////////////////////////////
function getCode(){
	return codeBlock.value;
}

function updateCode(newCode){
	if(newCode != null){
		codeBlock.value = newCode;
	}
}

function drawCode( code ){
	delete draw;

	document.getElementById('errorBox').innerHTML = "";
	try {
		eval( code );
        context.clearRect(0, 0, canvas.width, canvas.height);
		draw(context);
	}
	catch(err){
		document.getElementById('errorBox').innerHTML = err.message;
	}

}

function onExecuteCode(){
	var code = getCode();
	
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'red';

	drawCode( code );
	var codeLines = parseCode(code);
	drawEditHandles( context, codeLines );
	return false;
}


