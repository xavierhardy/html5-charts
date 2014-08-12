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
function Round(cnvs){
	this.prototype = new DrawnObject(cnvs);
	this.prototype.constructor = this;
	this.update = function(){DrawnObject.prototype.update.call(this);};
	this.clearBuffer = function(){DrawnObject.prototype.clearBuffer.call(this);};
	this.init = function(){DrawnObject.prototype.init.call(this);};
	this.canvasContext = cnvs.getContext("2d");
	this.outerRadius = 100;
	this.innerRadius = 10;
	this.setStart(90);
	this.setEnd(270);
	this.setCursorSize(5);
	this.colors = [new Section(0.5,"#00FF00"), new Section(0.75, "#FFFF00"), new Section(1,"#FF0000")];
	this.borderSize = 3;
	this.borderColor = "#000000";
	this.separateSections = false;
	this.font = "10px sans-serif";
	this.fontColor = "#000000";
	this.size = 0;
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

Round.prototype.initMouseOver = function(){
	;
}

Round.prototype.setStart = function(start){
	this.start = (Math.PI*(start+90))/180;
}

Round.prototype.setEnd = function(end){
	this.end = (Math.PI*(end+90))/180;
}

Round.prototype.setCursorSize = function(cursorSize){
	//this.cursorSize = (Math.PI*(cursorSize))/180;
	this.cursorSize = cursorSize;
}


Round.prototype.drawBackground = function(){
	with(this){
		var fontWidth = buffContext.measureText("100%").width;
		var fontHeight = parseFloat(font.split("px")[0]);
		size = 2*outerRadius + 3*borderSize+2*fontWidth;
		bh = size;
		bw = size;
		init();
		clearBuffer();
		var cx = bufferX + outerRadius + 2*borderSize+fontWidth;
		var cy = bufferY + outerRadius + 2*borderSize+fontWidth;
		var previous = new Section(0,"#FFFFFF");
		var l = end-start;
		var n = colors.length;
		buffContext.lineCap = "round";
		buffContext.lineJoin = "round";
		buffContext.lineWidth = borderSize;
		buffContext.strokeStyle = "#000000";
		var a1, a2 = start+l;
		buffContext.textBaseline = "middle";
		buffContext.textAlign = "center";
		var textRadiusX = outerRadius+2*fontWidth/3;
		var textRadiusY = outerRadius+2*fontHeight/3;
		for (var i = 0; i < n; i++){
			var section = colors[i];
			a1 = start+l*previous.x;
			a2 = start+l*section.x;
			buffContext.fillStyle = section.color;
			pathArc(buffContext, cx, cy, outerRadius, a1, a2);
			buffContext.fill();
			if(separateSections)
				buffContext.stroke();
			buffContext.fillStyle = fontColor;
			buffContext.fillText((previous.x*100) + "%", cx + textRadiusX * Math.cos(a1), cy + textRadiusY * Math.sin(a1));
			previous = section;
		}
		buffContext.fillText("100%", cx + textRadiusX * Math.cos(a2), cy + textRadiusY * Math.sin(a2));
		buffContext.fillStyle = "#FFFFFF";
		buffContext.strokeStyle = borderColor;
		pathArc(buffContext, cx, cy, innerRadius, start, end);
		buffContext.fill();
		buffContext.stroke();
		if(!separateSections){
			pathArc(buffContext, cx, cy, outerRadius, start, end);
			buffContext.stroke();
		}
	}
}

Round.prototype.draw = function(){
	with(this){
		canvasContext.font = font;
		var fontWidth = canvasContext.measureText("100%").width;
		var fontHeight = parseFloat(font.split("px")[0]);
		var y = start + (end-start)*cursor;
		var cx = outerRadius + 2*borderSize+fontWidth;
		var cy = outerRadius + 2*borderSize+fontWidth;
		canvasContext.clearRect(0, 0, bw+5, bh+5);
		canvasContext.drawImage(buffer, bufferX, bufferY, size, size, 0, 0, size, size);
		canvasContext.lineWidth = cursorSize;
		canvasContext.strokeStyle = "#990000";
		canvasContext.beginPath();
		canvasContext.moveTo(cx, cy);
		canvasContext.lineTo(cx + outerRadius * Math.cos(y), cy + outerRadius * Math.sin(y));
		canvasContext.moveTo(cx, cy);
		canvasContext.closePath();
		canvasContext.stroke();
		canvasContext.fillStyle = fontColor;
		canvasContext.textBaseline = "middle";
		canvasContext.textAlign = "center";
		canvasContext.fillText(Math.round(cursor*100), cx, cy + fontHeight);
	}
}

Round.prototype.hiddenAttributes = function(){
	return ["w","h","vertical","nbBlocks","darknessRatio"];
}

Round.prototype.attributes = function(){
	return ["outerRadius","innerRadius","start","end","borderSize","borderColor","separateSections","cursor"];
}
