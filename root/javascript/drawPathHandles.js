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


/********************************************
 * dwraPathHandles.js
 * 
 * functions to draw path handles for the 
 * given code line
 *******************************************/


/***********************************
 * the functions that draw the actual 
 * shapes representing the path and 
 * control handle. Also checks to see 
 * if the mouse is in the shape being 
 * drawn
 */

///////////////////////////////////////
// draw a box at x,y
// for marking ends of path segments
// also checks if mouse pointer is in it
//
function drawPathBox(context,x,y,mousex,mousey) {
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
	var mouseIn = context.isPointInPath(mousex,mousey);
	context.stroke();
	context.restore();
	
	return mouseIn;
}

///////////////////////////////////////
// draw a circle at x,y
// for marking control points
// also checks if mouse pointer is in it
//
function drawControlePointHandle( context,cx,cy,mousex,mousey){
	var size=10.0;
	context.save();
	context.beginPath();
	context.lineWidth = 1;
	context.strokeStyle = 'red';
	context.moveTo(cx+size/2.0,cy);
	context.arc(cx, cy, size/2.0, 0, 2.0 * Math.PI, false);
	var mouseIn = context.isPointInPath(mousex,mousey);
	context.stroke();
	context.restore();
	return mouseIn;
}

///////////////////////////////////////
//draw an X at x,y
// only used for marking
//no mouse detection
//
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

///////////////////////////////////////
//draw a line from x,y to cx,cy
// for drawing lines from the end of paths 
// to control points
//
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

///////////////////////////////////////
// draws part of a circle at x,y with 
// radius r. It takes the same 
// arguments as the arc command, but 
// has the ccw inverted, so it draws 
// the part of the circle that's not 
// there.
//
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

///////////////////////////////////////
// draws the handle to reverse the 
// clock wise/counter clockwise flag, 
// ie flips ccw
//
function drawArcDirection(context,cx,cy,r,ang,ccw,mousex,mousey){
	
	var size = 10;
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
	var mouseIn = drawControlePointHandle(context,x,y,mousex,mousey);

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

///////////////////////////////////////
// draw the handles from moveTo()
// if the mouse is in a control handle,
// returns the information needed to 
// change the the corresponding 
// arguments.
//
function drawMoveTo(context,x,y,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	if(mouseInBox){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type: "line"
		};
	}
	return undefined;
}

///////////////////////////////////////
//draw the handles from lineTo()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawLineTo(context,x,y,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	if(mouseInBox){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	return undefined;
}

///////////////////////////////////////
//draw the handles from bezierCurveTo()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawBezierCurveTo(context,xold,yold,cx1,cy1,cx2,cy2,x,y,mousex,mousey) {
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	drawLinesToConrolePoints(context,cx1,cy1,xold,yold);
	var mouseInHandle1 = drawControlePointHandle(context,cx1,cy1,mousex,mousey);

	drawLinesToConrolePoints(context,cx2,cy2,x,y);
	var mouseInHandle2 = drawControlePointHandle(context,cx2,cy2,mousex,mousey);
	
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


///////////////////////////////////////
//draw the handles from quadraticCurveTo()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawQuadraticCurveTo(context,xold,yold,cx,cy,x,y,mousex,mousey) {
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	drawLinesToConrolePoints(context,cx,cy,xold,yold);
	drawLinesToConrolePoints(context,cx,cy,x,y);
	var mouseInHandle = drawControlePointHandle(context,cx,cy,mousex,mousey);
	
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


///////////////////////////////////////
//draw the handles from arcTo()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawArcTo(context,xold,yold,c1x,c1y,c2x,c2y, r, mousex,mousey) {
	var params = computArcToParameters(xold,yold,c1x,c1y,c2x,c2y,r);
	//localMoveInfo = drawArcTo( context, prevEnd[0], prevEnd[1], args[0], args[1], args[2], args[3], args[4], params[0], params[1], params[2],params[3], params[4],params[5],params[6],mousex,mousey);

	var cx = params[0];
	var cy = params[1]; 
	var startAngle = params[2];
	var endAngle = params[3];
	var ccw = params[4];
	var newEndX = params[5];
	var newEndY = params[6];

	
	drawLinesToConrolePoints(context,xold,yold,c1x,c1y);
	var mouseInHandle1 = drawControlePointHandle(context,c1x,c1y,mousex,mousey);

	drawLinesToConrolePoints(context,c1x,c1y,c2x,c2y);
	var mouseInHandle2 = drawControlePointHandle(context,c2x,c2y,mousex,mousey);
	
	// radiouse control handle here 
	var mouseInCircleHandle = drawControlePointHandle(context,cx,cy,mousex,mousey);
	drawCircleForArcs(context,cx,cy,r,startAngle, endAngle, ccw);

	drawPathX(context,newEndX,newEndY);
	
	if(mouseInHandle1){
		return {
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line",
			newEnd: [newEndX,newEndY]
		};
	}
	else if(mouseInHandle2){
		return {
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line",
			newEnd: [newEndX,newEndY]
		};
	}
	else if(mouseInCircleHandle){
		return{
			destArgs: [4],
			srcArgs: [0,1,2,3,4],
			type:"rad2",
			newEnd: [newEndX,newEndY]
		};
	}
	
	return undefined;

}

