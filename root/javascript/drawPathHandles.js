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

// draw a circle at x,y
// for marking control points
// also checks if mouse pointer is in it
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

// draw the handles from moveTo()
function drawMoveTo(context,x,y,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	return {
		mouseGrabed: mouseInBox,
		destArgs: [0,1],
		srcArgs: [0,1],
		type: "line"
	};
}

//draw the handles from lineTo()
function drawLineTo(context,x,y,mousex,mousey){
	var mouseInBox = drawPathBox(context,x,y,mousex,mousey);

	return {
		mouseGrabed: mouseInBox,
		destArgs: [0,1],
		srcArgs: [0,1],
		type:"line"
	};
}

//draw the handles from bezierCurveTo()
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


//draw the handles from quadraticCurveTo()
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
function drawEditHandles( context, codeLines,mousex,mousey){
	
	var lineBeingChanged;
	var startCo = [0,0];
	var endCo = [0,0];
	var moveInfo = undefined;
	
	var anyTrue = false;

	for( var i=0, l=codeLines.length; i<l; i++){
		
		var localMoveInfo = { mouseGrabed: false };

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
			endCo = localMoveInfo.newEnd;
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
		console.debug(localMoveInfo.mouseGrabed);
		if( localMoveInfo.mouseGrabed ){
			moveInfo = localMoveInfo;
			moveInfo.codeLineBeingReferenced = i;
			moveInfo.xOld=startCo[0];
			moveInfo.yOld=startCo[1];
		}
	}
	
	return moveInfo;
	
}
