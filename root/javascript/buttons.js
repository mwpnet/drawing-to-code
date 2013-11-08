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
 * set up the buttons that allow users 
 * to pick a particular drawing command
 */

///////////////////////////////////////
// gets the canvas corresponding to 
// each button and fills it in with the
// corresponding graphic.
// Note that they all use the the 
// drawing command to draw the 
// corresponding button, so they look 
// exactly like what's drawn
//
function buttonSetUp(){
	var button = document.getElementById("moveToButton");
	var buttonContext = button.getContext('2d');
	moveToButton(buttonContext);

	button = document.getElementById("lineToButton");
	buttonContext = button.getContext('2d');
	lineToButton(buttonContext);

	button = document.getElementById("bezierCurveToButton");
	buttonContext = button.getContext('2d');
	bezierCurveToButton(buttonContext);

	button = document.getElementById("quadraticCurveToButton");
	buttonContext = button.getContext('2d');
	quadraticCurveToButton(buttonContext);

	button = document.getElementById("arcToButton");
	buttonContext = button.getContext('2d');
	arcToButton(buttonContext);

	button = document.getElementById("arcButton");
	buttonContext = button.getContext('2d');
	arcButton(buttonContext);

	button = document.getElementById("closePathButton");
	buttonContext = button.getContext('2d');
	closePathButton(buttonContext);

	// set up initial button press
	onClickMoveTo();
}

///////////////////////////////////////
// common path properties so all the 
// buttons have the same look
//
function pathSetup(context){
	context.lineWidth = 2;
	context.strokeStyle = 'black';
}

///////////////////////////////////////
// draws the moveTo button 
//
function moveToButton(context){
	var startX = 32;
	var startY = 32;

	drawMoveTo(context,startX, startY );
	
	// mouse image
	context.beginPath();
	context.moveTo(32,32);
	context.lineTo( 32, 48 );
	context.lineTo( 36, 41 );
	context.lineTo( 40, 40 );
	context.closePath();
	context.fillStyle = "black";
	context.fill();

	context.beginPath();
	context.moveTo( 34,34 );
	context.lineTo( 32 + 6, 32 + 18 );
	context.lineWidth=2;
	context.stroke();

}

///////////////////////////////////////
// draws lilneTo button
//
function lineToButton(context){
	var startX = 13;
	var startY = 50;
	var endX = 43;
	var endY = 22;

	
	context.beginPath();
	pathSetup(context);
	
	context.moveTo( startX, startY );
	context.lineTo( endX, endY );
	context.stroke();

	drawMoveTo(context,startX, startY );
	drawLineTo(context, endX, endY);

}

///////////////////////////////////////
// draws bezierCurveTo button
//
function bezierCurveToButton(context){
	var startX = 13;
	var startY = 50;
	var c1X = 19;
	var c1Y = 22;
	var c2X = 53;
	var c2Y = 11;
	var endX = 46;
	var endY = 39;

	context.beginPath();
	pathSetup(context);
	
	context.moveTo( startX, startY );
	context.bezierCurveTo( c1X, c1Y, c2X, c2Y, endX, endY );
	context.stroke();

	drawMoveTo(context,startX, startY );
	drawBezierCurveTo(context,startX, startY,c1X, c1Y, c2X, c2Y,endX, endY);
		

}

///////////////////////////////////////
//draws quadraticCurveTo button
//
function quadraticCurveToButton(context){
	var startX = 13;
	var startY = 50;
	var c1X = 25;
	var c1Y = 16;
	var endX = 50;
	var endY = 38;

	context.beginPath();
	pathSetup(context);
	
	context.moveTo( startX, startY );
	context.quadraticCurveTo( c1X, c1Y, endX, endY );
	context.stroke();

	drawMoveTo(context,startX, startY );
	drawQuadraticCurveTo(context,startX, startY,c1X, c1Y, endX, endY);
}

///////////////////////////////////////
//draws closePath button
//
function closePathButton(context){
	var startX = 16;
	var startY = 50;
	var endX = 49;
	var endY = 43;

	context.beginPath();
	pathSetup(context);

	context.moveTo( 16, 50 );
	context.lineTo( 11, 23 );
	context.lineTo( 33, 35 );
	context.lineTo( 52, 11 );
	context.lineTo( endX, endY );
	context.stroke();

	drawMoveTo(context,startX, startY );
	drawLineTo(context, 11, 23);
	drawLineTo(context, 33, 35);
	drawLineTo(context, 52, 11);
	drawLineTo(context, endX, endY);

	drawLinesToConrolePoints(context,startX,startY,endX, endY);
}

///////////////////////////////////////
//draws arcTo button
//
function arcToButton(context){
	context.beginPath();
	pathSetup(context);
	
	context.moveTo( 13, 44 );
	context.arcTo( 44, 51, 37, 16,15);
	context.stroke();
	
	drawMoveTo(context,13, 44 );

	var params = computArcToParameters(13, 44, 44, 51, 37, 16, 15);
	
	drawArcTo(context,13,44,44,51,37,16,15,  params[0], params[1], params[2],params[3], params[4],params[5],params[6]);
	
}

///////////////////////////////////////
//draws arc button
//
function arcButton(context){

	var centerX = 40;
	var centerY = 31;
	var r = 19;
	var startAng = 0.4356;
	var endAng = 5.1698; // end angle
	var delta = angleToXY(endAng,centerX,centerY,r);

	var prevEndX = delta[0];
	var prevEndY = delta[1];
	
	context.beginPath();
	pathSetup(context);
	context.moveTo( 13, 49 );
	context.arc( centerX, centerY, r, startAng, endAng );
	context.stroke();

	drawMoveTo(context,13, 49 );
	drawArc(context, centerX, centerY, r, startAng, endAng, false, prevEndX,prevEndY);
}

///////////////////////////////////////
// draws commingSoon button
// used for button that hadn't been 
// implemented yet. Not used not, but 
// left for future use.
//
function commingSoon(context){
	
	context.font = 'italic 8pt Calibri';
	context.textAlign = 'center';
	context.fillStyle = 'blue';
	context.fillText('coming', 32,16);
	context.fillText('soon', 32,46);
}

