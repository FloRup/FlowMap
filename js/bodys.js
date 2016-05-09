//Bodies classen und so




//body class
function body(x,y,xVel,yVel,mass)
{
	this.x=x;
	this.y=y;
	this.xVel=xVel;
	this.yVel=yVel;
	this.mass=mass;
	this.grip=0.95;
}
body.prototype.update=function(dt)//bewegen
{
	this.xVel = this.xVel*this.grip;
	this.yVel = this.yVel*this.grip;

	this.x += (this.xVel*dt);
	this.y += (this.yVel*dt);
}
body.prototype.handleColl=function (other)//collisions handling
{
	alert("ERROR:Nicht in basis classe defineirt");
}
body.prototype.draw=function(dt)
{
	alert("ERROR:Nicht in basis classe defineirt");
}

//circle class
box.prototype = new body();//circle erbt von body
box.prototype.constructor=box;//circle bekommt eigenen constructor
function box(x,y,w,h)
{
	this.x=x;
	this.y=y;
	this.xVel=xVel;
	this.yVel=yVel;
	this.w=w;
	this.h=h;
	
	this.moveSpeed=2;

}

box.prototype.draw= function (dt,ctx)
{
	ctx.fillRect(this.x,this.y,this.w,this.h);
}




//circle class
circle.prototype = new body();//circle erbt von body
circle.prototype.constructor=circle;//circle bekommt eigenen constructor
function circle(x,y,xVel,yVel,r,m)
{
	this.x=x;
	this.y=y;
	this.xVel=xVel;
	this.yVel=yVel;
	this.mass=m;
	this.r=r;
	
	this.moveSpeed=2;

}

circle.prototype.moveAtFlow=function (flow)//collisions handling
{
	if(flow == 0)
	{
		this.yVel -= this.moveSpeed;
	}
	else if(flow == 1)
	{
		this.xVel+= this.moveSpeed;
		this.yVel-= this.moveSpeed;
	}
	else if(flow == 2)
	{
		this.xVel+= this.moveSpeed;
	}
	else if(flow == 3)
	{
		this.xVel+= this.moveSpeed;
		this.yVel+= this.moveSpeed;
	}
	else if(flow == 4)
	{
		this.yVel += this.moveSpeed;
	}
	else if(flow == 5)
	{
		this.xVel-= this.moveSpeed;
		this.yVel+= this.moveSpeed;
	}
	else if(flow == 6)
	{
		this.xVel-= this.moveSpeed;
	}
	else if(flow == 7)
	{
		this.xVel-= this.moveSpeed;
		this.yVel-= this.moveSpeed;
	}
	
}
circle.prototype.handleColl=function (other)//collisions handling
{
	console.log("noch nicht implementiert");
}

circle.prototype.draw= function (dt,ctx)
{
	ctx.beginPath();
	ctx.strokeStyle="#ff00ff";
	ctx.arc(this.x,this.y,this.r,0,2*Math.PI);
	ctx.stroke();
	//console.log("x="+this.x+"y="+this.y+"r="+this.r);
}
