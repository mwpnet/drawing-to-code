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
// the details of how the control 
// handles are drawn

var controlHandleParams = {
		size: 10,
		color:"red",
		lineWidth: 1
};

// draw a box at x,y
// for marking ends of path segments
// also checks if mouse pointer is in it
//
function drawPathBox(context,x,y,mousex,mousey) {
	var size=controlHandleParams.size;
	context.save();
	context.beginPath();
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;
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
	var size=controlHandleParams.size;
	context.save();
	context.beginPath();
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;
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
	var size=controlHandleParams.size;
	context.save();
	context.beginPath();
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;
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
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;
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
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;
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
	var size=controlHandleParams.size;
	context.save();
	context.beginPath();
    context.lineWidth = controlHandleParams.lineWidth;
    context.strokeStyle = controlHandleParams.color;

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
	return {
		mouseGrabed: mouseInBox,
		destArgs: [0,1],
		srcArgs: [0,1],
		type: "line"
	};
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

	return {
		mouseGrabed: mouseInBox,
		destArgs: [0,1],
		srcArgs: [0,1],
		type:"line"
	};
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
			mouseGrabed: true,
			destArgs: [4,5],
			srcArgs: [4,5],
			type:"line"
		};
	}
	else if(mouseInHandle1){
		return {
			mouseGrabed: true,
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	else if(mouseInHandle2){
		return {
			mouseGrabed: true,
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line"
		};
	}

	return {
		mouseGrabed: false
	};
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
			mouseGrabed: true,
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line"
		};
	}
	else if(mouseInHandle){
		return {
			mouseGrabed: true,
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	return {
		mouseGrabed: false,
	};
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
			mouseGrabed: true,
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line",
			newEnd: [newEndX,newEndY]
		};
	}
	else if(mouseInHandle2){
		return {
			mouseGrabed: true,
			destArgs: [2,3],
			srcArgs: [2,3],
			type:"line",
			newEnd: [newEndX,newEndY]
		};
	}
	else if(mouseInCircleHandle){
		return{
			mouseGrabed: true,
			destArgs: [4],
			srcArgs: [0,1,2,3,4],
			type:"rad2",
			newEnd: [newEndX,newEndY]
		};
	}
	
	return{
		mouseGrabed: false,
		newEnd: [newEndX,newEndY]
	};

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
			mouseGrabed: true,
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
	}
	else if(mouseInRad){
		return {
			mouseGrabed: true,
			destArgs: [2],
			srcArgs: [0,1],
			type:"rad"
		};
	}
	else if(mouseInStart){
		return {
			mouseGrabed: true,
			destArgs: [3],
			srcArgs: [0,1],
			type:"ang"
		};
	}
	else if(mouseInEnd){
		return {
			mouseGrabed: true,
			destArgs: [4],
			srcArgs: [0,1],
			type:"ang"
		};
	}
	else if(mouseInCcw){
		return {
			mouseGrabed: true,
			destArgs: [5],
			srcArgs: [5],
			type:"truefalse"
		};
	}
	return {
		mouseGrabed: false,
	};
}

///////////////////////////////////////
//draw the handles from fillRect() and strokeRect()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawFillStrokeRect(context,x,y,w,h,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);
	var mouseInWidthHeight  = drawControlePointHandle( context,x+w,y+h,mousex,mousey );
	
	if( mouseInBox ){
		return {
			mouseGrabed: true,
			destArgs: [0,1],
			srcArgs: [0,1],
			type:"line"
		};
		
	}
	else if( mouseInWidthHeight ){
		return {
			mouseGrabed: true,
			destArgs: [2,3],
			srcArgs: [0,1],
			type:"widthHeight"
		};
		
	}
	
	return {
		mouseGrabed: false,
	};
}


