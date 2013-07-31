

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
