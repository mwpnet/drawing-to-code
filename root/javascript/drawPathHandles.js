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
	var mouseIn = context.isPointInPath(state.mouseX,state.mouseY);
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
	var mouseIn = context.isPointInPath(state.mouseX,state.mouseY);
	context.stroke();
	context.restore();
	return mouseIn;
}

//draw an X at x,y
// only used for marking
//no mouse detection
function drawPathX( context,x,y){
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
function drawLinesToConrolePoints(context,cx,cy,x,y){
	context.save();
	context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
	context.moveTo(x,y);
	context.lineTo(cx,cy);
	context.stroke();
	context.restore();
}

function drawCircleForArcs(context,x,y,r,start,end,ccw){
	context.save();
	context.beginPath();
    context.lineWidth = 1;
    context.strokeStyle = 'red';
	context.arc(x, y, r, start,start, !ccw);
	context.arc(x, y, r, start,end, !ccw);
	context.stroke();
	context.restore();
	
	return false;
}

function drawArcDirection(context,cx,cy,r,ang,ccw){
	
	var size = 10
	context.save();
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = 'red';

	var arcLenth = 2*size/r;
	var arrowLength = size/r; // radians
	
	if(ccw){
		arcLenth = -arcLenth;
		arrowLength = -arrowLength;
	}

	var ang2Coords = angleToXY(ang+.4*arcLenth,cx,cy,r);
	var x = ang2Coords[0];
	var y = ang2Coords[1];
	var mouseIn = drawControlePointHandle(context,x,y);

	context.moveTo(x,y);
	context.arc( cx, cy, r, ang, ang+arcLenth, ccw );
	var arrowEnd = angleToXY(ang+arcLenth-arrowLength,cx,cy,r+size/2);
	context.lineTo(arrowEnd[0],arrowEnd[1]);

	context.stroke();
	context.restore();
	
	
	return mouseIn;
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
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	return undefined;
}

//draw the handles from lineTo()
function drawLineTo(context,x,y){
	var mouseInBox = drawPathBox(context,x,y);

	if(mouseInBox){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	return undefined;
}

//draw the handles from bezierCurveTo()
function drawBezierCurveTo(context,xold,yold,cx1,cy1,cx2,cy2,x,y) {
	var mouseInBox = drawPathBox(context,x,y);

	drawLinesToConrolePoints(context,cx1,cy1,xold,yold);
	var mouseInHandle1 = drawControlePointHandle(context,cx1,cy1);

	drawLinesToConrolePoints(context,cx2,cy2,x,y);
	var mouseInHandle2 = drawControlePointHandle(context,cx2,cy2);
	
	if(mouseInBox){
		return {
			destArgs: [4,5],
			srcArgs: [4,5],
			type:"line"
		};
	}
	else if(mouseInHandle1){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	else if(mouseInHandle2){
		return {
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line"
		};
	}
	return undefined;
}


//draw the handles from quadraticCurveTo()
function drawQuadraticCurveTo(context,xold,yold,cx,cy,x,y) {
	var mouseInBox = drawPathBox(context,x,y);

	drawLinesToConrolePoints(context,cx,cy,xold,yold);
	drawLinesToConrolePoints(context,cx,cy,x,y);
	var mouseInHandle = drawControlePointHandle(context,cx,cy);
	
	if(mouseInBox){
		return {
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line"
		};
	}
	else if(mouseInHandle){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	return undefined;
}


function drawArcTo(context,xold,yold,c1x,c1y,c2x,c2y,r,  cx,cy, startAngle, endAngle, ccw, newEndX,newEndY) {
	drawLinesToConrolePoints(context,xold,yold,c1x,c1y);
	var mouseInHandle1 = drawControlePointHandle(context,c1x,c1y);

	drawLinesToConrolePoints(context,c1x,c1y,c2x,c2y);
	var mouseInHandle2 = drawControlePointHandle(context,c2x,c2y);
	
	// radiouse control handle here XXX
	var center = [cx,cy];
	var mouseInCircleHandle = drawControlePointHandle(context,cx,cy);
	drawCircleForArcs(context,cx,cy,r,startAngle, endAngle, ccw);

	drawPathX(context,newEndX,newEndY);
	
	if(mouseInHandle1){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	else if(mouseInHandle2){
		return {
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line"
		};
	}
	else if(mouseInCircleHandle){
		return{
			destArgs: [4],
			srcArgs: [0,1,2,3,4],
			type:"rad2"
		};
	}
	
	return undefined;

}

function drawArc(context, cx,cy,r, startAngle, endAngle, ccw, newEndX,newEndY){
	//arc(x, y, r, startAngle, endAngle, counterClockwise)
	var extra = 20.0;
	
	// center of arc handle
	var mouseInCenter = drawPathBox(context,cx,cy);
	
	// radius handle
	var mouseInRad = drawControlePointHandle(context,cx,cy-r);

	// start angle control
	ang1Coords = angleToXY(startAngle,cx,cy,r+extra);
	drawLinesToConrolePoints(context,cx,cy,ang1Coords[0],ang1Coords[1]);
	var mouseInStart = drawControlePointHandle(context,ang1Coords[0],ang1Coords[1]);
	
	// end angle control
	ang2Coords = angleToXY(endAngle,cx,cy,r+extra);
	drawLinesToConrolePoints(context,cx,cy,ang2Coords[0],ang2Coords[1]);
	var mouseInEnd = drawControlePointHandle(context,ang2Coords[0],ang2Coords[1]);
	
	// mapping circle
	drawCircleForArcs(context,cx,cy,r, startAngle, endAngle, ccw);

	// new end poiont
	drawPathX(context,newEndX,newEndY);

	// clockwise/counter clockwise handle
		
	var mouseInCcw = drawArcDirection(context,cx,cy,r+.5*extra,startAngle,ccw);
	
	if(mouseInCenter){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	else if(mouseInRad){
		return {
			destArgs: [2],
			srcArgs: [0,1],
			type:"rad"
		};
	}
	else if(mouseInStart){
		return {
			destArgs: [3],
			srcArgs: [0,1],
			type:"ang"
		};
	}
	else if(mouseInEnd){
		return {
			destArgs: [4],
			srcArgs: [0,1],
			type:"ang"
		};
	}
	else if(mouseInCcw){
		return {
			destArgs: [5],
			srcArgs: [],
			type:"truefalse"
		};
	}
	return undefined;
}
	

/***********************************
 * 
 * @param context
 * 
 * @param codeLines
 * @returns  - only if mouse is in one of the controle points
 * 			type - what kind of controle point this is:
 * 					line - 
 * 					rad -
 * 					ang -
 * 					truefalse - 
 * 			destArgs: - index of the args to be changed
 * 			srcArgs: - index of the args used to get the new value
 * 			codeLineBeingReferenced: - 
 * }
 ********************************/
function drawEditHandles( context, codeLines){
	
	var lineBeingChanged;
	var prevEnd = [0,0];
	var moveInfo = undefined;
	
	var anyTrue = false;

	for( var i=0, l=codeLines.length; i<l; i++){
		
		var localMoveInfo = undefined;

		var lineparts = parseCodeLine(codeLines[i]);
		if( lineparts == null){
			continue;
		}
		var args = lineparts[1];
		if( args == null){
			continue;
		}
		
		if( lineparts[0].match( /\b(?:moveTo)\b/ )){
			localMoveInfo = drawMoveTo( context, args[0], args[1] );
			prevEnd = args;
		}
		else if(lineparts[0].match( /\b(?:lineTo)\b/ )){
			localMoveInfo = drawLineTo( context, args[0], args[1] );
			prevEnd = args;
		}
		else if(lineparts[0].match( /\b(?:bezierCurveTo)\b/ )){
			localMoveInfo = drawBezierCurveTo( context, prevEnd[0],prevEnd[1],args[0], args[1], args[2], args[3], args[4], args[5] );
			prevEnd = [args[4],args[5]];
		}
		else if(lineparts[0].match( /\b(?:quadraticCurveTo)\b/ )){
			localMoveInfo = drawQuadraticCurveTo( context, prevEnd[0],prevEnd[1],args[0], args[1], args[2], args[3] );
			prevEnd = [args[2],args[3]];
		}
		else if(lineparts[0].match( /\b(?:arcTo)\b/ )){
			var params = computArcToParameters(prevEnd[0], prevEnd[1], args[0], args[1], args[2], args[3], args[4]);
			localMoveInfo = drawArcTo( context, prevEnd[0], prevEnd[1], args[0], args[1], args[2], args[3], args[4], params[0], params[1], params[2],params[3], params[4],params[5],params[6]);
			prevEnd = [params[5],params[6]];
		}
		else if(lineparts[0].match( /\b(?:arc)\b/ )){
			
			var centerX = args[0];
			var centerY = args[1];
			var r = args[2];
			var ang = args[4]; // end angle
			var newEnd = angleToXY(ang,centerX,centerY,r);

			localMoveInfo = drawArc( context, args[0], args[1], args[2], args[3], args[4], args[5], newEnd[0], newEnd[1] );
			
			prevEnd = [ newEnd[0], newEnd[1] ];
		}
		
		if(typeof localMoveInfo != 'undefined'){
			moveInfo = localMoveInfo;
			moveInfo.codeLineBeingReferenced = i;
			moveInfo.xOld=prevEnd[0];
			moveInfo.yOld=prevEnd[1];
		}
	}
	
	return moveInfo;
	
}
