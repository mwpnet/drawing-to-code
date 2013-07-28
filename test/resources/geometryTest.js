

module("geometry.js");

test( "rightAngle test",5, function() {
	
	deepEqual(rightAngle(0,0,1,0),[0,1], "basic right angle #1");
	deepEqual(rightAngle(0,0,0,1),[-1,0], "basic right angle #2");
	deepEqual(rightAngle(0,0,-1,0),[0,-1], "basic right angle #3");
	deepEqual(rightAngle(0,0,0,-1),[1,0], "basic right angle #4");

	deepEqual(rightAngle(10,20,30,40),[-20,20], "complex right angle #1");

});

