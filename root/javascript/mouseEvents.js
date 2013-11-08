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
 * mouseEvents.js
 * 
 * all mouse events on the canvas are 
 * handled here.
 */


///////////////////////////////////////
// the globals needed to hold some info
// between animation events.
var keepAnimating = false;
var mousex = 0;
var mousey = 0;

///////////////////////////////////////
// kludge used because different 
// browsers have different 
// implementation of the 
// requestAnimationFrame method
window.requestAnimFrame = (function(callback) {
	return	window.requestAnimationFrame || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame || 
			window.oRequestAnimationFrame || 
			window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
})();

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout;
} )();



////////////////////////////////////
// on click on control handle:
//		draws lines from code in textarea
//		draws line ends and control points
//		get which line end or control point mouse is in
//		find which code line and which args that coresponds to
//
// on click elsewhere:
//		get relative coords from mouse click
//		add line with selelcted command and new coords
//		draws lines from code in textarea
//		draws line ends and control points

function myOnMouseDown(e) {
	
	var mousex = e.pageX - canvas.offsetLeft;
	var mousey = e.pageY - canvas.offsetTop;

	var code = getCode();
	var codeLines = parseCode(code);
	
	context.clearRect(0, 0, canvas.width, canvas.height);

	var moveInfo = drawEditHandles( context, codeLines,mousex,mousey );

	if( typeof(moveInfo) == 'undefined' ){ // click not in controle handle
		moveInfo = addComandToCode(codeLines,state.xOld,state.yOld,mousex,mousey,state);

		codeLines.splice(moveInfo.codeLineBeingReferenced,0,moveInfo.newCodeLine);
		updateCode(rejoinCode(codeLines));
	}

	state.codeLineBeingReferenced = moveInfo.codeLineBeingReferenced;
	state.destArgs = moveInfo.destArgs;
	state.srcArgs = moveInfo.srcArgs;
	state.type = moveInfo.type;
	state.xOld=moveInfo.xOld;
	state.yOld=moveInfo.yOld;
	console.debug(state.xOld,state.yOld);

	// 
	if( moveInfo.type == "truefalse" ){
		var newCodeLines = updateCodeLineOnce(codeLines,[],state);
		var newCode = rejoinCode(newCodeLines);
		updateCode(newCode);
	}
	
	requestAnimFrame( myAnimate);
	keepAnimating=true;
}

///////////////////////////////////////
// stop animating when mouse released
function myOnMouseUp(e){
	keepAnimating = false;
}

///////////////////////////////////////
// update mouse position relative to 
// the canvas when mouse is moved.
function myOnMouseMove(e){
	mousex = e.pageX - canvas.offsetLeft;
	mousey = e.pageY - canvas.offsetTop;
}

///////////////////////////////////////
// does the actual animation
// updates the coresponding code line, 
// redraws the code, and checks to see 
// if it should keep animating.
function myAnimate(e){

	var code = getCode();
	var codeLines = parseCode(code);
	
	
	var newCodeLines = updateCodeLine( codeLines, [ mousex, mousey ],state);
	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );
	
	drawEditHandles( context, newCodeLines );


	////////////
	if( keepAnimating){
		requestAnimFrame( myAnimate);
	}
	else {
		state.destArgs = undefined;
		state.srcArgs = undefined;
		state.type = undefined;
	}
}

