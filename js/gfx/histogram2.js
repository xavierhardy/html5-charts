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
function Histogram(cnvs){
	this.initMouseOver = function(){DrawnObject.prototype.initMouseOver.call(this);};
	this.prototype = new DrawnObject(cnvs);
	this.prototype.constructor = this;
	//this.update = function(){DrawnObject.prototype.update.call(this);};
	this.clearBuffer = function(){DrawnObject.prototype.clearBuffer.call(this);};
	this.init = function(){DrawnObject.prototype.init.call(this);};
	this.canvasContext = cnvs.getContext("2d");
  this.mouseIsOver = false;
	this.canvas = cnvs;
	this.w = 300;
	this.h = 200;
	this.stepx = 10;
	this.startx = 0;
	this.endx = 100;
	this.stepy = 10;
	this.starty = 0;
	this.endy = 100;
	this.colors = [new Section(0.5,"#00FF00"), new Section(0.75, "#FFFF00"), new Section(1,"#FF0000")];
	this.values = [0,10,0,10,50,20,50,20,100,50,100];
	this.xAxis = ["a","b","c","d","e","f","g","h","i","j","k"];
	this.borderSize = 2;
	this.borderColor = "#000000";
	this.cursorSize = 5;
	this.plotSize = 25;
	this.dotSize = 10;
	this.font = "10px sans-serif";
	this.bw = 0;
	this.bh = 0;
	this.bufferX = -1;
	this.space = 0;
	this.cursor = 0;
	this.nextCursor = 0;
	this.startSpeed = 0;
	this.speed = this.startSpeed;
	/*this.valueFrame = {start: 0, end: 0};
	if(this.values.length > 0){
		this.valueFrame.end = this.values[0].length-1;
	}*/
	this.drawBackground();
	this.mousePos = {x: -1, y: -1};
	this.selected = -1;
	this.canvas.drawnObject = this;
	if(this.canvas.addEventListener){
		this.canvas.addEventListener('mousemove', function(evt){this.drawnObject.move(getMousePos(this, evt));}, false);
		this.canvas.addEventListener('click', function(evt){this.drawnObject.loadValues();}, false);
		//this.canvas.addEventListener('mouseover', function(evt){this.drawnObject.isMouseOver = true;}, false);
		//this.canvas.addEventListener('mouseout', function(evt){this.drawnObject.isMouseOver = false;}, false);
		//this.canvas.addEventListener('DOMMouseScroll', function(evt){this.drawnObject.getWheel(evt)}, false);
	}
	return this;
}

Histogram.prototype.move = function(pos){
	with(this){
		mousePos = pos;
		draw();
	}
}

Histogram.prototype.loadValues = function(){ //The AJAX function
	with(this){
		var xmlhttp = initXMLHttpRequest();
		xmlhttp.onreadystatechange=function(){
			if (xmlhttp.readyState==4){
				var text = xmlhttp.responseText;
				
				//jQuery version
				var reponseTable = $(text);
				//var rows = reponseTable.getElementsByTagName('tbody')[0].rows;
				var rows = $('tr', reponseTable); //reponseTable.children[0].children[0].children;
				var n = rows.size();
				var m = 0, j = 0;
				if(n > 0){ //Make sure that it doesn't happen, i haven't tested in that case
					var row = rows.eq(0);
					t = row;
					m = row.children().size();
					var tmpXAxis = new Array(); //temporary table to avoid bugs because we are still diplaying the graph
					for(j = 0; j < m; j++){ //The names on the X Axis
						tmpXAxis[j] = row.children().eq(j).text();
					}
					
					var tmpValues = new Array();
					row = rows.eq(1);
					for(j = 0; j < m; j++){
						tmpValues[j] = parseFloat(row.children().eq(j).text());
					}
					xAxis = tmpXAxis;
					values = tmpValues;
					
					clearBuffer();
					drawBackground();
				}
			}
		}
	}
		
	//This is for test purpose
	//url = "test" + selected.i + "-" + selected.j + ".html"; //Don't do like this, use POST
	url = "test.html"; //but use the value of selected.j and selected.i
	//selected.i = graph (color) which is selected
	//selected.j = position in time selected
	//something like xAxis[selected.j] would give you the date contained at the position selected.j
	xmlhttp.open("POST", url, true);
	
	
	/*it's a table
				  row 0 (dates)						;	date1	 	;	date2		; ...	;	datem		;
				  row 1 (graph values)		;	value 0	;	value 1	; ... ;	value m	;
	*/
	
	//This function might be useful depending on the way you do it on the server side
  //xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  //xmlhttp.setRequestHeader("Content-length", content.length);
  //xmlhttp.setRequestHeader("Connection", "close");
	xmlhttp.send();
}

