///////////////////////////
function slopeInter(x0,y0,x1,y1){
	var m = (y1-y0)/(x1-x0);
	var b = y1-m*x1;
	
	return [m,b];
}


function perpendiculerSlope(m,b){
	return -1.0/m;
}

/////////////////////////////////////////
function rightAngle(x1,y1,x2,y2) {
	// trying to 
	//(x2-cx)^2 +(y2-cy)^2  +  (cx-x1)^2 + (cy-y1)^2 = (x2-x1)^2 + (y2-y1)^2
	//x2^2 - 2*x2*cx + cx^2 + y2^2 - 2*y2*cy +cy^2 + cx^2 -2*cx*x1 + x1^2 +cy^2 - 2*cy*y1 + y1^2 = x2^2 -2*x2*x1 + x1^2 +y2^2 -2*y2*y1+y1^2
	// -2*x2*cx + cx^2  -2*y2*cy +cy^2 + cx^2 -2*cx*x1  +cy^2 - 2*cy*y1 =  -2*x2*x1 -2*y2*y1
	// -x2*cx + cx^2  -y2*cy +cy^2  -cx*x1  -cy*y1 =  -x2*x1 -y2*y1
	// cx^2 -x2*cx-cx*x1-x2*x1 + cy^2-y2*cy-cy*y1-y2*y1=0
	// cx^2 -(x2-x1)*cx-x2*x1 + cy^2-(y2-y1)*cy-y2*y1=0
	

	//	(x2-cx)^2 +(y2-cy)^2 = (cx-x1)^2 + (cy-y1)^2
	// x2^2-2*x2*cx+cx^2 + y2^2-2*y2*cy +cy^2 = cx^2-2*cx*x1 +x1^2 + cy^2-2*cy*y1+y1^2
	// x2^2-2*x2*cx+ + y2^2-2*y2*cy  = -2*cx*x1 +x1^2 -2*cy*y1+y1^2
	// x2^2-x1^2 -2*(x2-x1)*cx + y2^2-y1^2 -2*(y2-y1)*cy =0
	
	return [ (y2-y1)/2.0, (x2-x1)/2.0];
}

function centerOfLine(x1,y1,x2,y2) {
	return [ (x1+x2)/2.0, (y1+y2)/2.0];	
}

function rightAngleCorner(x1,y1,x2,y2) {
	ce = centerOfLine(x1,y1,x2,y2);
	ri = rightAngle(x1,y1,x2,y2);
	
	return [ ce[0]+ri[0], ce[1]+ri[1]];
}

function distance(x1,y1,x2,y2){
	return Math.sqrt( Math.pow((x2-x1),2) + Math.pow((y2-y1),2) );
}

function distancePointToLine(x1,y1,x2,y2,xp,yp){
	// from http://mathworld.wolfram.com/Point-LineDistance2-Dimensional.html
	var dx21 = x2-x1;
	var dy21 = y2-y1;
	 
	var dx1p = x1-xp;
	var dy1p = y1-yp;
	
	det = Math.sqrt( dx21*dx21 + dy21*dy21);
	
	d = Math.abs( dx21 * dy1p - dx1p * dy21)/det;
	 
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
	return normalizeAngle(ang);
}

function normalizeAngle(ang){
	if(ang<0.0){
		ang += 2*Math.PI;
	}
	else if(ang >2*Math.PI){
		ang -= 2*Math.PI;
	}
	return ang;
}
/////////////////////
// all the stuff needed for arcTo

function centerFromLines( x0,y0,x1,y1,x2,y2){
	
}

function bisectorOfLines( x0,y0,x1,y1,x2,y2){
	
}

function innerAngle( x0,y0,x1,y1,x2,y2){
	/** -- trying another way
	var v1 = [ x0-x1, y0-y1 ];
	var v2 = [ x2-x1, y2-y1 ];
	
	var d1 = distance(x0,y0,x1,y1);
	var d2 = distance(x2,y2,x1,y1);
	
	if( d1==0 || d2==0){
		return 0;
	}
	
	var dot = Math.abs(v1[0]*v2[0] + v1[1]*v2[1]);
	
	var ang = Math.acos( dot/(d1*d2));
	
	return ang;
	**/
	
	var a1 = Math.atan2(y0-y1,x0-x1);
	var a2 = Math.atan2(y2-y1,x2-x1);
	
	var ang = a1-a2;
	
	if( ang >Math.Pi ){
		ang = ang - 2*Math.Pi;
	}
	return ang;
}

function absoluteHalfAng( x0,y0,x1,y1,x2,y2){
	
	var a1 = Math.atan2(y0-y1,x0-x1);
	var a2 = Math.atan2(y2-y1,x2-x1);

	var ang = (a1+a2)/2.0;

	return ang;
}

