/**
 * 
 * We draw on the canvase twice. Once with the reguler context,
 * and once with this context.
 * 
 */

function newContext (context){
	
	drawPathBox: function (x,y) {
		var size=10.0;
		context.save();
	    context.moveTo(x-size/2.0, y-size/2.0);
	    context.lineTo(x-size/2.0, y+size/2.0);
	    context.lineTo(x+size/2.0, y+size/2.0);
	    context.lineTo(x+size/2.0, y-size/2.0);
		context.closePath();
		var mouseIn = ctx.isPointInPath;
		context.restore();
		return mouseIn;
	}
	
	drawCurveHandles: function ( cx,cy){
		var size=10.0;
		context.save();
		context.moveTo(cx+size/2.0,cy);
	    context.arc(cx, cy, size/2.0, 0, 2.0 * Math.PI, false);
		var mouseIn = ctx.isPointInPath;
		context.restore();
		return mouseIn;
	}
	
	drawCurveHandlesLines: function (cx,cy,x,y){
		context.save();
		context.moveTo(x,y);
		context.lineTo(cx,cy);
		var mouseIn = ctx.isPointInPath;
		context.restore();
		return mouseIn;
	}
	
	////////////////////////////////////
	
	var xold = 0;
	var yold = 0;
	
	moveTo: function (x,y){
		return this.drawPathBox(x,y);
	}
	
	lineTo:function (x,y){
		return this.drawPathBox(x,y);
	}
	
	bezierCurveTo:function (cx1,cy1,cx2,cy2,x,y) {
		this.drawCurveHandlesLines(cx1,cy1,xold,yold);
		this.drawCurveHandles(cx1,cy1);
	
		this.drawPathBox(x,y);
	
		this.drawCurveHandles(cx2,cy2);
		this.drawCurveHandlesLines(cx2,cy2,x,y);
	}
	
	
	drawQuadraticCurveTo: function (cx,cy,x,y) {
		this.drawPathBox(x,y);
	
		this.drawCurveHandlesLines(cx,cy,xold,yold);
		this.drawCurveHandlesLines(cx,cy,x,y);
		this.drawCurveHandles(cx,cy);
	}
}

	