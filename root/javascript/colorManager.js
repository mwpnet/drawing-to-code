

// there are three bars, one square, and text input
// if one of the bars is clicked, the new valueis retrieved, and the square and text input areupdated.
// if the text area has a 


// for RGB

var colorGroup = {
		red:{
			start: "#000000",
			end:   "#FF0000"
		},
		green:{
			start: "#000000",
			end:   "#00FF00"
		},
		blue:{
			start: "#000000",
			end:   "#0000FF"
		}
};


function colorBar (elementId,color){
	var that = this;
	
	var canvas = document.getElementById(elementId);
	var context = element.getContext('2d');
	var width = element.width();
	var height = element.height();
	
	var intensityX = width;
	
	this.color = 0xFF;
	
	var animate = false;

	var grad = context.createLinearGradient(0,height/2, width, height/2);
	grad.addColorStop(0,"#000000");
	grad.addColorStop(1,color);
	
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
		
		this.color = xToColor(intensityX);
		animate = true;
		requestAnimFrame( that.draw());
	};

	this.myMouseUp = function (e){
		animate = false;
	};
	
	this.myMouseMove = function(e){
		intensityX = e.pageX - that.canvas.offsetLeft;
		if(animate){
			this.color = xToColor(intensityX);
			requestAnimFrame( that.draw());
		}
	};
	
	var xToColor = function(x){
		return (x/width)*0xFF;
	};
	var colorToX = function(colorHex){
		return (colorHex/0xFF)*width;
	};
	
	
	canvas.addEventListener('onmousedown',that.myMouseDown,false);
	canvas.addEventListener('onmouseup',that.myMouseUp,false);
	canvas.addEventListener('onmousemove',that.myMouseMove,false);
	
}


