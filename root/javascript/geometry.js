
function rightAngle(x1,y1,x2,y2) {
	return [ -(y2-y1), (x2-x1)];
}

function distance(x1,y1,x2,y2){
	return Math.sqrt( Math.pow((x2-x1),2) + Math.pow((y2-y1),2) );
}

function distancePointToLine(x1,y1,x2,y2,xp,yp){
	// ax+by+1 = 0
	
	//[x1,y1;x2,y2][a:b]+[1;1] = [0;0]
	//[x1,y1;x2,y2][a:b] = [-1;-1]
	//[a;b] = (1/det)[y2,-y1;-x2,x1][-1;-1]
	//[a;b] = (1/det)[-(y2-y1);-(-x2+x1)]
	
	// from http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line

	var det =x1*y2-x2*y1;
	var a=-(y2-y1)/det;
	var b= (x2-x1)/det;
	
	var d= Math.abs( a*xp + b*yp + 1 )/Math.sqrt( Math.pow(a,2)+Math.pow(b,2));
	
	return d;
}

function lenthForRightTriangle( x1,y1,x2,y2){
	return rightAngle(x1,y1,x2,y2);
}


/****
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
***/

// Arc computations and stuff

function angleToXY(angle,x0,y0,r){
	var dx = r*Math.cos(angle);
	var dy = r*Math.sin(angle);
	
	return [x0+dx,y0+dy];
}

function xyToAngle(x,y,x0,y0){ // from 0 to 2PI
	var ang = Math.atan2(y-y0,x-x0);
	if(ang<0){
		ang=2*Math.PI + ang;
	}
	return ang;
}
