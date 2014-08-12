/*
The MIT License (MIT)

Copyright (c) 2014 Xavier Hardy

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
function Bar(cnvs){
	this.prototype = new DrawnObject(cnvs);
	this.prototype.constructor = this;
	this.update = function(){DrawnObject.prototype.update.call(this);};
	this.clearBuffer = function(){DrawnObject.prototype.clearBuffer.call(this);};
	this.init = function(){DrawnObject.prototype.init.call(this);};
	this.canvasContext = cnvs.getContext("2d");
	this.w = 150;
	this.h = 30;
	this.vertical = false;
	this.colors = [new Section(0.5,"#00FF00"), new Section(0.75, "#FFFF00"), new Section(1,"#FF0000")];
	this.borderSize = 3;
	this.borderColor = "#000000";
	this.cursorSize = 3;
	this.font = "10px sans-serif";
	this.fontColor = "#000000";
	this.bw = 0;
	this.bh = 0;
	this.bufferX = -1;
	this.drawBackground();
	this.cursor = 0;
	this.startSpeed = 0.07;
	this.speed = this.startSpeed;
	this.nextCursor = this.cursor;
	return this;
}

Bar.prototype.initMouseOver = function(){
	;
}


Bar.prototype.setCursorSize = function(cursorSize){
	this.cursorSize = cursorSize;
}


Bar.prototype.drawBackground = function(){
	with(this){
		buffContext.font = font;
		var fontHeight = parseFloat(font.split("px")[0]);
		var fontWidth = buffContext.measureText("100%").width;
		bw = w + 3*borderSize + 3*fontWidth/2;
		bh = h + 4*borderSize + fontHeight;
		init();
		
		var previous = new Section(0,"#FFFFFF");
		var n = colors.length;
		if(vertical){
			var x = bufferX+borderSize+fontWidth/2;
			for (var i = 0; i < n; i++){
				buffContext.textBaseline = "middle";
				buffContext.textAlign = "left";
				var section = colors[i];
				var sectionH = h*(section.x - previous.x)
				var y = bufferY+borderSize+h*(1-section.x);
				buffContext.fillStyle = section.color;
				buffContext.fillRect(x, y, w, sectionH);
				buffContext.fillStyle = fontColor;
				buffContext.fillText((previous.x*100) + "%", x + w + 2*borderSize, 1+y+sectionH);
				previous = section;
			}
			buffContext.fillText("100%", x  + w + 2*borderSize, 1+bufferY+borderSize);
		}
		else{
			buffContext.textBaseline = "bottom";
			buffContext.textAlign = "center";
			var y = bufferY+borderSize;
			for (var i = 0; i < n; i++){
				var section = colors[i];
				var x = bufferX+borderSize+w*previous.x+fontWidth/2;
				var sectionW = w*(section.x - previous.x);
				buffContext.fillStyle = section.color;
				buffContext.fillRect(x, y, sectionW, h);
				buffContext.fillStyle = fontColor;
				buffContext.fillText((previous.x*100) + "%", x, y + h + 5*borderSize);
				previous = section;
			}
			buffContext.fillText("100%", bufferX+borderSize+w+fontWidth/2, y + h + 5*borderSize);
		}
		buffContext.lineCap = "round";
		buffContext.lineJoin = "round";
		buffContext.lineWidth = borderSize;
		buffContext.strokeStyle = "#000000";
		buffContext.strokeRect(bufferX+borderSize+fontWidth/2,bufferY+borderSize,w,h);
		buffContext.lineWidth = borderSize - 3.5;
		buffContext.strokeStyle = borderColor;
		buffContext.strokeRect(bufferX+borderSize+fontWidth/2,bufferY+borderSize,w,h);
	}
}

Bar.prototype.draw = function(){
	with(this){
		canvasContext.font = font;
		var fontWidth = canvasContext.measureText("100%").width;
		canvasContext.clearRect(0, 0, bw+5, bh+5);
		canvasContext.drawImage(buffer, bufferX, bufferY, bw, bh, cursorSize, cursorSize, bw, bh);
		canvasContext.lineCap = "round";
		canvasContext.lineJoin = "round";
		canvasContext.lineWidth = cursorSize;
		canvasContext.strokeStyle = "#000000";
		canvasContext.beginPath();
		if(vertical){
			var y = cursorSize+h + borderSize/2 + (borderSize-h)*cursor;
			canvasContext.moveTo(cursorSize+fontWidth/2, y);
			canvasContext.lineTo(w + 2*borderSize+2*cursorSize+fontWidth/2, y);
			
			// Displaying a box with the current value
			canvasContext.fillStyle = fontColor;
			canvasContext.textBaseline = "top";
			canvasContext.textAlign = "center";
			canvasContext.fillText(Math.round(cursor*100), cursorSize+fontWidth/2 + w/2 + borderSize, h + 3*borderSize);
		}
		else{
			var y = cursorSize+3*borderSize/2 + (w - borderSize)*cursor;
			canvasContext.moveTo(y+fontWidth/2, cursorSize);
			canvasContext.lineTo(y+fontWidth/2, h + 2*borderSize + 2*cursorSize);
			
			// Displaying a box with the current value
			canvasContext.fillStyle = fontColor;
			canvasContext.textBaseline = "middle";
			canvasContext.textAlign = "right";
			canvasContext.fillText(Math.round(cursor*100),cursorSize+ w + 2*borderSize + 3*fontWidth/2, h/2 + borderSize+1.5*cursorSize);
		}
		canvasContext.closePath();
		canvasContext.stroke();
		canvasContext.strokeStyle = "#FFFFFF";
		canvasContext.lineWidth = 3.5;
		canvasContext.stroke();
		
	}
}

Bar.prototype.hiddenAttributes = function(){
	return ["outerRadius","innerRadius","start","end","separateSections","nbBlocks","darknessRatio"];
}

Bar.prototype.attributes = function(){
	return ["w","h","vertical","borderSize","borderColor","cursor"];
}
