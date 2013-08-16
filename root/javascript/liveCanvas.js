/////////////////////

var state = {
		codeLineBeingReferenced:0,
		destArgs:undefined,
		srcArgs:undefined,
		type:"line",
		mouseX:0,
		mouseY:0,
		mouseInHandle:false,
		command:"",
		xOld:0,
		yOld:0,
		flipped:false
		
		/////////////////////////////
		
		};


var canvas;
var context;
var preCode;
var codeBlock;
var postCode;

var showHandles = true;
var showButton;
var hideButton;

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
	
	showButton = document.getElementById('showHandls');
	showButton.onclick = showControlHandles;
	hideButton = document.getElementById('hideHandls');
	hideButton.onclick = hideControlHandles;
}

function hideControlHandles(e){
	showButton.style.display = "block";
	hideButton.style.display = "none";
	showHandles = false;
	canvas.onmousedown = undefined;
	canvas.onmouseup = undefined;
	canvas.onmousemove = undefined;
	onExecuteCode();
}
function showControlHandles(e){
	showButton.style.display = "none";
	hideButton.style.display = "block";
	showHandles = true;
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
	if(showHandles){
		var codeLines = parseCode(code);
		drawEditHandles( context, codeLines );
	}
	return false;
}


