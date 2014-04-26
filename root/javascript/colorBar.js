
// object to handle a color bar. Currently only handles red, green, and blue bars.

function colorBars ( width, height, initColor,callback ){
	var that = this;
	
	var markerSize = height/3;
	
	this.cssInput = document.createElement('input');
	this.previewBoxElement = document.createElement('canvas');
	this.previewBox = this.previewBoxElement.getContext('2d');
	
	this.bar = {
			red: {
				color: "red",
				element: document.createElement('canvas'),
				textBox: document.createElement('input'),
				ctx:undefined,
				grd:undefined,
				value: 0,
			},
			green: {
				color: "green",
				element: document.createElement('canvas'),
				textBox: document.createElement('input'),
				ctx:undefined,
				grd:undefined,
				value:128,
			},
			blue: {
				color: "blue",
				element: document.createElement('canvas'),
				textBox: document.createElement('input'),
				ctx:undefined,
				grd:undefined,
				value:255,
			}
	};
	
	function drawGrad( color ){
		that.bar[color].ctx.fillStyle = that.bar[color].grd;
		that.bar[color].ctx.fillRect( 0,markerSize, width,height );
	};
	
	function drawMarker( color ){
		var pos = colorHexToX(that.bar[color].value);
		that.bar[color].ctx.save();
		that.bar[color].ctx.clearRect(0,0, width,markerSize);
		that.bar[color].ctx.beginPath();
		that.bar[color].ctx.moveTo(pos-markerSize, 0);
		that.bar[color].ctx.lineTo(pos, markerSize);
		that.bar[color].ctx.lineTo(pos+markerSize, 0);
		that.bar[color].ctx.closePath();
		that.bar[color].ctx.fillStyle = "#000000";
		that.bar[color].ctx.fill();
		that.bar[color].ctx.restore();
	};

	function updatePreviewBox(){
		that.previewBox.fillStyle = rgbArrayCssColor([ that.bar.red.value, that.bar.green.value, that.bar.blue.value ]);
		that.previewBox.fillRect( 0,0, that.previewBoxElement.width, that.previewBoxElement.height );
		that.previewBox.strokeStyle="black";
		that.previewBox.lineWidth=5;
		that.previewBox.strokeRect( 0,0, that.previewBoxElement.width, that.previewBoxElement.height );
	};

	function updateCssBox(){
		that.cssInput.value = rgbArrayCssColor([
		                                     that.bar.red.value,
		                                     that.bar.green.value,
		                                     that.bar.blue.value
		                                     ]);
	}
	
	function updateColorBox(color){
		that.bar[color].textBox.value = that.bar[color].value.toString(16);
	}


	var animate = "";

	function animateColorBar(e){
	    if( !( animate in that.bar) ){
			animate="";
			return;
		}

	    drawMarker(animate);
	    updateColorBox(animate);
	    updatePreviewBox();
        updateCssBox();
        callback(that.cssInput.value);
        //requestAnimFrame( animateColorBar);
	};
	
	function xToColorHex(x){
		return Math.floor( (x/width)*0xFF );
	};
	function colorHexToX(colorHex){
		return Math.floor( (colorHex/0xFF)*width );
	};

	function getValLimit(inObj){
		var val = parseInt(inObj.value,16);
		if( val > 0xFF ){
			inObj.value =  (0xFF).toString(16);
			val=0xFF;
		}
		if( val < 0 ){
			inObj.value =  "0";
			val=0;
		}
		return val;
	}
	
	//////////////////
	//initalization
	var initColorArray=[0x80,0x80,0x80];
	if(typeof(initColor) == "string"){ //css color
		initColorArray = cssColorToArray(initColor);
	}
	else if(typeof(initColor) == "number"){ // hex color
		initColorArray = rgbHexToArray(initColor);
	}
	else if(typeof(initColor) == "array"){ 
		initColorArray = initColor;
	}

	that.bar.red.value = initColorArray[0];
    that.bar.green.value = initColorArray[1];
    that.bar.blue.value = initColorArray[2];

	for( var colorLoop in this.bar){
		this.bar[colorLoop].element.width = width;
		this.bar[colorLoop].element.height = height;

		this.bar[colorLoop].ctx = this.bar[colorLoop].element.getContext('2d');

		this.bar[colorLoop].grd = this.bar[colorLoop].ctx.createLinearGradient(0,height/2, width, height/2);
		this.bar[colorLoop].grd.addColorStop(0,"#000000");
		this.bar[colorLoop].grd.addColorStop(1,colorLoop);

		this.bar[colorLoop].element.onmousedown = (function(localColor) {
							return function (e){
										animate=localColor;
										var leftSide = that.bar[localColor].element.getBoundingClientRect().left;
										var localX = e.clientX - leftSide;
										that.bar[localColor].value = xToColorHex(localX);
										requestAnimFrame( animateColorBar);
									};
						} )(colorLoop);
		this.bar[colorLoop].element.onmousemove = (function(localColor){
							return function (e){
							    if( !( animate in that.bar) ){
									animate="";
									return;
								}
								var leftSide = that.bar[localColor].element.getBoundingClientRect().left;
								var localX = e.clientX - leftSide;
								that.bar[localColor].value = xToColorHex(localX);
						        requestAnimFrame( animateColorBar);
							};
						})(colorLoop);
		this.bar[colorLoop].element.onmouseup = function (e){ animate=""; };

		
		this.bar[colorLoop].textBox.onchange=(function(localColor){
							return function(e){
								that.bar[localColor].value = getValLimit( that.bar[localColor].textBox );
						        drawMarker(localColor);
						    	updatePreviewBox();
						        updateCssBox(animateColorBar);
						        callback(that.cssInput.value);
							};
						})(colorLoop);

		drawGrad(colorLoop);
		drawMarker( colorLoop );
		updateColorBox(colorLoop);
	}

		
	this.previewBoxElement.width = 2*height;
	this.previewBoxElement.height = height;
	
	this.cssInput.onchange = function (){
		var colors = cssColorToArray(that.cssInput.value);
		that.bar.red.value = colors[0];
        that.bar.green.value = colors[1];
        that.bar.blue.value = colors[2];
        
        updateColorBox("red");
        updateColorBox("green");
        updateColorBox("blue");
        
        drawMarker("red");
        drawMarker("green");
        drawMarker("blue");
    	updatePreviewBox();
        callback(that.cssInput.value);
        
	};
	updatePreviewBox();
    updateCssBox();
    callback(that.cssInput.value);
	
}


