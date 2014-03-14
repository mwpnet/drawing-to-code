

var colorBarXrefArray = ["#ff0000","#00ff00","#0000ff"];

// object to handle a color bar. Currently only handles red, green, and blue bars.

function colorBar (elementId,colorIndex,updateColorFunction){
	var that = this;
	
	var canvas = document.getElementById(elementId);
	var context = element.getContext('2d');
	var width = element.width();
	var height = element.height();
	
	var intensityX = width;
	
	this.colorHex = 0xFF;
	
	var animate = false;

	var grad = context.createLinearGradient(0,height/2, width, height/2);
	grad.addColorStop(0,"#000000");
	grad.addColorStop(1,colorBarXrefArray[colorIndex]);
	
	this.draw = function (){
		context.beginPath();
		context.fillRect(0,0,width,height);
		context.fillStyle = grad;
		
		context.beginPath();
		context.moveTo(intensityX-height/4, 0);
		context.lineTo(intensityX, height/4);
		context.lineTo(intensityX-height/4, 0);
		context.closePath();
		context.fillStyle = "#808080";
		context.fill();
	};

	this.myMouseDown = function (e){
		intensityX = e.pageX - that.canvas.offsetLeft;
		
		this.colorHex = xTocolorHex(intensityX);
		updateColorFunction(color,this.colorHex);
		
		animate = true;
		requestAnimFrame( that.draw());
	};

	this.myMouseUp = function (e){
		animate = false;
	};
	
	this.myMouseMove = function(e){
		if(animate){
			intensityX = e.pageX - that.canvas.offsetLeft;
			this.colorHex = xTocolorHex(intensityX);
			updateColorFunction(colorIndex,that.colorHex);
			requestAnimFrame( that.draw());
		}
	};
	
	var xTocolorHex = function(x){
		return (x/width)*0xFF;
	};
	var colorHexToX = function(colorHex){
		return (colorHex/0xFF)*width;
	};
	
	
	canvas.addEventListener('onmousedown',that.myMouseDown,false);
	canvas.addEventListener('onmouseup',that.myMouseUp,false);
	canvas.addEventListener('onmousemove',that.myMouseMove,false);
	
}


