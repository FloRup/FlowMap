//quellen
/*
//Physic
http://www.wildbunny.co.uk/blog/2011/04/06/physics-engines-for-dummies/
http://gamedevelopment.tutsplus.com/tutorials/how-to-create-a-custom-2d-physics-engine-the-basics-and-impulse-resolution--gamedev-6331
//js
http://stackoverflow.com/questions/387707/whats-the-best-way-to-define-a-class-in-javascript
http://phrogz.net/JS/classes/OOPinJS2.html
http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/
*/





//canvas variablen
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;


//fullscreen test
function goFullScreen(){
    if(canvas.requestFullScreen)
        canvas.requestFullScreen();
    else if(canvas.webkitRequestFullScreen)
        canvas.webkitRequestFullScreen();
    else if(canvas.mozRequestFullScreen)
        canvas.mozRequestFullScreen();
}


//kepressed

var keys= new Array(300);
for(var i=0; i<300;i++){keys[i]=false;}

window.addEventListener('keyup',keyUpListener,false);
window.addEventListener('keydown',keyDownListener,false); 

function keyUpListener(e)
{
	var code = e.keyCode;
	keys[code]=false;
}
function keyDownListener(e)
{
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }

	var code = e.keyCode;
	keys[code]=true;
}

//mouse
var mouseDown = false;
var mouseX=0;
var mouseY=0;

canvas.addEventListener("mousedown", getPosition, false);
canvas.addEventListener("mouseup", up, false);
function getPosition(event)
{
	mouseDown=true;
		
}

function up(event)
{
	mouseDown=false;
}


canvas.addEventListener('mousemove', function(evt) {
var x = new Number();
        var y = new Number();
        

        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;

        mouseX=x;
		mouseY=y;
}, false);




//object variablen
var bodys= [];//Array aller kreise

for(var i=0; i< 20;i++)
{
	bodys.push(new circle((i+1)*50,10,0,0,15,5));
}


//flowmap erstellen
var flow = new flowField(canvas.width,canvas.height,20);







//update
function update(dt)
{
	if(mouseDown)
	{
		flow.setUnpassable(mouseX,mouseY);
	}

	if(keys['1'.charCodeAt(0)]==true)
	{
		flow.setGoal(mouseX,mouseY);
	}
	
	if(keys['2'.charCodeAt(0)]==true)
	{
		flow.setCost(mouseX,mouseY,50);
	}
	
	if(keys['3'.charCodeAt(0)]==true)
	{
		flow.setCost(mouseX,mouseY,1);
	}
	if(keys['4'.charCodeAt(0)]==true)
	{
		for(var i=0; i< 10;i++)
		{
			bodys.push(new circle((i+1)*100,10,0,0,15,5));
		}
	}
	
	

	//kreise updaten
	for( var i=0; i<bodys.length;i++)
	{
		bodys[i].update(dt);
		
		if(flow.isPathable(bodys[i].x,bodys[i].y))
		{
			bodys[i].moveAtFlow(flow.getFlow(bodys[i].x,bodys[i].y));
		}
		
	}
	
	//collision
	
	
	
}


//rendern
function render(dt)
{	
	//Clearen
	ctx.fillStyle = "#505050";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	
	flow.drawMap(dt,ctx);
	if(keys[' '.charCodeAt(0)]==true)
	{
		flow.drawStats(dt,ctx);
	}
	
	//kreise malen
	for( var i=0; i<bodys.length;i++)
	{
		bodys[i].draw(dt,ctx);
	}
	
	
	
	
}












//MAin loop
var now;
var dt   = 0;
var last = new Date().getTime();;// timestamp() functionerte nicht und bin mir nicht sicher ob der restliche code mit dieser function functioniert
var step = 1/60;
	
var fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'dark',heat:  1, left: '5px' ,history: 25});//FPS meter

	

function frame() 
{
	fpsmeter.tickStart();
	now = new Date().getTime();;
	dt = dt + Math.min(1, (now - last) / 1000);//dt is capped bei 1s
  
	while(dt > step) //Mehrmals machen falls dt zu groß ist um bullet throgh paper zu verhindern
	{
		dt = dt - step;
		update(step);
	}
  
	render(dt);
	last = now;
	
	requestAnimationFrame(frame);
	fpsmeter.tick();
}

requestAnimationFrame(frame);


