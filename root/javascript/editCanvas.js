/********************************************
 * functions to draw path handles
 *******************************************/


/***********************************
 * the functions that draw the actual 
 * shapes representing the path and 
 * control handle. Also checks to see 
 * if the mouse is in the shape being 
 * drawn
 */

// draw a box at x,y
// for marking ends of path segments
// also checks if mouse pointer is in it
function drawPathBox(context,x,y) {
	var size=10.0;
	context.save();
	context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
    context.moveTo(x-size/2.0, y-size/2.0);
    context.lineTo(x-size/2.0, y+size/2.0);
    context.lineTo(x+size/2.0, y+size/2.0);
    context.lineTo(x+size/2.0, y-size/2.0);
	context.closePath();
	var mouseIn = context.isPointInPath(global.mouseX,global.mouseY);
	context.stroke();
	context.restore();
	
	return mouseIn;
}

// draw a circle at x,y
// for marking control points
// also checks if mouse pointer is in it
function drawControlePointHandle( context,cx,cy){
	var size=10.0;
	context.save();
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.moveTo(cx+size/2.0,cy);
	context.arc(cx, cy, size/2.0, 0, 2.0 * Math.PI, false);
	var mouseIn = context.isPointInPath(global.mouseX,global.mouseY);
	context.stroke();
	context.restore();
	return mouseIn;
}

//draw an X at x,y
// only used for marking
//no mouse detection
function drawPathX( context,cx,cy){
	var size=10.0;
	context.save();
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.moveTo(x-size/2.0, y-size/2.0);
	context.lineTo(x+size/2.0, y+size/2.0);
	context.moveTo(x-size/2.0, y+size/2.0);
	context.lineTo(x+size/2.0, y-size/2.0);
	context.stroke();
	context.restore();
	
	return false;
}

//draw a line from x,y to cx,cy
// for drawing lines from the end of paths 
// to control points
function drawLinesToConreolePoints(context,cx,cy,x,y){
	context.save();
	context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
	context.moveTo(x,y);
	context.lineTo(cx,cy);
	context.stroke();
	context.restore();
}

/***********************************
 * functions to draw the path and control handles.
 * If the mouse pointer is in any of the handles,
 * the the index of the arguments for those args
 * is returned.
 */

// draw the handles from moveTo()
function drawMoveTo(context,x,y){
	var mouseInBox = drawPathBox(context,x,y);

	if(mouseInBox){
		return [0,1];
	}
	return NaN;
}

//draw the handles from lineTo()
function drawLineTo(context,x,y){
	var mouseInBox = drawPathBox(context,x,y);

	if(mouseInBox){
		return [0,1];
	}
	return NaN;
}

//draw the handles from bezierCurveTo()
function drawBezierCurveTo(context,xold,yold,cx1,cy1,cx2,cy2,x,y) {
	var mouseInBox = drawPathBox(context,x,y);

	drawLinesToConreolePoints(context,cx1,cy1,xold,yold);
	var mouseInHandle1 = drawControlePointHandle(context,cx1,cy1);

	drawLinesToConreolePoints(context,cx2,cy2,x,y);
	var mouseInHandle2 = drawControlePointHandle(context,cx2,cy2);
	
	if(mouseInBox){
		return [4,5];
	}
	else if(mouseInHandle1){
		return [0,1];
	}
	else if(mouseInHandle2){
		return [2,3];
	}
	return NaN;
}


//draw the handles from quadraticCurveTo()
function drawQuadraticCurveTo(context,xold,yold,cx,cy,x,y) {
	var mouseInBox = drawPathBox(context,x,y);

	drawLinesToConreolePoints(context,cx,cy,xold,yold);
	drawLinesToConreolePoints(context,cx,cy,x,y);
	var mouseInHandle = drawControlePointHandle(context,cx,cy);
	
	if(mouseInBox){
		return [2,3];
	}
	else if(mouseInHandle){
		return [0,1];
	}
	return NaN;
}

/***********************************/
/***********************************/

function drawEditHandles( context, codeLines ){
	var xold=0.0;
	var yold=0.0;
	
	var lineBeingChanged;
	var argsIndex = NaN;
	
	var anyTrue = false;
	
	for( var i=0, l=codeLines.length; i<l; i++){
		
		var lineparts = parseCodeLine(codeLines[i]);
		if( lineparts == null){
			continue;
		}
		var args = lineparts[1];
		if( args == null){
			continue;
		}

		if( lineparts[0].match( /\b(?:moveTo)\b/ )){
			argsIndex = drawMoveTo( context, args[0], args[1] );
			xold=args[0];
			yold=args[1];
		}
		else if(lineparts[0].match( /\b(?:lineTo)\b/ )){
			argsIndex = drawLineTo( context, args[0], args[1] );
			xold=args[0];
			yold=args[1];
		}
		else if(lineparts[0].match( /\b(?:bezierCurveTo)\b/ )){
			argsIndex = drawBezierCurveTo( context, xold,yold,args[0], args[1], args[2], args[3], args[4], args[5] );
			xold=args[4];
			yold=args[5];
		}
		else if(lineparts[0].match( /\b(?:quadraticCurveTo)\b/ )){
			argsIndex = drawQuadraticCurveTo( context, xold,yold,args[0], args[1], args[2], args[3] );
			xold=args[2];
			yold=args[3];
		}
		else{
			argsIndex = undefined;
		}
		
		if( typeof(argsIndex) == 'object' ){
			anyTrue = anyTrue || true;
			global.lineBeingChangedIndex = i;
			global.argsIndex = argsIndex;
		}
	}
	if( anyTrue ){
		global.mouseInHandle = true;
	}

}