///////////////////////////////////////
//draw the handles from fillText() and StrokeText()
//if the mouse is in a control handle,
//returns the information needed to 
//change the the corresponding 
//arguments.
//
function drawFillStrokeText(context,text,x,y,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	var h = 20;
	var w = 50; //replace with measureText() eventually
	drawLinesToConrolePoints(context,x,y,x+w,y);
	drawLinesToConrolePoints(context,x,y+h,x,y-h);
	
	if( mouseInBox ){
		return {
			mouseGrabed: true,
			destArgs: [1,2],
			srcArgs: [1,2],
			type:"line"
		};
		
	}

	return {
		mouseGrabed: false,
	};
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

function drawEditHandles( context, codeTree,mousex,mousey){
	var moveInfo = { 
			mouseGrabed: false,
			mouseX: mousex,
			mouseY: mousey,
			context: context,
			xOld:0,
			yOld:0
			};

	acorn.walk.simple( codeTree, {
		Expression: drawEditHandlesCallback
		},undefined,moveInfo);

    return moveInfo;
}
    
/**
 * 
 * @param node 
 * @param moveInfo
 * 		{
 * 			mouseX: ???,
 * 			mouseY: ???
 * 		}
 * 
 * returns nothing
 * 
 * posibly updates moveInfo
 * 		+ mouseGrabed - if mouse is in controle handle
		+ xOld - for this path sement the beginning coords
		+ yOld 
		+ arguments  - node array with the arguments

 * 
 */
function drawEditHandlesCallback( node, moveInfo){

	var startCo = [0,0];
	var endCo=[0,0];
	var mousex = moveInfo.mouseX;
	var mousey = moveInfo.mouseY;
	var context = moveInfo.context;
		
    if( node.type == "CallExpression" && node.callee.object.name == "context" && typeof(node.arguments) != "undefined" ){
    	
		var localMoveInfo = { mouseGrabed: false };
   	
		var name = node.callee.property.name;
		
		var args = node.arguments;
		for(var i=0; i<args.length;i++){
			if(args[i].type != "Literal"){
				return;
			}
		}
		
		if( name == "moveTo"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawMoveTo( context, args[0].value, args[1].value,mousex,mousey );
			endCo = [ args[0].value,args[1].value ];
		}
		else if( name ==  "lineTo"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawLineTo( context, args[0].value, args[1].value,mousex,mousey );
			endCo = [ args[0].value,args[1].value ];
		}
		else if( name ==  "bezierCurveTo"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawBezierCurveTo( context, startCo[0],startCo[1],args[0].value, args[1].value, args[2].value, args[3].value, args[4].value, args[5].value,mousex,mousey );
			endCo = [args[4].value,args[5].value];
		}
		else if( name == "quadraticCurveTo"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawQuadraticCurveTo( context, startCo[0],startCo[1],args[0].value, args[1].value, args[2].value, args[3].value,mousex,mousey );
			endCo = [args[2].value,args[3].value];
		}
		else if( name == "arcTo"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawArcTo( context, startCo[0], startCo[1], args[0].value, args[1].value, args[2].value, args[3].value, args[4].value, mousex,mousey);
			endCo = localMoveInfo.newEnd;
		}
		else if( name == "arc"){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			var centerX = args[0].value;
			var centerY = args[1].value;
			var r = args[2].value;
			var ang = args[4].value; // end angle
			endCo = angleToXY(ang,centerX,centerY,r);

			localMoveInfo = drawArc( context, args[0].value, args[1].value, args[2].value, args[3].value, args[4].value, args[5].value, endCo[0], endCo[1],mousex,mousey );
		}
		else if( name == "fillRect" || name == "strokeRect" || name == "clearRect" || name == "rect") {
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawFillStrokeRect(context,args[0].value, args[1].value, args[2].value, args[3].value,mousex,mousey);
			endCo = [ args[0].value,args[1].value ];
		}
		else if( name == "fillText" || name == "strokeText" ){
			startCo = [ moveInfo.xOld, moveInfo.yOld ];
			localMoveInfo = drawFillStrokeText(context,args[0].value, args[1].value, args[2].value,mousex,mousey);
			endCo = [ args[0].value,args[1].value ];
		}
		
		moveInfo.xOld=endCo[0];
		moveInfo.yOld=endCo[1];

		if( localMoveInfo.mouseGrabed ){
			moveInfo.mouseGrabed = true;
			moveInfo.xOldMove=startCo[0];
			moveInfo.yOldMove=startCo[1];
			moveInfo.destArgs = localMoveInfo.destArgs;
			moveInfo.srcArgs = localMoveInfo.srcArgs;
			moveInfo.arguments = node.arguments;
			moveInfo.type = localMoveInfo.type;
			
		}
	}
    return;
}
