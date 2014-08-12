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
function DrawnObject(cnvs){
	this.canvasContext = cnvs.getContext("2d");
	this.w = 0;
	this.h = 0;
	this.start = 0;
	this.end = 0;
	this.colors = 0;
	this.borderSize = 0;
	this.borderColor = 0;
	this.cursorSize = 0;	
	this.cursor = 0;
	this.startSpeed = 0;
	this.speed = this.startSpeed;
	this.cursor = 0;
	this.nextCursor = this.cursor;
	return this;
}

DrawnObject.prototype.init = function(){
	if(this.bufferX == -1){
		if(bufferUse.x + this.bw + 10 > buffer.width){
			bufferUse.x = 20;
			bufferUse.y1 = bufferUse.y2 + 10;
		}
		
		this.bufferX = bufferUse.x;
		this.bufferY = bufferUse.y1;
		
		bufferUse.x += this.bw + 10;
		bufferUse.y2 = Math.max(bufferUse.y2, bufferUse.y1 + this.bh + 10);
	}
}


DrawnObject.prototype.clearBuffer = function(){
	with(this){
		buffContext.clearRect(bufferX, bufferY, bw, bh);
	}
}

DrawnObject.prototype.update = function(){
	with(this){
		var d = Math.abs(nextCursor - cursor);
		if(d > epsilon)
			speed = d * startSpeed;
		if(d < epsilon){
			if(speed != startSpeed)
				speed = startSpeed;
		}
		else if	(nextCursor > cursor)
			cursor += speed;
		else if (nextCursor < cursor)
			cursor -= speed;
	}
}