Histogram.prototype.clearBuffer = function(){
	with(this){
		buffContext.clearRect(bufferX, bufferY, bw, bh);
	}
}

Histogram.prototype.update = function(){
	/*with(this){
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
	}*/
}

Histogram.prototype.findCol = function(val){
	with(this){
		var i = 0, n = colors.length;
		var scale = endx-startx;
		while(i < n){
			//DEBUG += val + " ; " + scale*colors[i].x + "\n";
			if(val < scale*colors[i].x)
				return colors[i].color;
			i++;
		}
		return colors[n-1].color;
	}	
}

Histogram.prototype.drawBackground = function(){
	with(this){
		buffContext.font = font;
		var fontHeight = parseFloat(font.split("px")[0]);
		var framex = buffContext.measureText(endy).width; //The text on the left should not appear in the graph
		var frameEndWidth = buffContext.measureText(endx).width; //The text on the right might appear outside the buffer without that
		bw = w + borderSize + framex + frameEndWidth;
		bh = h + borderSize + 2*fontHeight + 3;
		init();
		var bx1 = bufferX+framex+borderSize, by1 = bufferY+fontHeight+borderSize;
		var bx2 = bx1+w, by2 = by1+h;
		
		
		//Plotting the functions
		var n = values.length; //The sets of values must all have the same size
		space = (w - n * plotSize)/2; //space between bars)
		var vi, stpy = h/(endy - starty);
		buffContext.lineSize = dotSize;
		buffContext.textBaseline = "top";
		buffContext.textAlign = "center";
		var bx = bx1 + space, by = by2+3; 
		for(var i = 0; i < n; i++){
			buffContext.fillStyle = findCol(values[i]);
			vi = values[i];
			buffContext.fillRect(bx, by2, plotSize, -stpy*values[i]);
			buffContext.strokeRect(bx, by2, plotSize, -stpy*values[i]);
			buffContext.fillStyle = "#000000";
			
			// Text on X Axis
			buffContext.fillText(xAxis[i], bx+plotSize/2, by);
			
			// Dots on X Axis
			buffContext.beginPath();
			buffContext.moveTo(bx,by2);
			buffContext.lineTo(bx,by2-4);
			buffContext.closePath();
			buffContext.stroke();
			bx += plotSize;
 		}
		
		//Y Axis
		buffContext.textBaseline = "middle";
		buffContext.textAlign = "end";
		var p = (endy-starty+1)/stepy;
		var text = starty;
		var stpy = h/p;
		bx = bx1-3;
		by = by2;
		buffContext.beginPath();
		for(var i = 0; i < p; i++){
			buffContext.fillText(text, bx, by);
			buffContext.moveTo(bx1,by);
			buffContext.lineTo(bx1+4,by);
			by -= stpy;
			text += stepy;
		}
		buffContext.closePath();
		if(dotSize > 0){
				buffContext.stroke();
		}
		
		buffContext.lineWidth = borderSize;
		buffContext.strokeStyle = borderColor;
		buffContext.beginPath();
		buffContext.moveTo(bx1, by1);
		buffContext.lineTo(bx1, by2);
		buffContext.lineTo(bx2, by2);
		buffContext.moveTo(bx1, by1);
		buffContext.closePath();
		buffContext.stroke();
	}
}
//Version with mouse wheel partially implemented, it's not as nice as I thought, so... no
/*Histogram.prototype.drawBackground = function(){
	with(this){
		buffContext.font = font;
		var fontHeight = parseFloat(font.split("px")[0]);
		var framex = buffContext.measureText(endy).width; //The text on the left should not appear in the graph
		var frameEndWidth = buffContext.measureText(endx).width; //The text on the right might appear outside the buffer without that
		bw = w + borderSize + framex + frameEndWidth;
		bh = h + borderSize + 2*fontHeight + 3;
		init();
		var bx1 = bufferX+framex+borderSize, by1 = bufferY+fontHeight+borderSize;
		var bx2 = bx1+w, by2 = by1+h;
		
		
		//Plotting the functions
		var n = values.length, m = 0, realPlotSize = 0;
		if(n > 0){
			m = 1 + valueFrame.end - valueFrame.start; //The sets of values must all have the same size
			realPlotSize = (plotSize*values[0].length)/m; //plotSize with zoom factor
		}
		space = (w - n * m * realPlotSize)/(m+1); //space between bars)
		var vi, stpy = h/(endy - starty);
		for(var i = 0; i < n; i++){
			bx = bx1 + space + i*realPlotSize;
			buffContext.fillStyle = colors[i];
			vi = values[i];
			for(var j = valueFrame.start; j <= valueFrame.end; j++){
				buffContext.fillRect(bx, by2, realPlotSize, -stpy*vi[j]);
				bx += space + n*plotSize;
			}
 		}
		
		//Axis x
		var bx = bx1 + (n*realPlotSize)/2 + space, by = by2+3;
		buffContext.fillStyle = "#000000";
		buffContext.lineSize = dotSize;
		var text = startx;
		buffContext.textBaseline = "top";
		buffContext.textAlign = "center";
		buffContext.beginPath();
		for(var i = valueFrame.start; i <= valueFrame.end; i++){
			buffContext.fillText(text, bx, by);
			buffContext.moveTo(bx,by2);
			buffContext.lineTo(bx,by2-4);
			bx += space + n*realPlotSize;
			text += stepx;
		}
		buffContext.closePath();
		if(dotSize > 0){
				buffContext.stroke();
		}
		
		//Axis y
		buffContext.textBaseline = "middle";
		buffContext.textAlign = "end";
		var p = (endy-starty+1)/stepy;
		text = starty;
		var stpy = h/p;
		bx = bx1-3;
		by = by2;
		buffContext.beginPath();
		for(var i = 0; i < p; i++){
			buffContext.fillText(text, bx, by);
			buffContext.moveTo(bx1,by);
			buffContext.lineTo(bx1+4,by);
			by -= stpy;
			text += stepy;
		}
		buffContext.closePath();
		if(dotSize > 0){
				buffContext.stroke();
		}
		
		buffContext.lineWidth = borderSize;
		buffContext.strokeStyle = borderColor;
		buffContext.beginPath();
		buffContext.moveTo(bx1, by1);
		buffContext.lineTo(bx1, by2);
		buffContext.lineTo(bx2, by2);
		buffContext.moveTo(bx1, by1);
		buffContext.closePath();
		buffContext.stroke();
	}
}*/

