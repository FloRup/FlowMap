//helper functions

//Mathe functions
function distance( x1,y1,x2,y2)
{
	var distance_x = (x2 - x1);
    var distance_y = (y2 - y1);
	

  return distance = Math.sqrt((distance_x * distance_x) + (distance_y * distance_y));
}
function circleVsCircle(x1,y1,r1,x2,y2,r2 )
{
	var r = r1 + r2;
	r *= r;
	return r < (x1 + x2)^2 + (y1 + y2)^2;
}

function rectVsRect(x1,y1,w1,h1,x2,y2,w2,h2)
{
	var rect1 = {x: x1, y: y1, width: w1, height: h1}
	var rect2 = {x: x2, y: y2, width: w2, height: h2}

	if (rect1.x < rect2.x + rect2.width &&
		rect1.x + rect1.width > rect2.x &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y) 
	{
		// collision detected!
		return true;
	}

	return false;
}


function containsObject(obj, list) {
    var x;
    for (x in list) {
        if (list.hasOwnProperty(x) && list[x] === obj) {
            return true;
        }
    }

    return false;
}