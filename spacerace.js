var frames = 0;
var counter = 0;
var start = new Date();
var now = new Date();

class Rocket {
  constructor([[x1, y1], [x2, y2], [x3, y3]])
  {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
  get getCoor(){
    return [[this.x1,this.y1], [this.x2,this.y2], [this.x3,this.y3]];
  }
  set setCoor(coors){
    this.x1 = coors[0][0];
    this.y1 = coors[0][1];
    this.x2 = coors[1][0];
    this.y2 = coors[1][1];
    this.x3 = coors[2][0];
    this.y3 = coors[2][1];
  }
}

class Asteroid
{
  constructor([centerX, centerY, radius])
  {
    this.centerX = centerX;
    this.centerY = centerY;
    this.radius = radius;
  }
  get getCoor()
  {
    return [this.centerX, this.centerY, this.radius];
  }
  set setCoor(coors)
  {
    this.centerX = coors[0];
    this.centerY = coors[1];
    this.radius = coors[2];
  }
}
function moveObj(currCircle, objChange)
{
  var currCircleCoor = currCircle.getCoor;
  for (j = 0; j < currCircleCoor.length; j++)
  {
    currCircleCoor[j] += objChange[j];
  }
  currCircle.setCoor = currCircleCoor;
}

function drawCircle(circle)
{
  var coor = circle.getCoor;
  context.beginPath();
  context.arc(coor[0], coor[1], coor[2], 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function createCircle(height)
{
  var listOfLeftCircleArrays = [];
  var listOfRightCircleArrays = [];

  for (i = 0; i < 5; i++)
  {
    var circleCoorL = [10, Math.random() * height, 5];
    var circle = new Asteroid(circleCoorL);
    listOfLeftCircleArrays.push(circle);
  }

  //Right hand circles
  for (i = 0; i < 5; i++)
  {
    var circleCoorR = [canvas.width - 10, Math.random() * height, 5];
    var circle = new Asteroid(circleCoorR);
    listOfRightCircleArrays.push(circle);
  }

  return listOfLeftCircleArrays.concat(listOfRightCircleArrays);
}
function checkKeyDown(event)
{
  keyCode = event.which;
  keyStr = event.key;
  rocketPos = rocket1.getCoor;

  if (keyStr == 'w' || keyStr == 'W')
  {
    for (i = 0; i < 3; i++)
    {
      rocketPos[i][1] -= 15;
    }
  }

  else if (keyStr == 's' || keyStr == 'S')
  {
    for (i = 0; i < 3; i++)
    {
      rocketPos[i][1] += 15;
    }
  }

  else if (keyStr == 'q' || keyStr == "Q")
  {
    playing = false;
  }
  rocket1.setCoor = rocketPos;
}

function drawRocket(rocket)
{
  context.beginPath();
  context.moveTo(rocket.x1, rocket.y1);
  context.lineTo(rocket.x2, rocket.y2);
  context.lineTo(rocket.x3, rocket.y3);
  checkCollision(circleArrays);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "white";
  context.stroke();
}

function checkCollision(circleCoors)
{
  //Generate list of points on circle
  var avgX = 0;
  var avgY = 0;
  for (i = 0; i < circleCoors.length; i++)
  {
    var currCircle = circleCoors[i];
    for (j = 0; j < 50; j++)
    {
      var angleR = ((2 * Math.PI) / 50) * j;
      var coorX = Math.round(Math.cos(angleR) * 10 + currCircle.centerX);
      var coorY = Math.round(Math.sin(angleR) * 10 + currCircle.centerY);

      if (context.isPointInPath(coorX, coorY))
      {
        rocket1.setCoor = startRocketCoor;
      }
    }
  }
}

function fixOffScreenAsteroids(circleArrays)
{
  for (var i = 0; i < circleArrays.length; i++)
  {
    var asteroid = circleArrays[i];
    if (asteroid.centerX < -10 || asteroid.centerX > (canvas.width + 10))
    {
      if (i < (circleArrays.length / 2))
      {
        circleArrays[i].setCoor = [10, asteroid.centerY, asteroid.radius];
      }
      else
      {
        circleArrays[i].setCoor = [canvas.width - 10, asteroid.centerY, asteroid.radius];
      }
    }
  }
}

function drawPoints()
{
  context.font = "50px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";
  context.fillText(points, canvas.width / 2, canvas.height * 0.9);
}
function drawAll()
{
  if (playing) {
    counter += 1
    frames += 1;
    if (frames % 200 == 0) {
      now = new Date();
      msecs = now.getTime() - start.getTime();
      //console.log(now.getTime());
      //console.log("fps:", (frames / msecs) * 1000);
    }
    context.clearRect(0,0,canvas.width, canvas.height);
    context.fillStyle = "black";
    context.fillRect(0,0,canvas.width, canvas.height);

    //New Asteroids

    if ((counter % 50 == 0) && (counter < 601))
    {
      var circleLR = [];
      circleLR = createCircle(canvas.height);
      for (i = 0; i < 3; i++)
      {
        circleArrays.unshift(circleLR[i]);
      }
      for (i = 3; i < 6; i++)
      {
        circleArrays.push(circleLR[i]);
      }
    }
    //Move Asteroid that are offscreen to other side of screen
    fixOffScreenAsteroids(circleArrays);

    var halfArrayLength = circleArrays.length / 2;

    //Left
    for (i = 0; i < halfArrayLength; i++)
    {
      var currCircle = circleArrays[i];
      drawCircle(currCircle);
      moveObj(currCircle, circleChangeLeft);
      circleArrays[i] = currCircle;
    }
    //Right
    for (i = halfArrayLength; i < circleArrays.length; i++)
    {
      var currCircle = circleArrays[i];
      drawCircle(currCircle);
      moveObj(currCircle, circleChangeRight);
      circleArrays[i] = currCircle;
    }

    drawRocket(rocket1);

    if (rocket1.y1 > rocket1.y3 || rocket1.y1 > rocket1.y2)
    {
      throw("Not true");
    }

    if (rocket1.y1 <= 0)
    {
      points++;
      playing = false;
      frames = 0;
    }
  }

  else
  {
    frames += 1;
    console.log(frames);
    drawPoints()

    if (frames == 150)
    {
      playing = true;
      rocket1.setCoor = startRocketCoor;
      drawRocket(rocket1);
    }
  }
  window.requestAnimationFrame(drawAll);
}


// Get width/height of the browser window
windowWidth = window.innerWidth;
windowHeight = window.innerHeight;
console.log("Window is %d by %d", windowWidth, windowHeight);

// Get the canvas, set the width and height from the window
canvas = document.getElementById("mainCanvas");
// I found that - 20 worked well for me, YMMV
canvas.width = windowWidth - 20;
canvas.height = windowHeight - 20;
canvas.style.border = "1px solid black";

// Set up the context for the animation
context = canvas.getContext("2d");

context.fillStyle = "black";
context.fillRect(0,0,canvas.width, canvas.height);

var circleChangeLeft = [5, 0, 0];
var circleChangeRight = [-5, 0, 0];

var circleArrays = createCircle(canvas.height);
var currCircle = 0;

var startRocketCoor = [[canvas.width / 2, canvas.height * 0.9 - 5], [canvas.width / 2 - 10, canvas.height * 0.9 + 30], [canvas.width / 2 + 10, canvas.height * 0.9 + 30]];
var rocket1 = new Rocket(startRocketCoor);

var points = 0;
var playing = true;

document.addEventListener("keydown", checkKeyDown);
// Fire up the animation engine
window.requestAnimationFrame(drawAll);
