
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

	drawEditHandles( context, codeLines );

	////////////
	if( ! global.mouseInHandle ) {
		
		var codeLine = global.lineBeingChangedIndex;
		var argIndex = global.argsIndex;
		
		var x = e.pageX - canvas.offsetLeft;
		var y = e.pageY - canvas.offsetTop;
		
		var newCodeLines = addComandToCode(codeLines,global.xOld,global.yOld,x,y);
		updateCode(rejoinCode(newCodeLines));
		global.xOld=x;
		global.yOld=y;
		global.mouseInHandle = true;
	}

	// 
	requestAnimFrame( myAnimate);
	keepAnimating=true;
}

function myOnMouseUp(e){
	keepAnimating=false;
}

function myOnMouseMove(e){
	global.mouseX = e.pageX - canvas.offsetLeft;
	global.mouseY = e.pageY - canvas.offsetTop;
}

//get mouse coords
//update coresponding args on coresponding code line
//draws lines from code in textarea
//draws line ends and control points

function myAnimate(e){

	var code = getCode();
	var codeLines = parseCode(code);


	var newCodeLines = updateCodeLine( codeLines, [global.mouseX,global.mouseY] );
	
	var newCode = rejoinCode(newCodeLines);
	updateCode(newCode);
	drawCode( newCode );

	drawEditHandles( context, newCodeLines );
	
	////////////
	if( keepAnimating){
		requestAnimFrame( myAnimate);
	}
	else {
		global.mouseInHandle = false;
	}
}

