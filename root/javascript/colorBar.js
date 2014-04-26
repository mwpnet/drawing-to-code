

var colorBarXrefArray = ["#ff0000","#00ff00","#0000ff"];

// object to handle a color bar. Currently only handles red, green, and blue bars.

function colorBars ( width, height, callback ){
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
	///
	// still need to work on
	
	//this.bar[color].element.addEventListener('onmousedown',that.myMouseDown,false);
	//this.bar[color].element.addEventListener('onmouseup',that.myMouseUp,false);
	//this.bar[color].element.addEventListener('onmousemove',that.myMouseMove,false);\
	var animate = "";

	function animateColorBar(e){
	    if( animate !="red" && animate !="green" && animate !="blue"){
			animate="";
			return;
		}

	    drawMarker(animate);
	    updateColorBox(animate);
	    updatePreviewBox();
        updateCssBox();

        //requestAnimFrame( animateColorBar);
	};
	
	function xToColorHex(x){
		return Math.floor( (x/width)*0xFF );
	};
	function colorHexToX(colorHex){
		return Math.floor( (colorHex/0xFF)*width );
	};

	for( var colorLoop in this.bar){
		this.bar[colorLoop].element.width = width;
		this.bar[colorLoop].element.height = height;

		this.bar[colorLoop].ctx = this.bar[colorLoop].element.getContext('2d');

		this.bar[colorLoop].grd = this.bar[colorLoop].ctx.createLinearGradient(0,height/2, width, height/2);
		this.bar[colorLoop].grd.addColorStop(0,"#000000");
		this.bar[colorLoop].grd.addColorStop(1,colorLoop);

		this.bar[colorLoop].element.onmouseup = function (e){ animate=""; };

		drawGrad(colorLoop);
		drawMarker( colorLoop );
		updateColorBox(colorLoop);
	}

	///// can't seem to get these working as closures
	this.bar["red"].element.onmousedown = function (e){
		animate="red";
		requestAnimFrame( animateColorBar);
	};
	this.bar["red"].element.onmousemove = function (e){
		var leftSide = that.bar["red"].element.getBoundingClientRect().left;
		var localX = e.clientX - leftSide;
		that.bar["red"].value = xToColorHex(localX);
        requestAnimFrame( animateColorBar);
	};
	this.bar["red"].textBox.onchange=function(e){
		that.bar["red"].value = parseInt(that.bar["red"].textBox.value,16);
        drawMarker("red");
    	updatePreviewBox();
        updateCssBox();
	};

	
	
	this.bar["green"].element.onmousedown = function (e){
		animate="green";
		requestAnimFrame( animateColorBar);
	};
	this.bar["green"].element.onmousemove = function (e){
		var leftSide = that.bar["green"].element.getBoundingClientRect().left;
		var localX = e.clientX - leftSide;
		that.bar["green"].value = xToColorHex(localX);
        requestAnimFrame( animateColorBar);
	};
	this.bar["green"].textBox.onchange=function(e){
		that.bar["green"].value = parseInt(that.bar["green"].textBox.value,16);
        drawMarker("green");
    	updatePreviewBox();
        updateCssBox();
	};

	
	
	this.bar["blue"].element.onmousedown = function (e){
		animate="blue";
		requestAnimFrame( animateColorBar);
	};
	this.bar["blue"].element.onmousemove = function (e){
		var leftSide = that.bar["blue"].element.getBoundingClientRect().left;
		var localX = e.clientX - leftSide;
		that.bar["blue"].value = xToColorHex(localX);
        requestAnimFrame( animateColorBar);
	};
	this.bar["blue"].textBox.onchange=function(e){
		that.bar["blue"].value = parseInt(that.bar["blue"].textBox.value,16);
        drawMarker("blue");
    	updatePreviewBox();
        updateCssBox();
	};

	
	
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
        
	};
	updatePreviewBox();
    updateCssBox();
	
}


