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
var epsilon = 0.0001;


function randHEX(){
	var rand = Math.floor(16*Math.random());
 	switch(rand){
		case 10: rand = 'A'; break;
		case 11: rand = 'B'; break;
		case 12: rand = 'C'; break;
		case 13: rand = 'D'; break;
		case 14: rand = 'E'; break;
		case 15: rand = 'F'; break;
	}
	return "" + rand;
}
		
function randColor(){
	return "#" + randHEX() + randHEX() + randHEX() + randHEX() + randHEX() + randHEX();
}

function parseHex(x){
		x = parseInt(x).toString('16');
		if(x.length == 1)
			x = '0' + x;
		return x;
}
		
function checkValue(element, minval, maxval, int){
	if(int)
		var val = parseInt(element.value);
	else
		var val = parseFloat(element.value);
	if(isNaN(val) || val > maxval)
		element.value = maxval;
	else if(val < minval)
		element.value = minval;
}

function Section(x, color){
	this.x = x;
	this.color = color;
}

function draw_text(txt,x,y,size,color){
	context.font = size+'px Arial';
	context.fillStyle = color;
	context.fillText(txt, x, y);
	context.strokeStyle = "#000000";
	context.strokeText(txt, x, y);
}

function pathArc(context, cx, cy, radius, a1, a2){
		context.beginPath();
		context.arc(cx, cy, radius, a1, a2, false);
		context.lineTo(cx, cy);
		context.closePath();
}

var pad = function(num, totalChars) {
    var pad = '0';
    num = num + '';
    while (num.length < totalChars) {
        num = pad + num;
    }
    return num;
};

// Ratio is between 0 and 1
var changeColor = function(color, ratio, darker) {
	var max0 = function(x){return Math.max(0,x);};
	var min255 = function(x){return Math.min(255,x);};
  var difference = Math.round(ratio * 255) * (darker ? -1 : 1),
  		minmax     = darker ? max0 : min255,
   	  decimal    = color.replace(/^#?([a-z0-9][a-z0-9])([a-z0-9][a-z0-9])([a-z0-9][a-z0-9])/i,
            function() {
                return parseInt(arguments[1], 16) + ',' +
                    parseInt(arguments[2], 16) + ',' +
                    parseInt(arguments[3], 16);
            }
        ).split(/,/);
  return [
        '#',
        pad(minmax(parseInt(decimal[0], 10) + difference).toString(16), 2),
        pad(minmax(parseInt(decimal[1], 10) + difference).toString(16), 2),
        pad(minmax(parseInt(decimal[2], 10) + difference).toString(16), 2)
    ].join('');
};
var lighterColor = function(color, ratio) {
    return changeColor(color, ratio, false);
};
var darkerColor = function(color, ratio) {
    return changeColor(color, ratio, true);
};

function getMousePos(canvas, evt){
    //canvas position
    var obj = canvas;
    var top = 0;
    var left = 0;
    while (obj && obj.tagName != 'BODY') {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
 
    //relative mouse position
    var mouseX = evt.clientX - left + window.pageXOffset;
    var mouseY = evt.clientY - top + window.pageYOffset;
    return {x: mouseX, y: mouseY};
}

function initXMLHttpRequest(){
	var xmlhttp;
	if (window.XMLHttpRequest)	// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	else	// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	return xmlhttp;
}

/*function drawRotatedText(ctx, cnvs, x, y, text, maxWidth) {
		ctx.save();
		//ctx.fillText("blabla1", 100, 100);
		ctx.translate(50,50);
		ctx.rotate(-45 * Math.PI / 180);
		ctx.font = "10px sans-serif";
		ctx.fillStyle = "#000000";
		ctx.fillText("blabla2", 100, 100);
		//ctx.drawImage(cnvs, 10, 10, 500, 500, 10, 10, 500, 500);
		ctx.fillText("blabla2", 0, 0);
		ctx.fillText("blabla2", 50, 0);
		ctx.fillText("blabla2", 50, 20);
		ctx.fillText("blabla2", 50, 40);
		ctx.restore();
		//ctx.fillText("blabla3", 50, 50);
    //metric will receive the measures of the text
    var textWidth = ctx.measureText(text); 
    //console.log(metric.width);

    ctx.save(); // this will "save" the normal canvas to return to
    if(maxWidth != null && textWidth > maxWidth) {
        // These two methods will change EVERYTHING
        // drawn on the canvas from this point forward
        // Since we only want them to apply to this one fillText,
        // we use save and restore before and after

        // We want to find the center of the text (or whatever point you want) and rotate about it
        var tx = x + (textWidth/2);
        var ty = y + 5;

        // Translate to near the center to rotate about the center
        ctx.translate(tx,ty);
        // Then rotate...
        ctx.rotate(60);
        // Then translate back to draw in the right place!
        ctx.translate(-tx,-ty);
    }
    ctx.fillText(text, x, y);
    ctx.restore(); // This will un-translate and un-rotate the canvas
}*/

