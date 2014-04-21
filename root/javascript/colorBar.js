

var colorBarXrefArray = ["#ff0000","#00ff00","#0000ff"];

// object to handle a color bar. Currently only handles red, green, and blue bars.

function colorBars ( width, height ){
	var that = this;
	
	var markerSize = height/5;
	
	var bar = {
			red: {
				color: "red",
				element: document.createElement('canvase'),
				ctx:undefined,
				grd:undefined,
				value: 128,
				xPos: width/2
			},
			green: {
				color: "green",
				element: document.createElement('canvase'),
				ctx:undefined,
				grd:undefined,
				value:128,
				xPos: width/2
			},
			blue: {
				color: "blue",
				element: document.createElement('canvase'),
				ctx:undefined,
				grd:undefined,
				value:128,
				xPos: width/2
			}
	};
	

	var drawGrad = function( color ){
		bar[color].ctx.fillStyle = bar[color].grd;
		bar[color].ctx.fillRect( markerSize,0, width,height );
	};
	
	var drawMarker = function ( color ){
		bar[color].ctx.beginPath();
		bar[color].ctx.moveTo(bar[color].xPos-markerSize, 0);
		bar[color].ctx.lineTo(bar[color].xPos, markerSize);
		bar[color].ctx.lineTo(bar[color].xPos+markerSize, 0);
		bar[color].ctx.closePath();
		bar[color].ctx.fillStyle = "#808080";
		bar[color].ctx.fill();
	};


	///
	// still need to work on
	this.myMouseDown = function (e){ //XXX
		var x = event.clientX, y = event.clientY,
	    elementMouseIsOver = document.elementFromPoint(x, y);
		
		var rect = canvas.getBoundingClientRect();

		return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        intensityX = e.pageX - that.canvas.offsetLeft;
		
		this.colorHex = xTocolorHex(intensityX);
		updateColorFunction(color,this.colorHex);
		
		animate = true;
		requestAnimFrame( that.draw);
		requestAnimFrame( updateStrokeStyle);
	};

	this.myMouseUp = function (e){
		animate = false;
	};
	
	this.myMouseMove = function(e){ //XXX
		if(animate){
			intensityX = e.pageX - that.canvas.offsetLeft;
			this.colorHex = xTocolorHex(intensityX);
			updateColorFunction(colorIndex,that.colorHex);
			requestAnimFrame( that.draw);
			requestAnimFrame( updateStrokeStyle);
		}
	};
	
	//
	///
	
	var xTocolorHex = function(x){
		return (x/width)*0xFF;
	};
	var colorHexToX = function(colorHex){
		return (colorHex/0xFF)*width;
	};
	
	for( var color in bar){
		bar[color].element.width = width;
		bar[color].element.height=height;

		bar[color].ctx = bar[color].element.getContext('2d');

		bar[color].grd = bar[color].ctx.createLinearGradient(0,height/2, width, height/2);
		bar[color].grd.addColorStop(0,"#000000");
		bar[color].grd.addColorStop(1,color);

		drawGrad(name);
		drawMarker( color );

		bar[color].element.addEventListener('onmousedown',that.myMouseDown,false);
		bar[color].element.addEventListener('onmouseup',that.myMouseUp,false);
		bar[color].element.addEventListener('onmousemove',that.myMouseMove,false);
	}


}


