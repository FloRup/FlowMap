//flowfield
//http://gamedevelopment.tutsplus.com/tutorials/understanding-goal-based-vector-field-pathfinding--gamedev-9007
//http://leifnode.com/2013/12/flow-field-pathfinding/




function tile (x,y,width,height,xIndex,yIndex)
{
	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;
	
	this.indexX=0;
	this.indexY=0;
	
	
	this.cost=1;
	this.heat=0;
	this.flow=-1;//0=hoch 1=rechts 2=unten 3=links
}
tile.prototype.drawCost = function (dt,ctx)
{
	ctx.font="10px Arial";
	ctx.fillStyle = 'red';
	ctx.fillText("C:"+this.cost,(this.x)+5,(this.y)+10);
	ctx.stroke();
}
tile.prototype.drawHeat = function (dt,ctx)
{
	ctx.font="10px Arial";
	ctx.fillStyle = 'red';
	ctx.fillText("H:"+this.heat,(this.x)+(this.width/2),(this.y)+(this.height/4));
	ctx.stroke();
}
tile.prototype.drawFlow = function (dt,ctx)
{
	if(this.flow == -1)
	{
		return;
	}
	if(this.cost == 255)
	{
		//return;
	}
	if(this.heat == 0)
	{
		return;
	}
	
	
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(this.x+(this.width/2)-2,this.y+(this.height/2)-2,4,4);
	ctx.strokeStyle = '#ff00ff';
	ctx.beginPath();
    ctx.moveTo(this.x+(this.width/2), this.y+(this.height/2));
	
	if(this.flow == 0)
	{
		ctx.lineTo(this.x+(this.width/2), this.y+2);
	}
	else if(this.flow == 1)
	{
		ctx.lineTo(this.x+this.width-2, this.y+2);
	}	
	else if(this.flow == 2)
	{
		ctx.lineTo(this.x+this.width-2, this.y+(this.height/2));
	}
	else if(this.flow == 3)
	{
		ctx.lineTo(this.x+this.width-2, this.y+this.height-2);
	}
	else if(this.flow == 4)
	{
		ctx.lineTo(this.x+(this.width/2), this.y+this.height-2);
	}
	else if(this.flow == 5)
	{
		ctx.lineTo(this.x+2, this.y+this.height-2);
	}
	else if(this.flow == 6)
	{
		ctx.lineTo(this.x+2, this.y+(this.height/2));
	}
	else if(this.flow == 7)
	{
		ctx.lineTo(this.x+2, this.y+2);
	}
	
    ctx.stroke();
}


tile.prototype.drawRect = function (dt,ctx)
{
// Red rectangle
	ctx.beginPath();
	//linewitdh is böse!!! schluckt frames zum frühstück
	ctx.strokeStyle="#ff0000";
	ctx.rect(this.x,this.y,this.width,this.height); 
	ctx.stroke();
}


