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
function VolumeBar(cnvs){
	this.prototype = new DrawnObject(cnvs);
	this.prototype.constructor = this;
	this.update = function(){DrawnObject.prototype.update.call(this);};
	this.clearBuffer = function(){DrawnObject.prototype.clearBuffer.call(this);};
	this.init = function(){DrawnObject.prototype.init.call(this);};
	this.canvasContext = cnvs.getContext("2d");
	this.w = 140;
	this.h = 20;
	this.vertical = false;
	this.nbBlocks = 14;
	this.darknessRatio = 0.60;
	this.colors =  [new Section(0.5,"#00FF00"), new Section(0.75, "#FFFF00"), new Section(1,"#FF0000")];
	this.borderSize = 3;
	this.borderColor = "#000000";
	this.cursorSize = 3;
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

VolumeBar.prototype.initMouseOver = function(){
	;
}

VolumeBar.prototype.setCursorSize = function(cursorSize){
	this.cursorSize = cursorSize;
}


VolumeBar.prototype.drawBackground = function(){
	with(this){
		bw = w + 2*borderSize;
		bh = h + 2*borderSize;
		init();
		var j = 0;
		var y = 0;
		var n = colors.length;
		var darkColors = new Array();
		for(j = 0; j < n; j++)
			darkColors[j] = darkerColor(colors[j].color, darknessRatio);
		j = 0;
		var section = colors[0];
		if(vertical){
			var s = h/nbBlocks;
			var rs = s-1;
			for (var i = 0; i < nbBlocks; i++){
				buffContext.fillStyle = darkColors[j];
				buffContext.fillRect(bufferX+borderSize, bufferY+borderSize+s*(nbBlocks-i), w, rs);
				y += 1/nbBlocks;
				if(section.x < y){
					j++;
					section = colors[j];
				}
			}
		}
		else{
			var s = w/nbBlocks;
			var rs = s-1;
			for (var i = 0; i < nbBlocks; i++){
				buffContext.fillStyle = darkColors[j];
				buffContext.fillRect(bufferX+borderSize+s*i, bufferY+borderSize, rs, h);
				y += 1/nbBlocks;
				if(section.x < y){
					j++;
					section = colors[j];
				}
			}
		}
	}
}

VolumeBar.prototype.draw = function(){
	with(this){
		/*canvasContext.lineCap = "round";
		canvasContext.lineJoin = "round";
		canvasContext.lineWidth = cursorSize;
		canvasContext.strokeStyle = "#000000";
		canvasContext.beginPath();*/
		var section = colors[0];
		var realColor = section.color;
		canvasContext.clearRect(0, 0, bw+5, bh+5);
		canvasContext.drawImage(buffer, bufferX, bufferY, bw, bh, 0, 0, bw, bh);
		if(vertical){
			var s = h/nbBlocks;
			var rs = s-1;
			var y = 0, j = 0;
			var n = Math.ceil(cursor*nbBlocks);
			for (var i = 0; i < n; i++){
				if(i == n-1)
					realColor = darkerColor(section.color, (n - nbBlocks*cursor)*darknessRatio);
				canvasContext.fillStyle = realColor;
				canvasContext.fillRect(borderSize, borderSize+s*(nbBlocks-i), w, rs);
				y += 1/nbBlocks;
				if(section.x < y){
					j++;
					section = colors[j];
					if(section != undefined)
						realColor = section.color;
				}
			}
		}
		else{
			var s = w/nbBlocks;
			var rs = s-1;
			var y = 0, j = 0;
			var n = Math.ceil(cursor*nbBlocks);
			for (var i = 0; i < n; i++){
				if(i == n-1)
					realColor = darkerColor(section.color, (n - nbBlocks*cursor)*darknessRatio);
				canvasContext.fillStyle = realColor;
				canvasContext.fillRect(borderSize+s*i, borderSize, rs, h);
				y += 1/nbBlocks;
				if(section.x < y){
					j++;
					section = colors[j];
					if(section != undefined)
						realColor = section.color;
				}
			}
		}
		/*canvasContext.closePath();
		canvasContext.stroke();
		canvasContext.strokeStyle = "#FFFFFF";
		canvasContext.lineWidth = 3.5;
		canvasContext.stroke();*/
	}
}

VolumeBar.prototype.hiddenAttributes = function(){
	return ["outerRadius","innerRadius","start","end","separateSections"];
}

VolumeBar.prototype.attributes = function(){
	return ["w","h","vertical","borderSize","borderColor","cursor","nbBlocks","darknessRatio"];
}
