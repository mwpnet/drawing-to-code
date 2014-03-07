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

	onExecuteCode();
	
	showButton = document.getElementById('showHandls');
	showButton.onclick = showControlHandles;
	hideButton = document.getElementById('hideHandls');
	hideButton.onclick = hideControlHandles;
	
	initLineProp();
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
	return codeBlock.value;
}

///////////////////////////////////////
// update the code in the input box
function updateCode(newCode){
	if(newCode != null){
		codeBlock.value = newCode;
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
        context.clearRect(0, 0, canvas.width, canvas.height);
		draw(context);
	}
	catch(err){
		document.getElementById('errorBox').innerHTML = err.message;
	}

}

///////////////////////////////////////
// clears the canvas and draws all the 
// various bits.
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