///////////////////////////////////////
//draw the handles from arc()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawArc(context, cx,cy,r, startAngle, endAngle, ccw, newEndX,newEndY,mousex,mousey){
	//arc(x, y, r, startAngle, endAngle, counterClockwise)
	var extra = 20.0;
	
	// center of arc handle
	var mouseInCenter = drawPathBox(context,cx,cy,mousex,mousey);
	
	// radius handle
	var mouseInRad = drawControlePointHandle(context,cx,cy-r,mousex,mousey);

	// start angle control
	ang1Coords = angleToXY(startAngle,cx,cy,r+extra);
	drawLinesToConrolePoints(context,cx,cy,ang1Coords[0],ang1Coords[1]);
	var mouseInStart = drawControlePointHandle(context,ang1Coords[0],ang1Coords[1],mousex,mousey);
	
	// end angle control
	ang2Coords = angleToXY(endAngle,cx,cy,r+extra);
	drawLinesToConrolePoints(context,cx,cy,ang2Coords[0],ang2Coords[1]);
	var mouseInEnd = drawControlePointHandle(context,ang2Coords[0],ang2Coords[1],mousex,mousey);
	
	// mapping circle
	drawCircleForArcs(context,cx,cy,r, startAngle, endAngle, ccw);

	// new end poiont
	drawPathX(context,newEndX,newEndY);

	// clockwise/counter clockwise handle
		
	var mouseInCcw = drawArcDirection(context,cx,cy,r+.5*extra,startAngle,ccw,mousex,mousey);
	
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
			srcArgs: [5],
			type:"truefalse"
		};
	}
	return undefined;
}

/**************************************
 * The actual part that parses the code
 * line and draws the controle handles.
**************************************/


///////////////////////////////////////
// given a line of code as a string, 
// draws the coresponding controle 
// points for the given command.
// if the mouse is in cone of the 
// controle points, will return the 
// information necisary to adjust the 
// code line accordingly.
//
function drawEditHandles( context, codeLines,mousex,mousey){
	
	var lineBeingChanged;
	var startCo = [0,0];
	var endCo = [0,0];
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
			startCo = endCo;
			localMoveInfo = drawMoveTo( context, args[0], args[1],mousex,mousey );
			endCo = args;
		}
		else if(lineparts[0].match( /\b(?:lineTo)\b/ )){
			startCo = endCo;
			localMoveInfo = drawLineTo( context, args[0], args[1],mousex,mousey );
			endCo = args;
		}
		else if(lineparts[0].match( /\b(?:bezierCurveTo)\b/ )){
			startCo = endCo;
			localMoveInfo = drawBezierCurveTo( context, startCo[0],startCo[1],args[0], args[1], args[2], args[3], args[4], args[5],mousex,mousey );
			endCo = [args[4],args[5]];
		}
		else if(lineparts[0].match( /\b(?:quadraticCurveTo)\b/ )){
			startCo = endCo;
			localMoveInfo = drawQuadraticCurveTo( context, startCo[0],startCo[1],args[0], args[1], args[2], args[3],mousex,mousey );
			endCo = [args[2],args[3]];
		}
		else if(lineparts[0].match( /\b(?:arcTo)\b/ )){
			startCo = endCo;
			localMoveInfo = drawArcTo( context, startCo[0], startCo[1], args[0], args[1], args[2], args[3], args[4], mousex,mousey);
			if(typeof localMoveInfo != 'undefined'){
				endCo = localMoveInfo.newEnd;
			}
		}
		else if(lineparts[0].match( /\b(?:arc)\b/ )){
			
			startCo = endCo;
			var centerX = args[0];
			var centerY = args[1];
			var r = args[2];
			var ang = args[4]; // end angle
			var endCo = angleToXY(ang,centerX,centerY,r);

			localMoveInfo = drawArc( context, args[0], args[1], args[2], args[3], args[4], args[5], endCo[0], endCo[1],mousex,mousey );
			
		}
		
		if(typeof localMoveInfo != 'undefined'){
			moveInfo = localMoveInfo;
			moveInfo.codeLineBeingReferenced = i;
			moveInfo.xOld=startCo[0];
			moveInfo.yOld=startCo[1];
		}
	}
	
	return moveInfo;
	
}