//////////////////////////////
// taken directly from
//    https://hg.mozilla.org/mozilla-central/file/e97819582eed/content/canvas/src/nsCanvasRenderingContext2D.cpp
// the nsCanvasRenderingContext2D::ArcTo method
// -XXX - need to figure out licensing

function computArcToParameters(x0,y0,x1,y1,x2,y2,r){
	var dir = (x2-x1)*(y0-y1) + (y2-y1)*(x1-x0); // ???
	
	var a2 = (x0-x1)*(x0-x1) + (y0-y1)*(y0-y1); //distance from p0 to p1
	var b2 = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2); //distance from p1 to p2
	var c2 = (x0-x2)*(x0-x2) + (y0-y2)*(y0-y2); //distance from p0 to p2
	
	var cosx = (a2+b2-c2)/(2*Math.sqrt(a2*b2)); // the cos of the angle p0-p1-p2
	var sinx = Math.sqrt(1 - cosx*cosx); // the sin of the angle p0-p1-p2
	
	var d = r / ((1 - cosx) / sinx); // ???
	//var d = r * Math.sqrt(1 + cosx); // if I got my math right
	
	var anx = (x1-x0) / Math.sqrt(a2); // unit vector from p1 towards p0
	var any = (y1-y0) / Math.sqrt(a2); //   ...
	var bnx = (x1-x2) / Math.sqrt(b2); // unit vector from p1 towards p2
	var bny = (y1-y2) / Math.sqrt(b2); //   ...
	
	var x3 = x1 - anx*d; // vector from p1 towards p0, ending at tangent to circle
	var y3 = y1 - any*d; //   ...
	var x4 = x1 - bnx*d; // vector from p1 towards p2, ending at tangent to circle
	var y4 = y1 - bny*d; //   ...
	
	var anticlockwise = (dir < 0);
	
	var cx = x3 + any*r*(anticlockwise ? 1 : -1);
	var cy = y3 - anx*r*(anticlockwise ? 1 : -1);
	
	var angle0 = Math.atan2((y3-cy), (x3-cx));
	var angle1 = Math.atan2((y4-cy), (x4-cx));

	return [cx,cy,angle0,angle1,anticlockwise,x4,y4];
}

function computCenterToParameters(cx,cy,x1,y1,x2,y2){
	//var dir = (x2-x1)*(y0-y1) + (y2-y1)*(x1-x0); // ???
	
	//var a2 = (x0-x1)*(x0-x1) + (y0-y1)*(y0-y1); //distance from p0 to p1
	var b2 = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2); //distance from p1 to p2
	//var c2 = (x0-x2)*(x0-x2) + (y0-y2)*(y0-y2); //distance from p0 to p2
	
	//var cosx = (a2+b2-c2)/(2*Math.sqrt(a2*b2)); // the cos of the angle p0-p1-p2
	//var sinx = Math.sqrt(1 - cosx*cosx); // the sin of the angle p0-p1-p2
	
	//var d = r / ((1 - cosx) / sinx); // ???
	//var d = r * Math.sqrt(1 + cosx); // if I got my math right
	
	//var anx = (x1-x0) / Math.sqrt(a2); // unit vector from p1 towards p0
	//var any = (y1-y0) / Math.sqrt(a2); //   ...
	var bnx = (x1-x2) / Math.sqrt(b2); // unit vector from p1 towards p2
	var bny = (y1-y2) / Math.sqrt(b2); //   ...
	
	//var x3 = x1 - anx*d; // vector from p1 towards p0, ending at tangent to circle
	//var y3 = y1 - any*d; //   ...
	var x4 = x1 - bnx*d; // vector from p1 towards p2, ending at tangent to circle
	var y4 = y1 - bny*d; //   ...
	
	//var anticlockwise = (dir < 0);
	
	var cx = x4 - bny*r*(anticlockwise ? 1 : -1);
	var cy = y4 + bnx*r*(anticlockwise ? 1 : -1);
	
	// cx-x4 = -bny*r*s;
	// cy-y4 = bnx*r*s;
	var dx=(cx-x4)/bny;
	var dy=(cy-y4)/bnx;
	
	var r=Math.sqrt( dx*dx+dy*dy);
	
	//var angle0 = Math.atan2((y3-cy), (x3-cx));
	var angle1 = Math.atan2((y4-cy), (x4-cx));
		
	return [r,angle1,x4,y4];
}

///////////////////////////////////
// given three points x0,y0 x1,y1 and x2,y2
// and a distance d from x1,y1 hwo big a 
// circle would fit into the wedge.
//
function computRad(x0,y0,x1,y1,x2,y2,d){

	var ang = absoluteHalfAng( x0,y0,x1,y1,x2,y2);
	var dx = d * Math.cos(ang)+x1;
	var dy = d * Math.sin(ang)+y1;
	
	var newr = distancePointToLine(x1,y1,x2,y2,dx,dy);
	return newr;
}
