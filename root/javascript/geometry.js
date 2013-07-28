	//cheap right angle vector
	
	// v = [ x2-x1,y2-y1]
	// ||v|| = sqrt( (x2-x1)^2 + (y2-y1)^2 )
	// t = [ 
function rightAngle(x1,y1,x2,y2) {
	return [ -(y2-y1), (x2-x1)];
}

function norm(x1,y1,x2,y2){
	return ( Math.power((x2-x1),2) + Math.power((y2-y1),2) );
}

function unitRightAngle(x1,y1,x2,y2){
	var v  = rightAngle(x1,y1,x2,y2);
	var n = norm(x1,y1,x2,y2);
	
	return [ v[0]/n , v[1]/n];
}

function scaleRightAngle(x1,y1,x2,y2,l){
	var v  = rightAngle(x1,y1,x2,y2);
	var n = norm(x1,y1,x2,y2);
	
	return [ v[0]*(l/n) , v[1]*(l/n)];
}


// Arc computations and stuff

function angleToXY(angle,x0,y0,r){
	dx = r*Math.cos(angle);
	dy = r*Math.sin(angle);
	
	return [x0+dx,y0+dy];
}

function xyToAngle(x,y,x0,y0){
	// for first quadrent
	ang = Math.atan2(y-y0,x-x0);
}

