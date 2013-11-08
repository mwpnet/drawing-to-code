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



module("geometry.js");

test( "rightAngle test",5, function() {
	
	deepEqual(rightAngle(0,0,1,0),[0,.5], "basic right angle #1");
	deepEqual(rightAngle(0,0,0,1),[.5,0], "basic right angle #2");
	deepEqual(rightAngle(0,0,-1,0),[0,-.5], "basic right angle #3");
	deepEqual(rightAngle(0,0,0,-1),[-.5,0], "basic right angle #4");

	deepEqual(rightAngle(10,20,30,40),[10,10], "complex right angle #1");

});

test("distance test",6, function(){
	equal( distance(0,0,0,1),1,"distance test #1");
	equal( distance(0,0,1,0),1,"distance test #1");
	equal( distance(0,1,0,0),1,"distance test #1");
	equal( distance(1,0,0,0),1,"distance test #1");
	equal( distance(0,0,3,4),5,"distance test #1");
	equal( distance(10,12,13,16),5,"distance test #1");
});

test("distancePointToLine test",4,function(){
	equal(distancePointToLine(0,0,0,10,5,5),5,"distancePointToLine test #1");
	equal(distancePointToLine(0,0,10,0,5,5),5,"distancePointToLine test #2");
	equal(distancePointToLine(100,0,200,0,5,5),5,"distancePointToLine test #3");
	equal(distancePointToLine(0,0,10,10,5,0).toFixed(10),(5.0*Math.SQRT1_2).toFixed(10),"distancePointToLine test #4");
});

test("angleToXY",4, function(){
	//angleToXY(angle,x0,y0,r)
	var res = angleToXY(0,10,20,30);
	deepEqual( Math.round(res[0]),40,"0 degrees part a");
	deepEqual( Math.round(res[1]),20,"0 degrees part b");

	res = angleToXY(Math.PI/2,10,20,30);
	deepEqual( Math.round(res[0]),10,"90 degrees part a");
	deepEqual( Math.round(res[1]),50,"90 degrees part b");
});

test("xyToAngle",3, function(){
	//xyToAngle(x,y,x0,y0)
	equal( xyToAngle(30,20,10,20),0.0000,"0 degrees");
	equal( xyToAngle(10,40,10,20).toFixed(4),(Math.PI/2).toFixed(4),"90 degrees");
	equal( xyToAngle(10,10,10,20).toFixed(4),(3*Math.PI/2).toFixed(4),"270 degrees");
});

test("absoluteHalfAng",4,function(){
	equal(absoluteHalfAng(0,10,0,0,10,0),Math.PI/4.0,"absoluteHalfAng test #1");
	equal(absoluteHalfAng(10,0,0,0,0,10),Math.PI/4.0,"absoluteHalfAng test #2");
	equal(absoluteHalfAng(50,86.60254037844386,0,0,20,0),Math.PI/6.0,"absoluteHalfAng #3");
	
	// from http://en.wikipedia.org/wiki/Right_triangle
	// for 3:4:5 triangle - cos=3/5 sin=4/5 tan=4/3
	equal(absoluteHalfAng( 50.0*(3.0/5.0), 50.0*(4.0/5.0),0,0,20,0), Math.atan(4.0/3.0)/2.0,"absoluteHalfAng #4");
});

test("computArcToParameters",7, function(){
	//computArcToParameters(x0,y0,x1,y1,x2,y2,r)
	//[cx,cy,angle0,angle1,anticlockwise,x4,y4]
	var res = computArcToParameters(10,10,20,10,20,50,5);
	equal(res[0],15,"computArcToParameters part a");
	equal(res[1],15,"computArcToParameters part b");
	equal(res[2],-Math.PI/2,"computArcToParameters part c");
	equal(res[3],0.0,"computArcToParameters part d");
	equal(res[4],false,"computArcToParameters part e");
	equal(res[5],20,"computArcToParameters part f");
	equal(res[6],15,"computArcToParameters part g");

	// problem from actual code
	//res = computArcToParameters( 56.89110345937689, 124.74017793222384, -114, -72, 124, 202, 50)
	//deepEqual(res,[],"right angle part h");
});

//absoluteHalfAng
//distancePointToLine

test("computRad",3, function(){
	//computRad(xp,yp,x1,y1,cx,cy,d)
	
	equal(computRad(0,5,0,0,10,0,5).toFixed(10),(5.0 *Math.SQRT1_2).toFixed(10),"part 1");
	equal(computRad(10,25,10,20,20,20,5).toFixed(10),(5.0 *Math.SQRT1_2).toFixed(10),"part 2");
	
	// from http://en.wikipedia.org/wiki/Right_triangle
	// for 3:4:5 triangle - cos=3/5 sin=4/5 tan=4/3
	// cos(a/2)^2-sin(a/2)^2=3/5 -> 1-2*sin(a/2)^2 = 3/5 -> 2*sin(a/2)^2 = 2/5 -> sin(a/2)^2=1/5 
	equal(computRad( 50.0*(3.0/5.0), 50.0*(4.0/5.0),0,0,20,0,5).toFixed(10),(5.0/Math.sqrt(5.0)).toFixed(10),"part 3");
	
});
