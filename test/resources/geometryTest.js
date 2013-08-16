

module("geometry.js");

test( "rightAngle test",5, function() {
	
	deepEqual(rightAngle(0,0,1,0),[0,1], "basic right angle #1");
	deepEqual(rightAngle(0,0,0,1),[-1,0], "basic right angle #2");
	deepEqual(rightAngle(0,0,-1,0),[0,-1], "basic right angle #3");
	deepEqual(rightAngle(0,0,0,-1),[1,0], "basic right angle #4");

	deepEqual(rightAngle(10,20,30,40),[-20,20], "complex right angle #1");

});

test("distance test",6, function(){
	equal( distance(0,0,0,1),1,"distance test #1");
	equal( distance(0,0,1,0),1,"distance test #1");
	equal( distance(0,1,0,0),1,"distance test #1");
	equal( distance(1,0,0,0),1,"distance test #1");
	equal( distance(0,0,3,4),5,"distance test #1");
	equal( distance(10,12,13,16),5,"distance test #1");
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

test("computArcToParameters",7, function(){
	//computArcToParameters(x0,y0,x1,y1,x2,y2,r)
	//[cx,cy,angle0,angle1,anticlockwise,x4,y4]
	var res = computArcToParameters(10,10,20,10,20,50,5);
	equal(res[0],15,"right angle part a");
	equal(res[1],15,"right angle part b");
	equal(res[2],-Math.PI/2,"right angle part c");
	equal(res[3],0.0,"right angle part d");
	equal(res[4],false,"right angle part e");
	equal(res[5],20,"right angle part f");
	equal(res[6],15,"right angle part g");

	// problem from actual code
	res = computArcToParameters( 56.89110345937689, 124.74017793222384, -114, -72, 124, 202, 50)
	deepEqual(res,[],"right angle part g");
});

test("computRad",3, function(){
	//computRad(xp,yp,x1,y1,cx,cy)
	
	deepEqual(computRad(0,5,0,0,10,0),[5,0],"part 1");
	deepEqual(computRad(10,25,10,20,20,20),[15,20],"part 2");
	deepEqual(computRad(15,0,0,0,3,4),[9,12],"part 3");
	
});
