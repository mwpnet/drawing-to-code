/** Copyright 2013 Martyn Peck (mwp@mwpnet.com) **/

/**    This file is part of drawing-to-code.									**/
/**																				**/
/**    drawing-to-code is free software: you can redistribute it and/or modify	**/
/**    it under the terms of the GNU General Public License as published by		**/
/**    the Free Software Foundation, either version 3 of the License, or		**/
/**    (at your option) any later version.										**/
/**																				**/
/**    drawing-to-code is distributed in the hope that it will be useful,		**/
/**    but WITHOUT ANY WARRANTY; without even the implied warranty of			**/
/**    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the			**/
/**    GNU General Public License for more details.								**/
/**																				**/
/**    You should have received a copy of the GNU General Public License		**/
/**    along with drawing-to-code.  If not, see <http://www.gnu.org/licenses/>.	**/


/**************************************
 * lineCanvas.js
 * 
 * this holds the parts that does all 
 * the basic drawing 
 */


///////////////////////////////////////
// global used to store information for
// various functions.
// XXX -  need to find some way to do 
// all these things without using a 
// global like this.
var state = {
		destArgs:undefined, // - the arguments to change when moving mouse
		srcArgs:undefined,  // - the arguments to use to compute new coords
		type:"line",        // - control handle type being held
		mouseX:0,
		mouseY:0,
		mouseInHandle:false,// - if mouse is in control handle
		command:"",         // - the command curantly selected by the buttons
		xOld:0,             // - land end point x
		yOld:0,             // -                y
		arguments:[],       // - node array for the existing arguments
		code:"",            // - string of the code
		codeTree:[],        // - the parsed code tree
		};

///////////////////////////////////////
// some globals used to hold the 
// corresponding Dom objects, so the 
// animation doesn't have to search for
// them every single frame.
var canvas;
var context;
var preCode;
var codeBlock;
var postCode;

var showHandles = true;
var showButton;
var hideButton;

var editor;
var delay;

///////////////////////////////////////
// initalizes all the various bits and 
// pieces of all the code.
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

    editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'text/javascript'
      });
    editor.on("change", function() {
        clearTimeout(delay);
        delay = setTimeout(onExecuteCode, 500);
     });

	showButton = document.getElementById('showHandls');
	showButton.onclick = showControlHandles;
	hideButton = document.getElementById('hideHandls');
	hideButton.onclick = hideControlHandles;
	initColor(context, canvas );
	initLineProp();
	initFillStrokeProp();
	initFontProp();
	initShadowProp();
}

///////////////////////////////////////
// hide the control handles and suspend
// mouse actions, so only the raw image
// is shown.
function hideControlHandles(e){
	showButton.style.display = "block";
	hideButton.style.display = "none";
	showHandles = false;
	canvas.onmousedown = undefined;
	canvas.onmouseup = undefined;
	canvas.onmousemove = undefined;
	onExecuteCode();
}

///////////////////////////////////////
// show the control handles and 
// reactivate mouse actions.
function showControlHandles(e){
	showButton.style.display = "none";
	hideButton.style.display = "block";
	showHandles = true;
	canvas.onmousedown = myOnMouseDown;
	canvas.onmouseup = myOnMouseUp;
	canvas.onmousemove = myOnMouseMove;
	onExecuteCode();
}

///////////////////////////////////////
// gets the code from the input box
function getCode(){
	return editor.getValue();
}

///////////////////////////////////////
// update the code in the input box
function updateCode(newCode){
	if(newCode != null){
		editor.setValue(newCode);
	}
}

function updateCode2(moveInfo){
	/**var moveInfo = {
			destArgs: argsIndex,
			srcArgs: argsIndex,
			type: "line",
			xOld: x2,
			yOld: y2,
			
			newCode: newcode,
			newCodeLine: myNewCodeLine,
			insertAt: insertAt
	};**/

	
	
	if(moveInfo.newCodeLine != null){
		var newLinePosPair = editor.posFromIndex( moveInfo.insertAt );
		
		editor.replaceRange( moveInfo.newCodeLine, newLinePosPair);
		//editor.setCursor(newLinePosPair);
	}
}

function updateCodeLineOnce(moveInfo){
	if(moveInfo.newVal != null){
		var startPair = editor.posFromIndex( moveInfo.start );
		var endPair = editor.posFromIndex( moveInfo.end );

		editor.replaceRange( moveInfo.newVal.toString(), startPair, endPair );
	}
}

function updateCodeLineMulti(code, moveInfo){
	if(moveInfo.length != 0){
		for(var i=0; i<moveInfo.length; i++){
			
			code = code.substring(0,moveInfo[i].start) + moveInfo[i].newVal.toString() + code.substring(moveInfo[i].end);
			editor.setValue( code );
		}
	}
}

///////////////////////////////////////
// draws the code given in the input 
// box. Does some basic error catching
function drawCode( code ){
	delete draw;

	document.getElementById('errorBox').innerHTML = "";
	try {
		eval( code );
	}
	catch(err){
		document.getElementById('errorBox').innerHTML = err.message;
	}
    context.clearRect(0, 0, canvas.width, canvas.height);

	draw(context);

}

///////////////////////////////////////
// clears the canvas and draws all the 
// various bits.
function onExecuteCode(){
	var code = getCode();
	
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'red';

	drawCode( code );

	
	var code = getCode();

	var codeTree = acorn.parse( code);

    /**  -- put in the try/catch later
    try {
    	codeTree = esprima.parse(code, options);
    } catch (e) {
        str = e.name + ': ' + e.message;
		document.getElementById('errorBox').innerHTML = str;
		keepAnimating=false;
		return;
   }
     **/
	
	if(showHandles){
		drawEditHandles( context, codeTree,mousex,mousey );
	}
	strokeCB.updateBars( getStrokeStyle() );
	fillCB.updateBars( getFillStyle() );
	return false;
}

function codeAnimate(){
	var code = getCode();
	var codeLines = parseCode(code);
	
	drawEditHandles( context, codeLines );


}
