
/*
 * can be:
 * 		MoveTo
 * 		LineTo
 * 		BezierCurveTo
 * 		QuadraticCurveTo
 * 		ClosePath
 */

var keepAnimating = false;

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
        clearTimeout
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
	var code = getCode();
	var codeLines = parseCode(code);
	
	context.clearRect(0, 0, canvas.width, canvas.height);

	var moveInfo = drawEditHandles( context, codeLines );

	if( typeof(moveInfo) == 'undefined' ){
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		
		moveInfo = addComandToCode(codeLines,state.xOld,state.yOld,x,y);

		codeLines.splice(moveInfo.codeLineBeingReferenced,0,moveInfo.newCodeLine);
		updateCode(rejoinCode(codeLines));
	}
	else {

		var newCodeLines = updateCodeLineOnce(codeLines,[]);
		var newCode = rejoinCode(newCodeLines);
		updateCode(newCode);
	}

	state.codeLineBeingReferenced = moveInfo.codeLineBeingReferenced;
	state.destArgs = moveInfo.destArgs;
	state.srcArgs = moveInfo.srcArgs;
	state.type = moveInfo.type;
	state.flipped = false;
	state.xOld=moveInfo.xOld;
	state.yOld=moveInfo.yOld;

	// 
	requestAnimFrame( myAnimate);
	keepAnimating=true;
}

function myOnMouseUp(e){
	keepAnimating = false;
}

function myOnMouseMove(e){
	state.mouseX = e.pageX - canvas.offsetLeft;
	state.mouseY = e.pageY - canvas.offsetTop;
}

//get mouse coords
//update coresponding args on coresponding code line
//draws lines from code in textarea
//draws line ends and control points

function myAnimate(e){

	var code = getCode();
	var codeLines = parseCode(code);
	
	
	var newCodeLines = updateCodeLine( codeLines, [ state.mouseX, state.mouseY ]);
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
		state.flipped = false;
	}
}

