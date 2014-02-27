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

var mockContext = {
		
	context: undefined,
	callCount: 0,
	
	mousex: 0,
	mousey: 0,
	
	translatedMousex: 0,
	translatedMousex: 0,
	
	controlHandleParams: {
			size: 10,
			color:"red",
			lineWidth: 1
	},
	
	mouseGrabed: false,
	destArgs: [],
	srcArgs: [],
	type: "",
	newEnd: [],
	xold: 0,
	yold: 0,
	
	
	contextState: {
			transformMatrix: [1,0,0,1,0,0],
			clipRegion: [], //???

			strokeStyle: "", 
			fillStyle: "", 
			globalAlpha: "", 
			lineWidth: "", 
			lineCap: "", 
			lineJoin: "", 
			miterLimit: "", 
			lineDashOffset: "", 
			shadowOffsetX: "", 
			shadowOffsetY: "", 
			shadowBlur: "", 
			shadowColor: "", 
			globalCompositeOperation: "", 
			font: "", 
			textAlign: "", 
			textBaseline: "", 
			direction: "", 
			imageSmoothingEnabled: "",
	    	
			dashList: []
	},

	currentState: {},
	
	stateStack: [],
	
	
	/*********************************/
	
	
	// draw a box at x,y
	// for marking ends of path segments
	// also checks if mouse pointer is in it
	//
	drawPathBox: function (x,y) {
		var size=controlHandleParams.size;
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
	    this.context.moveTo(x-size/2.0, y-size/2.0);
	    this.context.lineTo(x-size/2.0, y+size/2.0);
	    this.context.lineTo(x+size/2.0, y+size/2.0);
	    this.context.lineTo(x+size/2.0, y-size/2.0);
		this.context.closePath();
		var mouseIn = this.context.isPointInPath(this.mousex,this.mousey);
		this.context.stroke();
		this.context.restore();
		
		return mouseIn;
	},
	
	///////////////////////////////////////
	// draw a circle at x,y
	// for marking control points
	// also checks if mouse pointer is in it
	//
	drawControlePointHandle: function ( cx,cy){
		var size=controlHandleParams.size;
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
		this.context.moveTo(cx+size/2.0,cy);
		this.context.arc(cx, cy, size/2.0, 0, 2.0 * Math.PI, false);
		var mouseIn = this.context.isPointInPath(this.mousex,this.mousey);
		this.context.stroke();
		this.context.restore();
		return mouseIn;
	},
	
	///////////////////////////////////////
	//draw an X at x,y
	// only used for marking
	//no mouse detection
	//
	drawPathX: function ( x,y){
		var size=controlHandleParams.size;
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
		this.context.moveTo(x-size/2.0, y-size/2.0);
		this.context.lineTo(x+size/2.0, y+size/2.0);
		this.context.moveTo(x-size/2.0, y+size/2.0);
		this.context.lineTo(x+size/2.0, y-size/2.0);
		this.context.stroke();
		this.context.restore();
		
		return false;
	},
	
	///////////////////////////////////////
	//draw a line from x,y to cx,cy
	// for drawing lines from the end of paths 
	// to control points
	//
	drawLinesToConrolePoints: function (cx,cy,x,y){
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
		this.context.moveTo(x,y);
		this.context.lineTo(cx,cy);
		this.context.stroke();
		this.context.restore();
	},
	
	///////////////////////////////////////
	// draws part of a circle at x,y with 
	// radius r. It takes the same 
	// arguments as the arc command, but 
	// has the ccw inverted, so it draws 
	// the part of the circle that's not 
	// there.
	//
	drawCircleForArcs: function (x,y,r,start,end,ccw){
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
		this.context.arc(x, y, r, start,start, !ccw);
		this.context.arc(x, y, r, start,end, !ccw);
		this.context.stroke();
		this.context.restore();
		
		return false;
	},
	
	///////////////////////////////////////
	// draws the handle to reverse the 
	// clock wise/counter clockwise flag, 
	// ie flips ccw
	//
	drawArcDirection: function (cx,cy,r,ang,ccw){
		var size=controlHandleParams.size;
		this.context.save();
		this.context.beginPath();
	    this.context.lineWidth = controlHandleParams.lineWidth;
	    this.context.strokeStyle = controlHandleParams.color;
	
		var arcLenth = 2*size/r;
		var arrowLength = size/r; // radians
		
		if(ccw){
			arcLenth = -arcLenth;
			arrowLength = -arrowLength;
		}
	
		var ang2Coords = angleToXY(ang+.4*arcLenth,cx,cy,r);
		var x = ang2Coords[0];
		var y = ang2Coords[1];
		var mouseIn = drawControlePointHandle(x,y);
	
		this.context.moveTo(x,y);
		this.context.arc( cx, cy, r, ang, ang+arcLenth, ccw );
		var arrowEnd = angleToXY(ang+arcLenth-arrowLength,cx,cy,r+size/2);
		this.context.lineTo(arrowEnd[0],arrowEnd[1]);
	
		this.context.stroke();
		this.context.restore();
		
		
		return mouseIn;
	},


	/***********************************
	 * functions to draw the path and control handles.
	 * If the mouse pointer is in any of the handles,
	 * the the index of the arguments for those args
	 * is returned.
	 */
	
	/** command taken from http://www.w3.org/html/wg/drafts/2dcontext/master/ **/
	/** at 7 November 2013 **/
	/** comments after function are from document **/
	
	
	//2 The canvas state
	save: function(){	// Pushes the current state onto the stack.
		this.stateStack.push(this.currentState);
		this.currentState = new contextState;//XXX
	},
	restore: function(){	// Pops the top state on the stack, restoring the context to that state.
		var poppedState = this.stateStack.push();
		if( poppedState != undefined){
			this.currentState = poppedState;
		}
	},

	//3 DrawingStyle objects
	// not relevant here

	//4 Line styles
	lineWidth: 0,	// Returns the current line width.
					// Can be set, to change the line width. Values that are not finite values greater than zero are ignored.
	lineCap: "",		// Returns the current line cap style.
					// Can be set, to change the line cap style.
					// The possible line cap styles are butt, round, and square. Other values are ignored.
	lineJoin: "",	// Returns the current line join style.
					// Can be set, to change the line join style.
					// The possible line join styles are bevel, round, and miter. Other values are ignored.
	miterLimit: 0,	// Returns the current miter limit ratio.
					// Can be set, to change the miter limit ratio. Values that are not finite values greater than zero are ignored.
	setLineDash: function(segments){},	// Sets the current line dash pattern (as used when stroking). The argument is a list of distances for which to alternately have the line on and the line off.
	getLineDash: function(){},			// Returns a copy of the current line dash pattern. The array returned will always have an even number of entries (i.e. the pattern is normalized).
	lineDashOffset: 0,	// Returns the phase offset (in the same units as the line dash pattern).
						// Can be set, to change the phase offset. Values that are not finite values are ignored.

	// 5 Text styles
	font: "",	// Returns the current font settings.
				// Can be set, to change the font. The syntax is the same as for the CSS 'font' property, values that cannot be parsed as CSS font values are ignored.
				// Relative keywords and lengths are computed relative to the font of the canvas element.
	textAlign: "",	// Returns the current text alignment settings.
					// Can be set, to change the alignment. The possible values are start, end, left, right, and center. Other values are ignored. The default is start.
	textBaseline: 0,	// Returns the current baseline alignment settings.
						// Can be set, to change the baseline alignment. The possible values and their meanings are given below. Other values are ignored. The default is alphabetic.
	direction: "", 	// Returns the current directionality.
					// Can be set, to change the directionality. The possible values and their meanings are given below. Other values are ignored. The default is inherit.

	//6 Building paths

	///////////////////////////////////////
	// draw the handles from moveTo()
	// if the mouse is in a control handle,
	// returns the information needed to 
	// change the the corresponding 
	// arguments.
	//
	moveTo: function (x,y){ //	    Creates a new subpath with the given point.
		var mouseInBox = drawPathBox(x,y);
	
		this.mouseGrabed = mouseInBox;
		this.destArgs = [0,1];
		this.srcArgs = [0,1];
		this.type = "line";
	},
	
	closePath: function(){},	// Marks the current subpath as closed, and starts a new subpath with a point the same as the start and end of the newly closed subpath.

	///////////////////////////////////////
	//draw the handles from lineTo()
	//if the mouse is in a control handle,
	//returns the information needed to 
	//change the the corresponding 
	//arguments.
	//
	lineTo: function (x,y){	// Adds the given point to the current subpath, connected to the previous one by a straight line.
		var mouseInBox = drawPathBox(x,y);
	
		this.mouseGrabed = mouseInBox;
		this.destArgs = [0,1];
		this.srcArgs = [0,1];
		this.type ="line";
	},
	
	///////////////////////////////////////
	//draw the handles from quadraticCurveTo()
	//if the mouse is in a control handle,
	//returns the information needed to 
	//change the the corresponding 
	//arguments.
	//
	quadraticCurveTo: function (cx,cy,x,y) {	// Adds the given point to the current subpath, connected to the previous one by a quadratic Bézier curve with the given control point.
		var mouseInBox = drawPathBox(x,y);
	
		drawLinesToConrolePoints(cx,cy,this.xold,this.yold);
		drawLinesToConrolePoints(cx,cy,x,y);
		var mouseInHandle = drawControlePointHandle(cx,cy);
		
		if(mouseInBox){
			this.mouseGrabed = true;
			this.destArgs = [2,3];
			this.srcArgs = [2,3];
			this.type ="line";
		}
		else if(mouseInHandle){
			this.mouseGrabed = true;
			this.destArgs = [0,1];
			this.srcArgs = [0,1];
			this.type ="line";
		}
		else {
			this.mouseGrabed = false;
		}
	},
	
	///////////////////////////////////////
	//draw the handles from bezierCurveTo()
	//if the mouse is in a control handle,
	//returns the information needed to 
	//change the the corresponding 
	//arguments.
	//
	bezierCurveTo: function (cx1,cy1,cx2,cy2,x,y) {	// Adds the given point to the current subpath, connected to the previous one by a cubic Bézier curve with the given control points.
		var mouseInBox = drawPathBox(x,y);
	
		drawLinesToConrolePoints(cx1,cy1,this.xold,this.yold);
		var mouseInHandle1 = drawControlePointHandle(cx1,cy1);
	
		drawLinesToConrolePoints(cx2,cy2,x,y);
		var mouseInHandle2 = drawControlePointHandle(cx2,cy2);
		
		if(mouseInBox){
			this.mouseGrabed = true;
			this.destArgs = [4,5];
			this.srcArgs = [4,5];
			this.type ="line";
		}
		else if(mouseInHandle1){
			this.mouseGrabed = true;
			this.destArgs = [0,1];
			this.srcArgs = [0,1];
			this.type ="line";
		}
		else if(mouseInHandle2){
			this.mouseGrabed = true;
			this.destArgs = [2,3];
			this.srcArgs = [2,3];
			this.type ="line";
		}
		else {
			this.mouseGrabed = false;
		}
	},
	
	
	///////////////////////////////////////
	//draw the handles from arcTo()
	//if the mouse is in a control handle,
	//returns the information needed to 
	//change the the corresponding 
	//arguments.
	// Note: rb and rot are ignored for now
	arcTo: function (c1x,c1y,c2x,c2y, r, rb, rotation ) {	// Adds an arc with the given control points and radius to the current subpath, connected to the previous point by a straight line.
															// If two radii are provided, the first controls the width of the arc's ellipse, and the second controls the height. If only one is provided, or if they are the same, the arc is from a circle. In the case of an ellipse, the rotation argument controls the clockwise inclination of the ellipse relative to the x-axis.
															// Throws an IndexSizeError exception if the given radius is negative.
		var params = computArcToParameters(this.xold,this.yold,c1x,c1y,c2x,c2y,r);
		//localMoveInfo = drawArcTo( this.context, prevEnd[0], prevEnd[1], args[0], args[1], args[2], args[3], args[4], params[0], params[1], params[2],params[3], params[4],params[5],params[6],this.mousex,this.mousey);
	
		var cx = params[0];
		var cy = params[1]; 
		var startAngle = params[2];
		var endAngle = params[3];
		var ccw = params[4];
		var newEndX = params[5];
		var newEndY = params[6];
	
		
		drawLinesToConrolePoints(this.xold,this.yold,c1x,c1y);
		var mouseInHandle1 = drawControlePointHandle(c1x,c1y);
	
		drawLinesToConrolePoints(c1x,c1y,c2x,c2y);
		var mouseInHandle2 = drawControlePointHandle(c2x,c2y);
		
		// radiouse control handle here 
		var mouseInCircleHandle = drawControlePointHandle(cx,cy);
		drawCircleForArcs(cx,cy,r,startAngle, endAngle, ccw);
	
		drawPathX(newEndX,newEndY);
		
		if(mouseInHandle1){
			this.mouseGrabed = true;
			this.destArgs = [0,1];
			this.srcArgs = [0,1];
			this.type ="line";
			this.newEnd = [newEndX,newEndY];
		}
		else if(mouseInHandle2){
			this.mouseGrabed = true;
			this.destArgs = [2,3];
			this.srcArgs = [2,3];
			this.type ="line";
			this.newEnd = [newEndX,newEndY];
		}
		else if(mouseInCircleHandle){
			this.mouseGrabed = true;
			this.destArgs = [4];
			this.srcArgs = [0,1,2,3,4];
			this.type ="rad2";
			this.newEnd = [newEndX,newEndY];
		}
		else {
			this.mouseGrabed = false;
			this.newEnd = [newEndX,newEndY];
		}
	
	},
	
	///////////////////////////////////////
	//draw the handles from arc()
	//if the mouse is in a control handle,
	//returns the information needed to 
	//change the the corresponding 
	//arguments.
	//
	arc: function (cx,cy,r, startAngle, endAngle, ccw){	// Adds points to the subpath such that the arc described by the circumference of the circle described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
																			// Throws an IndexSizeError exception if the given radius is negative.
		//arc(x, y, r, startAngle, endAngle, counterClockwise)
		var extra = 20.0;
		
		// center of arc handle
		var mouseInCenter = drawPathBox(cx,cy);
		
		// radius handle
		var mouseInRad = drawControlePointHandle(cx,cy-r);
	
		// start angle control
		ang1Coords = angleToXY(cx,cy,r+extra);
		drawLinesToConrolePoints(cx,cy,ang1Coords[0],ang1Coords[1]);
		var mouseInStart = drawControlePointHandle(ang1Coords[0],ang1Coords[1]);
		
		// end angle control
		ang2Coords = angleToXY(endAngle,cx,cy,r+extra);
		drawLinesToConrolePoints(cx,cy,ang2Coords[0],ang2Coords[1]);
		var mouseInEnd = drawControlePointHandle(ang2Coords[0],ang2Coords[1]);
		
		// mapping circle
		drawCircleForArcs(cx,cy,r, startAngle, endAngle, ccw);
	
		// new end poiont
		var endCo = angleToXY(ang,centerX,centerY,r);
		drawPathX(endCo[0],endCo[1]);
	
		// clockwise/counter clockwise handle
			
		var mouseInCcw = drawArcDirection(cx,cy,r+.5*extra,startAngle,ccw);
		
		if(mouseInCenter){
			this.mouseGrabed = true;
			this.destArgs = [0,1];
			this.srcArgs = [0,1];
			this.type ="line";
		}
		else if(mouseInRad){
			this.mouseGrabed = true;
			this.destArgs = [2];
			this.srcArgs = [0,1];
			this.type ="rad";
		}
		else if(mouseInStart){
			this.mouseGrabed = true;
			this.destArgs = [3];
			this.srcArgs = [0,1];
			this.type ="ang";
		}
		else if(mouseInEnd){
			this.mouseGrabed = true;
			this.destArgs = [4];
			this.srcArgs = [0,1];
			this.type ="ang";
		}
		else if(mouseInCcw){
			this.mouseGrabed = true;
			this.destArgs = [5];
			this.srcArgs = [5];
			this.type ="truefalse";
		}
		else {
			this.mouseGrabed = false;
		}
	},
	
	ellipse: function(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){},	// Adds points to the subpath such that the arc described by the circumference of the ellipse described by the arguments, starting at the given start angle and ending at the given end angle, going in the given direction (defaulting to clockwise), is added to the path, connected to the previous point by a straight line.
																								// Throws an IndexSizeError exception if the given radius is negative.
	rect: function(x, y, w, h){},	// Adds a new closed subpath to the path, representing the given rectangle.


	//7 Path objects
	// not relevant here
	
	//8 Transformations
	currentTransform: {},	// Returns the transformation matrix, as an SVGMatrix object.
							// Can be set, to change the transformation matrix.
	scale: function(x, y){},	// Changes the transformation matrix to apply a scaling transformation with the given characteristics.
	rotate: function(angle){},	// Changes the transformation matrix to apply a rotation transformation with the given characteristics. The angle is in radians.
	translate: function(x, y){}, // Changes the transformation matrix to apply a translation transformation with the given characteristics.
	transform: function(a, b, c, d, e, f){},	// Changes the transformation matrix to apply the matrix given by the arguments as described below.
	setTransform: function(a, b, c, d, e, f){},	// Changes the transformation matrix to the matrix given by the arguments as described below.
	resetTransform: function(){}, // Changes the transformation matrix to the identity transform.

	//9 Image sources for 2D rendering contexts
	// nothing relevant here
	
	//10 Fill and stroke styles
	fillStyle: "",	// Returns the current style used for filling shapes.
					// Can be set, to change the fill style.
					// The style can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.
	strokeStyle: "",	// Returns the current style used for stroking shapes.
						// Can be set, to change the stroke style.
						// The style can be either a string containing a CSS color, or a CanvasGradient or CanvasPattern object. Invalid values are ignored.

	createLinearGradient: function(x0, y0, x1, y1){},	// Returns a CanvasGradient object that represents a linear gradient that paints along the line given by the coordinates represented by the arguments.
	createRadialGradient: function(x0, y0, r0, x1, y1, r1){},	// Returns a CanvasGradient object that represents a radial gradient that paints along the cone given by the circles represented by the arguments.
																// If either of the radii are negative, throws an IndexSizeError exception.
	createPattern: function(image, repetition){},	// Returns a CanvasPattern object that uses the given image and repeats in the direction(s) given by the repetition argument.
													// The allowed values for repetition are repeat (both directions), repeat-x (horizontal only), repeat-y (vertical only), and no-repeat (neither). If the repetition argument is empty, the value repeat is used.
													// If the image isn't yet fully decoded, then nothing is drawn. If the image is a canvas with no data, throws an InvalidStateError exception.

	//11 Drawing rectangles to the bitmap
	clearRect: function(x, y, w, h){},	// Clears all pixels on the bitmap in the given rectangle to transparent black.
	fillRect: function(x, y, w, h){},	// Paints the given rectangle onto the bitmap, using the current fill style.
	strokeRect: function(x, y, w, h){},	// Paints the box that outlines the given rectangle onto the bitmap, using the current stroke style.

	//12 Drawing text to the bitmap
	fillText: function(text, x, y, maxWidth ){},
	strokeText: function(text, x, y, maxWidth ){},	// Fills or strokes (respectively) the given text at the given position. If a maximum width is provided, the text will be scaled to fit that width if necessary.
	measureText: function(text){},	// Returns a TextMetrics object with the metrics of the given text in the current font.

	//13 Drawing paths to the canvas
	beginPath: function(){},	// Resets the current default path.
	fill: function(path){},	// Fills the subpaths of the current default path or the given path with the current fill style.
	stroke: function(path){},	// Strokes the subpaths of the current default path or the given path with the current stroke style.
	drawSystemFocusRing: function(path, element){},	// If the given element is focused, draws a focus ring around the current default path or the given path, following the platform conventions for focus rings.
	drawCustomFocusRing: function(path, element){},	// If the given element is focused, and the user has configured his system to draw focus rings in a particular manner (for example, high contrast focus rings), draws a focus ring around the current default path or the given path and returns false.
													// Otherwise, returns true if the given element is focused, and false otherwise. This can thus be used to determine when to draw a focus ring (see the example below).
	scrollPathIntoView: function(path){},	// Scrolls the current default path or the given path into view. This is especially useful on devices with small screens, where the whole canvas might not be visible at once.
	clip: function(path){},	// Further constrains the clipping region to the current default path or the given path.
	resetClip: function(){},	// Unconstrains the clipping region.
	isPointInPath: function(path, x, y){},	// Returns true if the given point is in the current default path or the given path.
	isPointInStroke: function(path, x, y){},	// Returns true if the given point would be in the region covered by the stroke of the current default path or the given path, given the current stroke style.

	//14 Drawing images
	drawImage: function(image, sx, sy, sw, sh, dx, dy, dw, dh){},	// Draws the given image onto the canvas. The arguments are interpreted as follows:
																// The sx and sy parameters give the x and y coordinates of the source rectangle; the sw and sh arguments give the width and height of the source rectangle; the dx and dy give the x and y coordinates of the destination rectangle; and the dw and dh arguments give the width and height of the destination rectangle.
	//15 Hit regions
	addHitRegion: function(options){},	// Adds a hit region to the bitmap. The argument is an object with the following members:
	removeHitRegion: function(id){},	// Removes a hit region (and all its descendants) from the canvas bitmap. The argument is the ID of a region added using addHitRegion().

	//16 Pixel manipulation
	createImageData: function(sw, sh){},	// Returns an ImageData object with the given dimensions. All the pixels in the returned object are transparent black.
											// Throws an IndexSizeError exception if the either of the width or height arguments are zero.
	createImageData: function(imagedata){},	// Returns an ImageData object with the same dimensions as the argument. All the pixels in the returned object are transparent black.
	createImageDataHD: function(sw, sh){},	// Returns an ImageData object whose dimensions equal the dimensions given in the arguments, multiplied by the number of pixels in the canvas bitmap that correspond to each coordinate space unit. All the pixels in the returned object are transparent black.
											// Throws an IndexSizeError exception if the either of the width or height arguments are zero.
	getImageData: function(sx, sy, sw, sh){},	// Returns an ImageData object containing the image data for the given rectangle of the bitmap.
												// Throws an IndexSizeError exception if the either of the width or height arguments are zero.
												// The data will be returned with one pixel of image data for each coordinate space unit on the canvas (ignoring transforms).
	getImageDataHD: function(sx, sy, sw, sh){},	// Returns an ImageData object containing the image data for the given rectangle of the bitmap.
												// Throws an IndexSizeError exception if the either of the width or height arguments are zero.
												//The data will be returned at the same resolution as the canvas bitmap.
	putImageData: function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight ){},	// Paints the data from the given ImageData object onto the bitmap. If a dirty rectangle is provided, only the pixels from that rectangle are painted.
																							// The globalAlpha and globalCompositeOperation attributes, as well as the shadow attributes, are ignored for the purposes of this method call, pixels in the canvas are replaced wholesale, with no composition, alpha blending, no shadows, etc.
																							// Throws a NotSupportedError exception if any of the arguments are not finite.
																							// Each pixel in the image data is mapped to one coordinate space unit on the bitmap, regardless of the value of the resolution attribute.
	putImageDataHD: function(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight ){},	// Paints the data from the given ImageData object onto the bitmap, at the bitmap's native pixel density (regardless of the value of the ImageData object's resolution attribute). If a dirty rectangle is provided, only the pixels from that rectangle are painted.
																								// The globalAlpha and globalCompositeOperation attributes, as well as the shadow attributes, are ignored for the purposes of this method call, pixels in the canvas are replaced wholesale, with no composition, alpha blending, no shadows, etc.
																								// Throws a NotSupportedError exception if any of the arguments are not finite.

	//17 Compositing
	globalAlpha: 0,	// Returns the current alpha value applied to rendering operations.
					// Can be set, to change the alpha value. Values outside of the range 0.0 .. 1.0 are ignored.
	globalCompositeOperation: {},	// Returns the current composition operation, from the values defined in the Compositing and Blending specification. [COMPOSITE].
									// Can be set, to change the composition operation. Unknown values are ignored.

	//18 Image smoothing
	imageSmoothingEnabled: true,	// Returns whether pattern fills and the drawImage() method will attempt to smooth images if their pixels don't line up exactly with the display, when scaling images up.
									// Can be set, to change whether images are smoothed (true) or not (false).

	//19 Shadows
	shadowColor: "",	// Returns the current shadow color.
						// Can be set, to change the shadow color. Values that cannot be parsed as CSS colors are ignored.
	shadowOffsetX: 0,
	shadowOffsetY: 0,	// Returns the current shadow offset.
						// Can be set, to change the shadow offset. Values that are not finite numbers are ignored.
	shadowBlur: 0	// Returns the current level of blur applied to shadows.
					// Can be set, to change the blur level. Values that are not finite numbers greater than or equal to zero are ignored.



};


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
function drawEditHandles( context, Tree,mousex,mousey){
	
	var startCo = [0,0];
	var endCo = [0,0];
	var moveInfo = undefined;
	

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

			localMoveInfo = drawArc( context, centerX, centerY, r, args[3], ang, args[5], endCo[0], endCo[1],mousex,mousey );
		}

		if( localMoveInfo.mouseGrabed ){
			moveInfo = localMoveInfo;
			moveInfo.codeLineBeingReferenced = i;
			moveInfo.xOld=startCo[0];
			moveInfo.yOld=startCo[1];
		}
	}
	
	return moveInfo;
	
}