Histogram.prototype.draw = function(){
	with(this){
		var n = values.length;
		canvasContext.clearRect(0, 0, bw+5, bh+5);
		canvasContext.drawImage(buffer, bufferX, bufferY, bw, bh, 0, 0, bw, bh);
		if(mousePos.x != -1 && n > 0){
			var m = 0, stpx, stpy, s;
			canvasContext.font = font;
			var fontHeight = parseFloat(font.split("px")[0]);
			var framex = canvasContext.measureText(endy).width; //The text on the left should not appear in the graph
			var frameEndWidth = canvasContext.measureText(endx).width; //The text on the right might appear outside the buffer without that
			var bx1 = framex+borderSize, by1 = fontHeight+borderSize;
			var bx2 = bx1+w, by2 = by1+h;
			var bx, by;
			var cs = cursorSize/2, x = mousePos.x, y = mousePos.y;
			canvasContext.strokeStyle = "#000000";
			canvasContext.lineSize = 2;
			canvasContext.beginPath();
			if(x >= bx1+space && x < bx2-space){
				canvasContext.textBaseline = "top";
				canvasContext.textAlign = "center";
				
				selected = Math.min(n-1, Math.floor((x - (bx1+space))/plotSize));
				bx = bx1 + space + selected*plotSize;
				
				var text = xAxis[selected];
				var textWidth = canvasContext.measureText(text).width;
				
				//Drawing the value on the horizontal axis
				var val = values[selected];
				var color = findCol(val);
				canvasContext.fillStyle = lighterColor(color,0.5);
				stpy = h/(endy - starty);
				canvasContext.fillRect(bx, by2, plotSize, -stpy*values[selected]);
				canvasContext.strokeRect(bx, by2, plotSize, -stpy*values[selected]);
				
				canvasContext.textBaseline = "middle";
				canvasContext.textAlign = "end";
				by = by2 - val*stpy;
				
				//Drawing the value on the vertical axis
				text = val;
				textWidth = canvasContext.measureText(text).width;
				canvasContext.fillStyle = color;
				canvasContext.fillRect(bx1 - textWidth - 4, by - fontHeight/2 - 2, textWidth + 3, 2 + fontHeight);
				canvasContext.fillStyle = "#000000";
				canvasContext.fillText(text, bx1-3, by);				
			}
			canvasContext.closePath();
			canvasContext.stroke();
		}
	}
}

Histogram.prototype.hiddenAttributes = function(){
	return ["outerRadius","innerRadius","start","end","separateSections"];
}

Histogram.prototype.attributes = function(){
	return ["w","h","vertical","borderSize","borderColor","cursor","nbBlocks","darknessRatio"];
}