tile.prototype.drawMap = function (dt,ctx)
{
	
	if(this.heat==0)
	{
		ctx.fillStyle = "rgb(200,0,200)";
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
	else
	{
		if(this.cost == 1)
		{
			return;
		}
		ctx.fillStyle = "rgb(" + (200-(this.cost*3)) + "," + (200-(this.cost*3)) +"," + (200-(this.cost*3)) +")";
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
	
}


	
function flowField (width, height, tileNumber)
{	
	this.width=width;
	this.height=height;
	
	this.numberOfTiles=tileNumber;
	
	this.tileWidth = this.width / this.numberOfTiles;
	this.tileHeight = this.height / this.numberOfTiles;
	
	this.goalX=0;
	this.goalY=0;
	
	this.goalIndexX=0;
	this.goalIndexY=0;
	
	
	//tile array
	this.tiles = new Array(this.numberOfTiles);

	for (var i = 0; i < this.numberOfTiles; i++) 
	{
		this.tiles[i] = new Array(this.numberOfTiles);
	}
	
	//tile array mit objecten füllen
	
	for(var i=0; i< this.numberOfTiles ; i++)
	{
		for(var x=0; x< this.numberOfTiles ;x++)
		{
			this.tiles[i][x] = new tile(i*this.tileWidth,x*this.tileHeight,this.tileWidth,this.tileHeight,i,x);
		}
	}
	this.resetCost();
	this.resetHeat();
}

flowField.prototype.drawStats = function (dt,ctx)
{
	for(var i=0; i< this.numberOfTiles ; i++)
	{
		for(var x=0; x< this.numberOfTiles ;x++)
		{
			this.tiles[i][x].drawRect(dt,ctx);
			this.tiles[i][x].drawHeat(dt,ctx);
			this.tiles[i][x].drawFlow(dt,ctx);
			this.tiles[i][x].drawCost(dt,ctx);
		}
	}
}

flowField.prototype.resetCost= function ()
{
	for(var i=0; i< this.numberOfTiles ; i++)
	{
		for(var x=0; x< this.numberOfTiles ;x++)
		{
			this.tiles[i][x].cost = 1;
			
			//der vector fehlt noch
		}
	}
}

flowField.prototype.resetHeat= function ()
{
	for(var i=0; i< this.numberOfTiles ; i++)
	{
		for(var x=0; x< this.numberOfTiles ;x++)
		{
			
			this.tiles[i][x].heat = 655;
			this.tiles[i][x].flow = -1;
			//der vector fehlt noch
		}
	}
}


flowField.prototype.setUnpassable= function (x,y)
{
	var indexX=Math.floor(x/this.tileWidth);
	var indexY=Math.floor(y/this.tileHeight);

	if(this.tiles[indexX][indexY].cost==255)
	{
		return;
	}
	
	
	this.tiles[indexX][indexY].cost=255;
	
	
	this.generateHeatmap();
	this.generateFlowmap();
}

flowField.prototype.drawMap= function (dt,ctx)
{
	for(var i=0; i< this.numberOfTiles ; i++)
	{
		for(var x=0; x< this.numberOfTiles ;x++)
		{
			this.tiles[i][x].drawMap(dt,ctx);
		}
	}
}

flowField.prototype.setGoal= function (x,y)
{
	this.goalX=x;
	this.goalY=y;
	
	var indexX=Math.floor(x/this.tileWidth);
	var indexY=Math.floor(y/this.tileHeight);
	
	this.goalIndexX=indexX;
	this.goalIndexY=indexY;
	
	this.tiles[indexX][indexY].heat=0;
	
	this.generateHeatmap();
	this.generateFlowmap();
}

flowField.prototype.setCost= function (x,y,cost)
{
	this.resetHeat();
	
	
	
	var indexX=Math.floor(x/this.tileWidth);
	var indexY=Math.floor(y/this.tileHeight);
	
	this.tiles[indexX][indexY].cost=cost;
	
	this.generateHeatmap();
	this.generateFlowmap();
}
flowField.prototype.generateFlowmap= function ()
{
	for(var i=0;i< this.numberOfTiles ;i++)
	{
		for(var x=0; x< this.numberOfTiles ; x++)
		{
			var current = this.tiles[i][x];
			
			if(current.cost ==255)
			{
				//break;
			}
		
			var currentIndexX=Math.floor(current.x/this.tileWidth);//x und y indey vom current bekommen
			var currentIndexY=Math.floor(current.y/this.tileHeight);//x und y indey vom current bekommen
		
			var lowestHeat=66666;
		
			//alle nachbarn
			if((currentIndexX +1) < this.tiles.length )//rechts
			{
				if(this.tiles[currentIndexX +1][currentIndexY].heat < lowestHeat)
				{
					current.flow=2;
					lowestHeat=current.heat;
				}
			}
			if((currentIndexX -1) >= 0 )//links
			{
				if(this.tiles[currentIndexX -1][currentIndexY].heat < lowestHeat)
				{
					current.flow=6;
					lowestHeat=current.heat;
				}
			}
			if((currentIndexY +1) < this.tiles.length )//runter
			{
				if(this.tiles[currentIndexX][currentIndexY +1].heat < lowestHeat)
				{
					current.flow=4;
					lowestHeat=current.heat;
				}
			}
			if((currentIndexY -1) >= 0 )//hoch
			{
				if(this.tiles[currentIndexX][currentIndexY -1].heat < lowestHeat)
				{
					current.flow=0;
					lowestHeat=current.heat;
				}
			}
			//die schrägen fehlen noch
			/*
			if(((currentIndexX +1) < this.tiles.length)&&((currentIndexY -1) >= 0) )//rechts hoch
			{
				if(this.tiles[currentIndexX +1][currentIndexY-1].heat < lowestHeat)
				{
					current.flow=1;
					lowestHeat=current.heat;
				}
			}
			if(((currentIndexX +1) < this.tiles.length)&& ((currentIndexY +1) < this.tiles.length ))//rechts unten
			{
				if(this.tiles[currentIndexX +1][currentIndexY+1].heat < lowestHeat)
				{
					current.flow=3;
					lowestHeat=current.heat;
				}
			}
			if(((currentIndexX -1) >= 0)&&((currentIndexY +1) < this.tiles.length ) )//links runter
			{
				if(this.tiles[currentIndexX -1][currentIndexY+1].heat < lowestHeat)
				{
					current.flow=5;
					lowestHeat=current.heat;
				}
			}
			if(((currentIndexX -1) >= 0)&&((currentIndexY -1) >= 0) )//links hoch
			{
				if(this.tiles[currentIndexX -1][currentIndexY-1].heat < lowestHeat)
				{
					current.flow=7;
					lowestHeat=current.heat;
				}
			}
			
			*/
			
			
			
			
			
			
			
		}
	}

}
flowField.prototype.isPathable = function (x,y)
{
	if((x<0)||(x>this.width))
	{
		return -1;
	}
	else if((y<0)||(y>this.width))
	{
		return -1;
	}

	var indexX=Math.floor(x/this.tileWidth);
	var indexY=Math.floor(y/this.tileHeight);
	
	if(this.tiles[indexX][indexY].heat >= 655)
	{
		return false;
	}
	
	return true;
}

flowField.prototype.getFlow= function (x,y)
{
	if((x<0)||(x>this.width))
	{
		return -1;
	}
	else if((y<0)||(y>this.width))
	{
		return -1;
	}

	var indexX=Math.floor(x/this.tileWidth);
	var indexY=Math.floor(y/this.tileHeight);
	
	
	
	
	return this.tiles[indexX][indexY].flow;
}


flowField.prototype.generateHeatmap= function ()
{
	this.resetHeat();
	
	var openList = [];
	
	//Set goal node cost to 0 and add it to the open list
	this.tiles[this.goalIndexX][this.goalIndexY].heat=0;
	openList.push(this.tiles[this.goalIndexX][this.goalIndexY]);
	
	
	while(openList.length > 0)
	{
		var current = openList.shift();//erste element nehmen und aus liste nehmen
		
		var currentIndexX=Math.floor(current.x/this.tileWidth);//x und y indey vom current bekommen
		var currentIndexY=Math.floor(current.y/this.tileHeight);//x und y indey vom current bekommen
		
		var neighbors = [];
		// alle nachbarn des current nodes in neighbors packen
		if((currentIndexX +1) < this.tiles.length )//rechts
		{
			if((this.tiles[currentIndexX +1][currentIndexY].cost != 255)&&(this.tiles[currentIndexX +1][currentIndexY].heat == 655))
			{
				neighbors.push(this.tiles[currentIndexX +1][currentIndexY]);
			}
			
		}
		if((currentIndexX -1) >= 0 )//links
		{
			if((this.tiles[currentIndexX -1][currentIndexY].cost != 255)&&(this.tiles[currentIndexX -1][currentIndexY].heat == 655))
			{
			neighbors.push(this.tiles[currentIndexX -1][currentIndexY]);
			}
		}
		if((currentIndexY +1) < this.tiles.length )//runter
		{
			if((this.tiles[currentIndexX ][currentIndexY +1].cost != 255)&&(this.tiles[currentIndexX ][currentIndexY +1].heat == 655))
			{
			neighbors.push(this.tiles[currentIndexX][currentIndexY +1]);
			}
		}
		if((currentIndexY -1) >= 0 )//hoch
		{
			if((this.tiles[currentIndexX ][currentIndexY-1].cost != 255)&&(this.tiles[currentIndexX ][currentIndexY-1].heat == 655))
			{
			neighbors.push(this.tiles[currentIndexX][currentIndexY -1]);
			}
		}
		

		//test
		for(var i=0;i<neighbors.length;i++)
		{
		
			//in openlist hinzufügen wenns nicht schon drin is
			
			if(neighbors[i].heat >= 655)
			{
				neighbors[i].heat=current.heat + neighbors[i].cost;
				openList.push(neighbors[i]);
			}
		}
	}
}








